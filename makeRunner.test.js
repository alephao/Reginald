const makeRunner = require('./makeRunner');
const makeCommenter = require('./makeCommenter');
const makeCommentFormatter = require('./makeCommentFormatter');

const commentFormatter = makeCommentFormatter("reginald");

test('Test runner sending messages', async () => {
  // Make commenter
  var commentSent = undefined;
  const mockClient = {
    makeComment: async (comment) => {
      commentSent = comment;
    }
  };
  const commenter = makeCommenter(mockClient, commentFormatter);

  // Make content
  const content = `
    'use strict';

    message("A message");
    warning("A warning");
    error("An error");
  `;

  // Make runner
  const runner = makeRunner(commenter, content);

  // Act
  await runner.run()

  // Assert
  expect(commentSent).toEqual(commentFormatter.format(['A message'], ['A warning'], ['An error']));
});

test('Test runner not sending messages', async () => {
 // Make commenter
 var commentSent = undefined;
 const mockClient = {
   makeComment: async (comment) => {
     commentSent = comment;
   }
 };
 const commenter = makeCommenter(mockClient, commentFormatter);

 // Make content
 const content = `
   'use strict';
 `;

 // Make runner
 const runner = makeRunner(commenter, content);

 // Act
 await runner.run()

 // Assert
 expect(commentSent).toBeUndefined();
});