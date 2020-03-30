import {CommentActions, makeCommentService} from './commentService'

test('Update comment when a comment is found', async () => {
  var updateCommentCalled = false
  var createCommentCalled = false
  var deleteCommentCalled = false

  const actionsMock: CommentActions = {
    findIdOfPreviousCommentWithReginaldId: async _ => {
      return 111 // random number
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

  await commentService.createOrUpdateOrDeleteComment('reginald', 'non-empty-body')

  expect(updateCommentCalled).toBeTruthy()
  expect(createCommentCalled).toBeFalsy()
  expect(deleteCommentCalled).toBeFalsy()
})

test('Create a comment when a comment is not found', async () => {
  var updateCommentCalled = false
  var createCommentCalled = false
  var deleteCommentCalled = false

  const actionsMock: CommentActions = {
    findIdOfPreviousCommentWithReginaldId: async _ => {
      return undefined
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

  await commentService.createOrUpdateOrDeleteComment('', 'non-empty-body')

  expect(updateCommentCalled).toBeFalsy()
  expect(createCommentCalled).toBeTruthy()
  expect(deleteCommentCalled).toBeFalsy()
})

test('Delete a comment when a comment is found and new comment is empty', async () => {
  var updateCommentCalled = false
  var createCommentCalled = false
  var deleteCommentCalled = false

  const actionsMock: CommentActions = {
    findIdOfPreviousCommentWithReginaldId: async _ => {
      return 123 // random number
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

  await commentService.createOrUpdateOrDeleteComment('reginald', '')

  expect(updateCommentCalled).toBeFalsy()
  expect(createCommentCalled).toBeFalsy()
  expect(deleteCommentCalled).toBeTruthy()
})
