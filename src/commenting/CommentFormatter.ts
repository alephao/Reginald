import {
  messageSectionFormatter,
  warningSectionFormatter,
  errorSectionFormatter
} from '.'

export const CommentFormatter = {
  formatCommentId(id: string): string {
    return `<!--reginald-id: ${id}-->`
  },

  formatComment(
    reginaldId: string,
    messages: string[],
    warnings: string[],
    errors: string[]
  ): string {
    const formattedComments = []

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

    const bodyId = CommentFormatter.formatCommentId(reginaldId)
    const bodyContent = formattedComments.join('\n\n')

    return [bodyId, bodyContent].join('\n')
  }
}
