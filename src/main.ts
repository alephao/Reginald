import * as core from '@actions/core'
import * as github from '@actions/github'
import * as Webhooks from '@octokit/webhooks'

import {getActionInputs} from './helpers'
import {runnerFactory} from './runner'
import {CommentBuilder} from './commenting'
import {
  CommentService,
  CommentActions,
  PullRequestService,
  RepoService
} from './services'

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
    const commentActions = new CommentActions(
      github.context.repo.owner,
      github.context.repo.repo,
      issueNumber,
      octokit
    )
    const commentService = new CommentService(commentActions)

    // Content
    const repoService = new RepoService(
      octokit,
      github.context.repo.owner,
      github.context.repo.repo
    )
    const reginaldfileContent = await repoService.getContentsOfFile(
      github.context.sha,
      actionInputs.reginaldfilePath
    )

    const pullRequestService = new PullRequestService(
      octokit,
      github.context.repo.owner,
      github.context.repo.repo,
      issueNumber
    )

    const gitDSL = await pullRequestService.gitDSL()

    const runner = runnerFactory(
      commentBuilder,
      commentService,
      () => core.setFailed('Reginald left a comment on the pull request'),
      pullRequestPayload,
      gitDSL
    )(actionInputs.reginaldId, reginaldfileContent)

    await runner.run()
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
