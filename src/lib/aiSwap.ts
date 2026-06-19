// Human-first note: the stage-safety net. It calls a Claude-backed endpoint but can NEVER hang the
// app: a ~2.5s timeout aborts the request and it returns null on any timeout/error, so the caller
// simply keeps its seeded line. This is what lets the live demo stay flawless even on dead venue wifi.
export async function aiSwap<T>(path: string, body: unknown, timeoutMs = 2500): Promise<T | null> {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  } finally {
    clearTimeout(t)
  }
}
