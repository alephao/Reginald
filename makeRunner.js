'use strict';

const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

const makeRunner = (commenter, content) => {
  const run = new AsyncFunction(
    'message',
    'warning',
    'error',
    content
  );

  return {
    run: async () => {
      await run(
        commenter.addMessage,
        commenter.addWarning,
        commenter.addError
      );
      await commenter.makeComment();
    } 
  }
}

module.exports = makeRunner;