import {commentFormatter} from './commentFormatter'

export class CommentBuilder {
  messages: Array<string> = []
  warnings: Array<string> = []
  errors: Array<string> = []

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
    return commentFormatter(reginaldId)(
      this.messages,
      this.warnings,
      this.errors
    )
  }
}
