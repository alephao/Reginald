import * as core from '@actions/core'
import * as github from '@actions/github'

import {runnerFactory} from './runner'
import {makeCommentFactory} from './commentFactory'
import {makeCommentService, makeCommentActions} from './commentService'

async function run(): Promise<void> {
  try {
    const token = core.getInput('repo-token', {required: true}) // Get GitHub token from configs
    const reginaldfilePath = core.getInput('file-path', {required: true}) // Get contents of Reginaldfile from configs
    const reginaldId = core.getInput('reginald-id', {required: true}) // Get Reginald ID from configs

    // Get pull-request number aka issue_number
    const issue_number = github.context.payload.pull_request?.number
    if (!issue_number) {
      console.log('Could not get pull request number from context, exiting')
      return
    }

    const octokit = new github.GitHub(token) // Create GitHub client

    // Easier access to some constants
    const owner = github.context.repo.owner
    const repo = github.context.repo.repo

    const commentFactory = makeCommentFactory()
    const commentActions = makeCommentActions(
      owner,
      repo,
      issue_number
    )(octokit)
    const commentService = makeCommentService(commentActions)

    // Content
    const reginaldfileContent = await fetchContent(octokit, reginaldfilePath)

    const runner = runnerFactory(commentFactory, commentService)(
      reginaldId,
      reginaldfileContent
    )

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
    path: path,
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
