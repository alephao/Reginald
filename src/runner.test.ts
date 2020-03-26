import {runnerFactory} from './runner'
import {makeCommentFactory} from './commentFactory'
import {CommentService} from './commentService'

test('createOrUpdateComment is called with the right arguments', async () => {
  var calledReginaldId: string | undefined
  var calledBody: string | undefined

  const commentFactory = makeCommentFactory()
  const commentService: CommentService = {
    createOrUpdateComment: async (reginaldCommentId, body) => {
      calledReginaldId = reginaldCommentId
      calledBody = body
    }
  }

  const runner = runnerFactory(commentFactory, commentService)(
    '123',
    `
reginald.message('A');
reginald.message('B');
reginald.warning('C');
reginald.warning('D');
reginald.error('E');
  `.trim()
  )

  await runner.run()

  expect(calledReginaldId).toEqual('123')
  expect(calledBody).toEqual(
    `
<!--reginald-id: 123-->
**Messages**
:speech_balloon: A
:speech_balloon: B

**Warnings**
:warning: C
:warning: D

**Errors**
:no_entry_sign: E
`.trim()
  )
})
