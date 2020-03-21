const makeCommenter = require('./makeCommenter');
const commentFormatter = require('./commentFormatter');

test('Runs makeComment with messages, warnings and errors', () => {
  var commentSent = undefined;
  const mockClient = {
    makeComment: (comment) => {
      commentSent = comment;
    }
  };

  const commenter = makeCommenter(mockClient, commentFormatter);
  commenter.addMessage("A message");
  commenter.addWarning("A warning");
  commenter.addError("An error");
  commenter.makeComment();

  expect(commentSent).toEqual(commentFormatter.format(
    ["A message"], 
    ["A warning"], 
    ["An error"]));
});

test('Add messages, warnings and errors without calling makeComment', () => {
  var commentSent = undefined;
  const mockClient = {
    makeComment: (comment) => {
      commentSent = comment;
    }
  };

  const commenter = makeCommenter(mockClient, commentFormatter);
  commenter.addMessage("A message");
  commenter.addWarning("A warning");
  commenter.addError("An error");

  expect(commentSent).toBeUndefined();
});