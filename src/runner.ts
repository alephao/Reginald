import {ReginaldDSL} from './ReginaldDSL'
import {CommentFactory} from './commentFactory'
import {CommentService} from './commentService'
import * as Webhooks from '@octokit/webhooks'

const AsyncFunction = Object.getPrototypeOf(async function() {}).constructor

export interface ReginaldRunner {
  run: () => Promise<void>
}

const makeRunner = (
  dsl: ReginaldDSL,
  reginaldfileContent: string,
  done: () => Promise<void>
): ReginaldRunner => {
  const run = new AsyncFunction('reginald', reginaldfileContent)

  return {
    run: async () => {
      await run(dsl)
      await done()
    }
  }
}

export const runnerFactory = (
  commentFactory: CommentFactory,
  commentService: CommentService,
  pullRequest: Webhooks.WebhookPayloadPullRequestPullRequest
): ((
  reginaldCommentId: string,
  reginaldfileContent: string
) => ReginaldRunner) => {
  return (reginaldCommentId, reginaldfileContent) => {
    const dsl: ReginaldDSL = {
      message: commentFactory.addMessage,
      warning: commentFactory.addWarning,
      error: commentFactory.addError,
      pr: pullRequest
    }

    const done = async (): Promise<void> => {
      const commentBody = commentFactory.makeComment(reginaldCommentId)
      await commentService.createOrUpdateOrDeleteComment(reginaldCommentId, commentBody)
    }

    return makeRunner(dsl, reginaldfileContent, done)
  }
}
