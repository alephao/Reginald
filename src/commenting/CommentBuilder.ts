import {CommentFormatter} from '.'

export class CommentBuilder {
  messages: string[] = []
  warnings: string[] = []
  errors: string[] = []

  addMessage(body: string): void {
    this.messages.push(body)
  }
  addWarning(body: string): void {
    this.warnings.push(body)
  }
  addError(body: string): void {
    this.errors.push(body)
  }

  build(reginaldId: string): string {
    return CommentFormatter.formatComment(
      reginaldId,
      this.messages,
      this.warnings,
      this.errors
    )
  }
}
