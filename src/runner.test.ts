import * as Webhooks from '@octokit/webhooks'

import {runnerFactory} from './runner'
import {makeCommentFactory} from './commentFactory'
import {CommentService} from './commentService'

// Helper function to create runner tests. Do not use this!
const assertFunc: (
  assertionDescription: string,
  prStub: any, // The pull request webhook data stub
  reginaldId: string,
  reginaldfile: string,
  generatedComment: string
) => void = (
  assertionDescription,
  prStub,
  reginaldId,
  reginaldFile,
  generatedComment
) => {
  test(assertionDescription, async () => {
    var calledReginaldId: string | undefined
    var calledBody: string | undefined

    const commentFactory = makeCommentFactory()
    const commentService: CommentService = {
      createOrUpdateOrDeleteComment: async (reginaldCommentId, body) => {
        calledReginaldId = reginaldCommentId
        calledBody = body
      }
    }

    // Just to satisfy the dependencies
    const pr = prStub as Webhooks.WebhookPayloadPullRequestPullRequest

    const runner = runnerFactory(
      commentFactory,
      commentService,
      pr
    )(reginaldId, reginaldFile)

    await runner.run()

    expect(calledReginaldId).toEqual(reginaldId)
    expect(calledBody).toEqual(generatedComment)
  })
}

const assert: (
  assertionDescription: string,
  args: {
    prStub: any // The pull request webhook data stub
    reginaldId: string
    reginaldfile: string
    generatedComment: string
  }
) => void = (assertionDescription, args) => {
  const reginaldfile = args.reginaldfile.trim()
  const generatedComment = args.generatedComment.trim()

  test(assertionDescription, async () => {
    var calledReginaldId: string | undefined
    var calledBody: string | undefined

    const commentFactory = makeCommentFactory()
    const commentService: CommentService = {
      createOrUpdateOrDeleteComment: async (reginaldCommentId, body) => {
        calledReginaldId = reginaldCommentId
        calledBody = body
      }
    }

    // Just to satisfy the dependencies
    const pr = args.prStub as Webhooks.WebhookPayloadPullRequestPullRequest

    const runner = runnerFactory(
      commentFactory,
      commentService,
      pr
    )(args.reginaldId, reginaldfile)

    await runner.run()

    expect(calledReginaldId).toEqual(args.reginaldId)
    expect(calledBody).toEqual(generatedComment)
  })
}

assert('createOrUpdateComment is called with the right arguments', {
  prStub: {},
  reginaldId: '123',
  reginaldfile: `
reginald.message('A');
reginald.message('B');
reginald.warning('C');
reginald.warning('D');
reginald.error('E');
`,
  generatedComment: `
<!--reginald-id: 123-->
**Messages**
:speech_balloon: A
:speech_balloon: B

**Warnings**
:warning: C
:warning: D

**Errors**
:no_entry_sign: E
`
})

assert('Send an error when the pull request title is wrong', {
  prStub: {title: 'Hello'},
  reginaldId: '321',
  reginaldfile: `
if (reginald.pr.title === 'Hello World') {
  reginald.message('The title is correct!');
} else {
  reginald.error('The title is wrong!');
}
`,
  generatedComment: `
<!--reginald-id: 321-->
**Errors**
:no_entry_sign: The title is wrong!
`
})

assert('Send a message when pull request title is right', {
  prStub: {title: 'Hello World'},
  reginaldId: 'reginald',
  reginaldfile: `
if (reginald.pr.title === 'Hello World') {
  reginald.message('The title is correct!');
} else {
  reginald.error('The title is wrong!');
}
`.trim(),
  generatedComment: `
<!--reginald-id: reginald-->
**Messages**
:speech_balloon: The title is correct!
`
})
