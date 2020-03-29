import {commentFormatter} from './commentFormatter'

export interface CommentFactory {
  addMessage: (body: string) => void
  addWarning: (body: string) => void
  addError: (body: string) => void
  makeComment: (id: string) => string
}

export const makeCommentFactory = (): CommentFactory => {
  const messages: string[] = []
  const warnings: string[] = []
  const errors: string[] = []

  const addMessage = (body: string): void => {
    messages.push(body)
  }

  const addWarning = (body: string): void => {
    warnings.push(body)
  }

  const addError = (body: string): void => {
    errors.push(body)
  }

  const makeComment = (id: string): string => {
    return commentFormatter(id)(messages, warnings, errors)
  }

  return {addMessage, addWarning, addError, makeComment}
}
