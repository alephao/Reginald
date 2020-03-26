export interface FormatStringFunction {
  (string: string): string
}

export interface StringFormatter {
  format: FormatStringFunction
}
