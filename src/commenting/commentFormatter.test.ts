import {formatCommentId, commentFormatter} from './commentFormatter'

test('commentIdFormatter', () => {
  expect(formatCommentId('123')).toEqual('<!--reginald-id: 123-->')
})

test('commentFormatter empty', () => {
  const result = commentFormatter('123')([], [], [])
  expect(result).toEqual('')
})

test('commentFormatter only with messages', () => {
  const result = commentFormatter('123')(['A', 'B'], [], [])
  expect(result).toEqual(
    `
<!--reginald-id: 123-->
**Messages**
:speech_balloon: A
:speech_balloon: B
    `.trim()
  )
})

test('commentFormatter with messages, warnings and errors', () => {
  const result = commentFormatter('123')(['A', 'B'], ['C'], ['D'])
  expect(result).toEqual(
    `
<!--reginald-id: 123-->
**Messages**
:speech_balloon: A
:speech_balloon: B

**Warnings**
:warning: C

**Errors**
:no_entry_sign: D
    `.trim()
  )
})
