// src/useFetriData.js

import { useState, useEffect } from 'react'

export function useFetriData() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [ts, setTs]           = useState(null)

  const load = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/ligas')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      if (!json.ok) throw new Error(json.error)
      setData(json.data)
      setTs(new Date(json.ts).toLocaleTimeString('es-ES'))
      setError(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return { data, loading, error, ts, reload: load }
}
