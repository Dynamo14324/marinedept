const DEFAULT_MAX_UPLOAD_MB = 50

function toPositiveInteger(value: string | undefined, fallback: number): number {
  if (!value) return fallback
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export const env = {
  maxUploadMb: toPositiveInteger(process.env.MAX_UPLOAD_MB, DEFAULT_MAX_UPLOAD_MB),
  nodeEnv: process.env.NODE_ENV ?? 'development',
}
