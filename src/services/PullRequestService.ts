import {GitHub} from '@actions/github'
import { GitDSL } from '../dsl/GitDSL'

export interface IPullRequestService {
  gitDSL(): Promise<GitDSL>
}

export class PullRequestService implements IPullRequestService {
  github: GitHub
  owner: string
  repo: string
  prNumber: number

  constructor(github: GitHub, owner: string, repo: string, prNumber: number) {
    this.github = github
    this.owner = owner
    this.repo = repo
    this.prNumber = prNumber
  }

  async gitDSL(): Promise<GitDSL> {
    const self = this
    const { data: response } = await this.github.pulls.listFiles({
      owner: self.owner,
      pull_number: self.prNumber,
      repo: self.repo
    })

    const addedFiles = response
      .filter(item => item.status === 'added')
      .map(item => item.filename)

    const removedFiles = response
      .filter(item => item.status === 'removed')
      .map(item => item.filename)

    const modifiedFiles = response
      .filter(item => item.status === 'modified')
      .map(item => item.filename)

    return {
      addedFiles,
      removedFiles,
      modifiedFiles
    }
  }

}
