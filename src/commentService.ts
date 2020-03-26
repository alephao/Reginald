import {GitHub} from '@actions/github'
import {formatCommentId} from './commentFormatter'

export interface CommentActions {
  findIdOfPreviousCommentWithReginaldId: (
    reginaldCommentId: string
  ) => Promise<number | undefined>
  editComment: (comment_id: number, body: string) => Promise<void>
  createComment: (body: string) => Promise<void>
}

export const makeCommentActions: (
  owner: string,
  repo: string,
  issue_number: number
) => (github: GitHub) => CommentActions = (owner, repo, issue_number) => {
  return github => {
    const findIdOfPreviousCommentWithReginaldId = async (
      reginaldCommentId: string
    ) => {
      const {data: comments} = await github.issues.listComments({
        owner,
        repo,
        issue_number
      })

      const comment = comments.find(commentObject => {
        const idString = formatCommentId(reginaldCommentId)
        return commentObject.body.startsWith(idString)
      })

      return comment?.id
    }

    const editComment = async (comment_id: number, body: string) => {
      await github.issues.updateComment({
        comment_id,
        body,
        owner,
        repo
      })
    }

    const createComment = async (body: string) => {
      await github.issues.createComment({
        body,
        issue_number,
        owner,
        repo
      })
    }

    const createOrUpdateComment = async (
      reginaldCommentId: string,
      body: string
    ) => {
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

export const makeCommentService: (
  actions: CommentActions
) => CommentService = actions => {
  const createOrUpdateComment = async (
    reginaldCommentId: string,
    body: string
  ) => {
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
