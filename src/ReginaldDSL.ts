export interface ReginaldDSL {
  message: (body: string) => void
  warning: (body: string) => void
  error: (body: string) => void
}
