import {CommentService, ICommentActions} from '.'

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
    let updateCommentCalled = false
    let createCommentCalled = false
    let deleteCommentCalled = false

    const actionsMock: ICommentActions = {
      findIdOfPreviousCommentWithReginaldId: async () => {
        return args.commentExist
          ? 111 // random number
          : undefined
      },
      updateComment: async () => {
        updateCommentCalled = true
      },
      createComment: async () => {
        createCommentCalled = true
      },
      deleteComment: async () => {
        deleteCommentCalled = true
      }
    }

    const commentService = new CommentService(actionsMock)

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
