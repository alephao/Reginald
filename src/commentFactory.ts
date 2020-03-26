import {commentFormatter} from './commentFormatter'

export interface CommentFactory {
  addMessage: (body: string) => void
  addWarning: (body: string) => void
  addError: (body: string) => void
  makeComment: (id: string) => string
}

export const makeCommentFactory: () => CommentFactory = () => {
  var messages: string[] = []
  var warnings: string[] = []
  var errors: string[] = []

  const addMessage = (body: string) => {
    messages.push(body)
  }

  const addWarning = (body: string) => {
    warnings.push(body)
  }

  const addError = (body: string) => {
    errors.push(body)
  }

  const makeComment = (id: string) => {
    return commentFormatter(id)(messages, warnings, errors)
  }

  return {addMessage, addWarning, addError, makeComment}
}
