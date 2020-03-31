import {CommentActions, makeCommentService} from './commentService'

// Helper to test which request is made depending on the inputs
const assert = (
  testDescription: string,
  args: {
    commentExist: boolean
    newCommentBody: string
    expectUpdateCommentCalled?: boolean
    expectCreateCommentCalled?: boolean
    expectDeleteCommentCalled?: boolean
  }
): void => {
  test(testDescription, async () => {
    var updateCommentCalled = false
    var createCommentCalled = false
    var deleteCommentCalled = false

    const actionsMock: CommentActions = {
      findIdOfPreviousCommentWithReginaldId: async _ => {
        return args.commentExist
          ? 111 // random number
          : undefined
      },
      updateComment: async (_0, _1) => {
        updateCommentCalled = true
      },
      createComment: async _ => {
        createCommentCalled = true
      },
      deleteComment: async _ => {
        deleteCommentCalled = true
      }
    }

    const commentService = makeCommentService(actionsMock)

    await commentService.createOrUpdateOrDeleteComment(
      'reginald',
      args.newCommentBody
    )

    expect(updateCommentCalled).toEqual(args.expectUpdateCommentCalled ?? false)
    expect(createCommentCalled).toEqual(args.expectCreateCommentCalled ?? false)
    expect(deleteCommentCalled).toEqual(args.expectDeleteCommentCalled ?? false)
  })
}

assert('Update comment when a comment is found', {
  commentExist: true,
  newCommentBody: 'non-empty-body',
  expectUpdateCommentCalled: true
})

assert('Create a comment when a comment is not found', {
  commentExist: false,
  newCommentBody: 'non-empty-body',
  expectCreateCommentCalled: true
})

assert('Delete a comment when a comment is found and new comment is empty', {
  commentExist: true,
  newCommentBody: '',
  expectDeleteCommentCalled: true
})

assert(
  'If a comment is not found and the new comment is empty, nothing happens',
  {
    commentExist: false,
    newCommentBody: ''
  }
)
