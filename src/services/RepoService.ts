import {GitHub} from '@actions/github'

export interface IRepoService {
  getContentsOfFile(sha: string, path: string): Promise<string>
}

export class RepoService implements IRepoService {
  github: GitHub
  owner: string
  repo: string

  constructor(github: GitHub, owner: string, repo: string) {
    this.github = github
    this.owner = owner
    this.repo = repo
  }

  async getContentsOfFile(ref: string, path: string): Promise<string> {
    const self = this
    const response = await self.github.repos.getContents({
      owner: self.owner,
      repo: self.repo,
      path,
      ref
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

    throw new Error('Failed to get contents from Reginaldfile')
  }
}
