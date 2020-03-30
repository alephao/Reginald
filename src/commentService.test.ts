import {CommentActions, makeCommentService} from './commentService'

test('Update comment when a comment is found', async () => {
  var updateCommentCalled = false
  var createCommentCalled = false

  const actionsMock: CommentActions = {
    findIdOfPreviousCommentWithReginaldId: async _ => {
      return 111
    },
    updateComment: async (_0, _1) => {
      updateCommentCalled = true
    },
    createComment: async _ => {
      createCommentCalled = true
    }
  }

  const commentService = makeCommentService(actionsMock)

  await commentService.createOrUpdateComment('', '')

  expect(updateCommentCalled).toBeTruthy()
  expect(createCommentCalled).toBeFalsy()
})

test('Create a comment when a comment is not found', async () => {
  var updateCommentCalled = false
  var createCommentCalled = false

  const actionsMock: CommentActions = {
    findIdOfPreviousCommentWithReginaldId: async _ => {
      return undefined
    },
    updateComment: async (_0, _1) => {
      updateCommentCalled = true
    },
    createComment: async _ => {
      createCommentCalled = true
    }
  }

  const commentService = makeCommentService(actionsMock)

  await commentService.createOrUpdateComment('', '')

  expect(updateCommentCalled).toBeFalsy()
  expect(createCommentCalled).toBeTruthy()
})
