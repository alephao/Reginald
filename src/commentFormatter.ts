import {
  messageSectionFormatter,
  warningSectionFormatter,
  errorSectionFormatter
} from './CommentSectionFormatter'

export const formatCommentId = (id: string) => {
  return `<!--reginald-id: ${id}-->`
}

export interface CommentFormatter {
  (id: string): (
    messages: string[],
    warnings: string[],
    errors: string[]
  ) => string
}

export const commentFormatter: CommentFormatter = (id: string) => {
  return (messages: string[], warnings: string[], errors: string[]) => {
    var formattedComments = []

    const messageSection = messageSectionFormatter.format(messages)
    if (messageSection.length > 0) {
      formattedComments.push(messageSection)
    }

    const warningSection = warningSectionFormatter.format(warnings)
    if (warningSection.length > 0) {
      formattedComments.push(warningSection)
    }

    const errorSection = errorSectionFormatter.format(errors)
    if (errorSection.length > 0) {
      formattedComments.push(errorSection)
    }

    if (formattedComments.length < 1) {
      return ''
    }

    const bodyId = formatCommentId(id)
    const bodyContent = formattedComments.join('\n\n')

    return [bodyId, bodyContent].join('\n')
  }
}
