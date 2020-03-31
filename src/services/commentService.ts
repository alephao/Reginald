import {GitHub} from '@actions/github'
import {formatCommentId} from '../commenting/commentFormatter'

export interface CommentActions {
  findIdOfPreviousCommentWithReginaldId: (
    reginaldCommentId: string
  ) => Promise<number | undefined>
  updateComment: (commentId: number, body: string) => Promise<void>
  createComment: (body: string) => Promise<void>
  deleteComment: (commentId: number) => Promise<void>
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

    const updateComment = async (
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

    const deleteComment = async (commentId: number): Promise<void> => {
      await github.issues.deleteComment({
        // eslint-disable-next-line @typescript-eslint/camelcase
        comment_id: commentId,
        owner,
        repo
      })
    }

    return {
      findIdOfPreviousCommentWithReginaldId,
      updateComment,
      createComment,
      deleteComment
    }
  }
}

export interface CommentService {
  createOrUpdateOrDeleteComment: (
    reginaldCommentId: string,
    body: string
  ) => Promise<void>
}

export const makeCommentService = (actions: CommentActions): CommentService => {
  const createOrUpdateOrDeleteComment = async (
    reginaldCommentId: string,
    body: string
  ): Promise<void> => {
    const previousCommentId = await actions.findIdOfPreviousCommentWithReginaldId(
      reginaldCommentId
    )
    if (previousCommentId) {
      if (body === '') {
        await actions.deleteComment(previousCommentId)
      } else {
        await actions.updateComment(previousCommentId, body)
      }
    } else {
      if (body !== '') {
        await actions.createComment(body)
      }
    }
  }

  return {createOrUpdateOrDeleteComment}
}
