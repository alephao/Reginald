import {
  messageSectionFormatter,
  warningSectionFormatter,
  errorSectionFormatter
} from './CommentSectionFormatter'

test('messageSectionFormatter with empty array', () => {
  expect(messageSectionFormatter.format([])).toEqual('')
})

test('messageSectionFormatter with multiple values', () => {
  expect(messageSectionFormatter.format(['A', 'B', 'C'])).toEqual(
    `
**Messages**
:speech_balloon: A
:speech_balloon: B
:speech_balloon: C
    `.trim()
  )
})

test('warningSectionFormatter with empty array', () => {
  expect(warningSectionFormatter.format([])).toEqual('')
})

test('warningSectionFormatter', () => {
  expect(warningSectionFormatter.format(['A', 'B', 'C'])).toEqual(
    `
**Warnings**
:warning: A
:warning: B
:warning: C
    `.trim()
  )
})

test('errorSectionFormatter with empty array', () => {
  expect(errorSectionFormatter.format([])).toEqual('')
})

test('errorSectionFormatter', () => {
  expect(errorSectionFormatter.format(['A', 'B', 'C'])).toEqual(
    `
**Errors**
:no_entry_sign: A
:no_entry_sign: B
:no_entry_sign: C
    `.trim()
  )
})
