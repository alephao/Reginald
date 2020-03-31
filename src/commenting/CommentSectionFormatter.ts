import {FormatStringFunction} from '../FormatStringFunction'

export class CommentSectionFormatter {
  header: string
  formatItemFunction: FormatStringFunction

  constructor(header: string, formatItemFunction: FormatStringFunction) {
    this.header = header
    this.formatItemFunction = formatItemFunction
  }

  format: (items: string[]) => string = items => {
    if (items.length < 1) {
      return ''
    }

    const formattedItems = items
      .map((item, _0, _1) => this.formatItemFunction(item))
      .join('\n')

    return [this.header, formattedItems].join('\n')
  }
}

const prependEmoji = (emoji: string): ((str: string) => string) => {
  return (str: string) => {
    return [emoji, str].join(' ')
  }
}

export const messageSectionFormatter = new CommentSectionFormatter(
  '**Messages**',
  prependEmoji(':speech_balloon:')
)

export const warningSectionFormatter = new CommentSectionFormatter(
  '**Warnings**',
  prependEmoji(':warning:')
)

export const errorSectionFormatter = new CommentSectionFormatter(
  '**Errors**',
  prependEmoji(':no_entry_sign:')
)
