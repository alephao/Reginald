import {GitHub} from '@actions/github'
import {CommentFormatter} from '../commenting'

export interface ICommentActions {
  findIdOfPreviousCommentWithReginaldId: (
    reginaldCommentId: string
  ) => Promise<number | undefined>
  updateComment: (commentId: number, body: string) => Promise<void>
  createComment: (body: string) => Promise<void>
  deleteComment: (commentId: number) => Promise<void>
}

export class CommentActions implements ICommentActions {
  owner: string
  repo: string
  issueNumber: number
  github: GitHub

  constructor(
    owner: string,
    repo: string,
    issueNumber: number,
    github: GitHub
  ) {
    this.owner = owner
    this.repo = repo
    this.issueNumber = issueNumber
    this.github = github
  }

  async findIdOfPreviousCommentWithReginaldId(
    reginaldCommentId: string
  ): Promise<number | undefined> {
    const self = this
    const {data: comments} = await self.github.issues.listComments({
      owner: self.owner,
      repo: self.repo,
      // eslint-disable-next-line @typescript-eslint/camelcase
      issue_number: self.issueNumber
    })

    const comment = comments.find(commentObject => {
      const idString = CommentFormatter.formatCommentId(reginaldCommentId)
      return commentObject.body.startsWith(idString)
    })

    return comment?.id
  }

  async updateComment(commentId: number, body: string): Promise<void> {
    const self = this
    await self.github.issues.updateComment({
      // eslint-disable-next-line @typescript-eslint/camelcase
      comment_id: commentId,
      body,
      owner: self.owner,
      repo: self.repo
    })
  }

  async createComment(body: string): Promise<void> {
    const self = this
    await self.github.issues.createComment({
      body,
      // eslint-disable-next-line @typescript-eslint/camelcase
      issue_number: self.issueNumber,
      owner: self.owner,
      repo: self.repo
    })
  }

  async deleteComment(commentId: number): Promise<void> {
    const self = this
    await self.github.issues.deleteComment({
      // eslint-disable-next-line @typescript-eslint/camelcase
      comment_id: commentId,
      owner: self.owner,
      repo: self.repo
    })
  }
}
