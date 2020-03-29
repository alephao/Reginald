import * as core from '@actions/core'
import * as github from '@actions/github'

import {getActionInputs} from './getActionInputs'
import {runnerFactory} from './runner'
import {makeCommentFactory} from './commentFactory'
import {makeCommentService, makeCommentActions} from './commentService'

async function run(): Promise<void> {
  try {
    const getInput: (name: string) => string = (name) => core.getInput(name, {required: true});
    const actionInputs = getActionInputs(getInput);

    // Get pull-request number aka issue_number
    const issue_number = github.context.payload.pull_request?.number
    if (!issue_number) {
      console.log('Could not get pull request number from context, exiting')
      return
    }

    const octokit = new github.GitHub(actionInputs.token) // Create GitHub client

    const commentFactory = makeCommentFactory()
    const commentActions = makeCommentActions(
      github.context.repo.owner,
      github.context.repo.repo,
      issue_number
    )(octokit)
    const commentService = makeCommentService(commentActions)

    // Content
    const reginaldfileContent = await fetchContent(octokit, actionInputs.reginaldfilePath)

    const runner = runnerFactory(commentFactory, commentService)(
      actionInputs.reginaldId,
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
