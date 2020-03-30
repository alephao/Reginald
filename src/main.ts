import * as core from '@actions/core'
import * as github from '@actions/github'
import * as Webhooks from '@octokit/webhooks'

import {getActionInputs} from './getActionInputs'
import {runnerFactory} from './runner'
import {CommentBuilder} from './CommentBuilder'
import {makeCommentService, makeCommentActions} from './commentService'

async function run(): Promise<void> {
  try {
    const getInput = (name: string): string =>
      core.getInput(name, {required: true})
    const actionInputs = getActionInputs(getInput)

    if (github.context.eventName !== 'pull_request') {
      // Note: This won't fail the check
      core.error('Reginald only runs for pull_request events')
      return
    }

    const pullRequestPayload = github.context.payload
      .pull_request as Webhooks.WebhookPayloadPullRequestPullRequest
    if (!pullRequestPayload) {
      core.error('Pull request payload not available from context. Exiting.')
      return
    }

    // Get pull-request number aka issue_number
    const issueNumber = pullRequestPayload.number

    // Create GitHub client
    const octokit = new github.GitHub(actionInputs.token)

    const commentBuilder = new CommentBuilder()
    const commentActions = makeCommentActions(
      github.context.repo.owner,
      github.context.repo.repo,
      issueNumber
    )(octokit)
    const commentService = makeCommentService(commentActions)

    // Content
    const reginaldfileContent = await fetchContent(
      octokit,
      actionInputs.reginaldfilePath
    )

    const runner = runnerFactory(
      commentBuilder,
      commentService,
      () =>  core.setFailed('Reginald left a comment on the pull request'),
      pullRequestPayload
    )(actionInputs.reginaldId, reginaldfileContent)

    await runner.run()
  } catch (error) {
    core.setFailed(error.message)
  }
}

async function fetchContent(
  octokit: github.GitHub,
  path: string
): Promise<string> {
  const response = await octokit.repos.getContents({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    path,
    ref: github.context.sha
  })

  // Workaround https://github.com/octokit/rest.js/issues/1516
  if (Array.isArray(response.data)) {
    throw new Error(
      'Failed to get content from Reginaldfile: octokit.repos.getContents returned an array'
    )
  }

  const content = response.data.content
  const encoding = response.data.encoding as BufferEncoding

  if (content && encoding) {
    const contentString = Buffer.from(content, encoding).toString()
    return contentString
  }

  throw new Error('Failed to get content from Reginaldfile')
}

run()
