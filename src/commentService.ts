import {GitHub} from '@actions/github'
import {formatCommentId} from './commentFormatter'

export interface CommentActions {
  findIdOfPreviousCommentWithReginaldId: (
    reginaldCommentId: string
  ) => Promise<number | undefined>
  editComment: (commentId: number, body: string) => Promise<void>
  createComment: (body: string) => Promise<void>
}

export const makeCommentActions = (
  owner: string,
  repo: string,
  issueNumber: number
): ((github: GitHub) => CommentActions) => {
  return github => {
    const findIdOfPreviousCommentWithReginaldId = async (
      reginaldCommentId: string
    ): Promise<number | undefined> => {
      const {data: comments} = await github.issues.listComments({
        owner,
        repo,
        // eslint-disable-next-line @typescript-eslint/camelcase
        issue_number: issueNumber
      })

      const comment = comments.find(commentObject => {
        const idString = formatCommentId(reginaldCommentId)
        return commentObject.body.startsWith(idString)
      })

      return comment?.id
    }

    const editComment = async (
      commentId: number,
      body: string
    ): Promise<void> => {
      await github.issues.updateComment({
        // eslint-disable-next-line @typescript-eslint/camelcase
        comment_id: commentId,
        body,
        owner,
        repo
      })
    }

    const createComment = async (body: string): Promise<void> => {
      await github.issues.createComment({
        body,
        // eslint-disable-next-line @typescript-eslint/camelcase
        issue_number: issueNumber,
        owner,
        repo
      })
    }

    const createOrUpdateComment = async (
      reginaldCommentId: string,
      body: string
    ): Promise<void> => {
      const previousCommentId = await findIdOfPreviousCommentWithReginaldId(
        reginaldCommentId
      )
      if (previousCommentId) {
        await editComment(previousCommentId, body)
      } else {
        await createComment(body)
      }
    }

    return {
      findIdOfPreviousCommentWithReginaldId,
      editComment,
      createComment,
      createOrUpdateComment
    }
  }
}

export interface CommentService {
  createOrUpdateComment: (
    reginaldCommentId: string,
    body: string
  ) => Promise<void>
}

export const makeCommentService = (actions: CommentActions): CommentService => {
  const createOrUpdateComment = async (
    reginaldCommentId: string,
    body: string
  ): Promise<void> => {
    const previousCommentId = await actions.findIdOfPreviousCommentWithReginaldId(
      reginaldCommentId
    )
    if (previousCommentId) {
      await actions.editComment(previousCommentId, body)
    } else {
      await actions.createComment(body)
    }
  }

  return {createOrUpdateComment}
}
