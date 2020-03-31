import {CommentBuilder} from '.'

test('Test comment built', () => {
  const commentBuilder = new CommentBuilder()
  commentBuilder.addMessage('A')
  commentBuilder.addWarning('B')
  commentBuilder.addError('C')

  expect(commentBuilder.build('123')).toEqual(
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
