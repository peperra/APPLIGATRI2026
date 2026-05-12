// api/ligas.js  ← coloca este archivo en la raíz del repo, en /api/ligas.js
// Vercel lo despliega automáticamente como serverless function en /api/ligas

import { gunzipSync } from 'zlib'

const S3_URL = 'https://fetri2025-data.s3.dualstack.eu-west-3.amazonaws.com/Leagues'

// Liga ID → divisiones del S3 → clave de tu app
const LIGA_MAP = {
  44: { '1M 2026': '1M', '2M 2026': '2M' }, // SUZUKI
  43: { '1F 2026': '1F', '2F 2026': '2F' }, // IBERDROLA
}

export default async function handler(req, res) {
  try {
    const response = await fetch(S3_URL, {
      headers: {
        Origin: 'https://live.triatlon.org',
        Referer: 'https://live.triatlon.org/',
      },
    })

    if (!response.ok) throw new Error(`S3 error: ${response.status}`)

    const buffer = await response.arrayBuffer()
    const text = gunzipSync(Buffer.from(buffer)).toString('utf-8').replace(/^\uFEFF/, '')
    const leagues = JSON.parse(text)

    // resultado: { "1M": { 1:[j1pts,j2pts,...], 2:[...], ... }, "2M": {...}, ... }
    const result = {}

    for (const liga of leagues) {
      const divMap = LIGA_MAP[liga.Id]
      if (!divMap) continue

      for (const round of liga.Rounds) {
        if (!round.ExcelJson) continue
        let ej
        try { ej = JSON.parse(round.ExcelJson) } catch { continue }

        for (const [divName, clubs] of Object.entries(ej)) {
          const divKey = divMap[divName]
          if (!divKey) continue
          if (!result[divKey]) result[divKey] = {}

          for (const club of clubs) {
            const dorsal = parseInt(club.Dorsal)
            if (!dorsal) continue
            const jIdx = round.RoundNumber - 1   // 0-based
            const pts = club.Total ?? 0

            if (!result[divKey][dorsal]) result[divKey][dorsal] = [0,0,0,0,0,0,0]
            result[divKey][dorsal][jIdx] = pts
          }
        }
      }
    }

    // caché en Vercel Edge: 5 min, sirve stale mientras recalcula
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
    res.setHeader('Access-Control-Allow-Origin', '*')
    return res.json({ ok: true, data: result, ts: Date.now() })

  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok: false, error: err.message })
  }
}
