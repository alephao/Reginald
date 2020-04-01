import {ICommentActions} from '.'

export interface ICommentService {
  createOrUpdateOrDeleteComment: (
    reginaldCommentId: string,
    body: string
  ) => Promise<void>
}

export class CommentService implements ICommentService {
  actions: ICommentActions

  constructor(actions: ICommentActions) {
    this.actions = actions
  }

  async createOrUpdateOrDeleteComment(
    reginaldCommentId: string,
    body: string
  ): Promise<void> {
    const self = this
    const previousCommentId = await self.actions.findIdOfPreviousCommentWithReginaldId(
      reginaldCommentId
    )
    if (previousCommentId) {
      if (body === '') {
        await self.actions.deleteComment(previousCommentId)
      } else {
        await self.actions.updateComment(previousCommentId, body)
      }
    } else {
      if (body !== '') {
        await self.actions.createComment(body)
      }
    }
  }
}
