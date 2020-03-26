import {makeCommentFactory} from './commentFactory'

test('commentIdFormatter', () => {
  const commentFactory = makeCommentFactory()
  commentFactory.addMessage('A')
  commentFactory.addWarning('B')
  commentFactory.addError('C')

  expect(commentFactory.makeComment('123')).toEqual(
    `
<!--reginald-id: 123-->
**Messages**
:speech_balloon: A

**Warnings**
:warning: B

**Errors**
:no_entry_sign: C
  `.trim()
  )
})
