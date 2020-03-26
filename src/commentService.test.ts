import {CommentActions, makeCommentService} from './commentService'

test('Edit comment when a comment is found', async () => {
  var editCommentCalled = false
  var createCommentCalled = false

  const actionsMock: CommentActions = {
    findIdOfPreviousCommentWithReginaldId: async _ => {
      return 111
    },
    editComment: async (_0, _1) => {
      editCommentCalled = true
    },
    createComment: async _ => {
      createCommentCalled = true
    }
  }

  const commentService = makeCommentService(actionsMock)

  await commentService.createOrUpdateComment('', '')

  expect(editCommentCalled).toBeTruthy()
  expect(createCommentCalled).toBeFalsy()
})

test('Create a comment when a comment is not found', async () => {
  var editCommentCalled = false
  var createCommentCalled = false

  const actionsMock: CommentActions = {
    findIdOfPreviousCommentWithReginaldId: async _ => {
      return undefined
    },
    editComment: async (_0, _1) => {
      editCommentCalled = true
    },
    createComment: async _ => {
      createCommentCalled = true
    }
  }

  const commentService = makeCommentService(actionsMock)

  await commentService.createOrUpdateComment('', '')

  expect(editCommentCalled).toBeFalsy()
  expect(createCommentCalled).toBeTruthy()
})
