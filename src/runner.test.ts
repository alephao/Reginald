import * as Webhooks from '@octokit/webhooks'

import {runnerFactory} from './runner'
import {CommentBuilder} from './commenting/CommentBuilder'
import {CommentService} from './services/commentService'
import {GitDSL} from './dsl/GitDSL'

const assert: (
  assertionDescription: string,
  args: {
    prStub: any // The pull request webhook data stub
    gitStub: any
    reginaldId: string
    reginaldfile: string
    generatedComment: string
    prShouldFail: boolean
  }
) => void = (assertionDescription, args) => {
  const reginaldfile = args.reginaldfile.trim()
  const generatedComment = args.generatedComment.trim()

  test(assertionDescription, async () => {
    var calledReginaldId: string | undefined
    var calledBody: string | undefined

    var calledSetFailed: boolean = false

    const commentBuilder = new CommentBuilder()
    const commentService: CommentService = {
      createOrUpdateOrDeleteComment: async (reginaldCommentId, body) => {
        calledReginaldId = reginaldCommentId
        calledBody = body
      }
    }

    // Just to satisfy the dependencies
    const pr = args.prStub as Webhooks.WebhookPayloadPullRequestPullRequest
    const git = args.gitStub as GitDSL

    const runner = runnerFactory(
      commentBuilder,
      commentService,
      () => {
        calledSetFailed = true
      },
      pr,
      git
    )(args.reginaldId, reginaldfile)

    await runner.run()

    expect(calledReginaldId).toEqual(args.reginaldId)
    expect(calledBody).toEqual(generatedComment)
    expect(calledSetFailed).toEqual(args.prShouldFail)
  })
}

assert('createOrUpdateComment is called with the right arguments', {
  prStub: {},
  gitStub: {},
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
`,
  prShouldFail: true
})

assert('Send an error when the pull request title is wrong', {
  prStub: {title: 'Hello'},
  gitStub: {},
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
`,
  prShouldFail: true
})

assert('Send a message when pull request title is right', {
  prStub: {title: 'Hello World'},
  gitStub: {},
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
`,
  prShouldFail: false
})

assert('Send a message when git file is changed', {
  prStub: {},
  gitStub: {modifiedFiles: ['file.txt']},
  reginaldId: 'reginald',
  reginaldfile: `
if (reginald.git.modifiedFiles.includes('file.txt')) {
  reginald.warning('file.txt was modified');
} else {
  reginald.message('All good!');
}
`.trim(),
  generatedComment: `
<!--reginald-id: reginald-->
**Warnings**
:warning: file.txt was modified
`,
  prShouldFail: false
})
