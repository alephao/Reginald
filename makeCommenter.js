'use strict';

const makeCommenter = (client, commentFormatter) => {
  const messages = [];
  const warnings = [];
  const errors = [];
  
  const addMessage = (body) => {
    messages.push(body);
  }

  const addWarning = (body) => {
    warnings.push(body);
  }

  const addError = (body) => {
    errors.push(body);
  }

  const makeComment = () => {
    if (messages.length > 0 || warnings.length > 0 || errors.length > 0) {
      const formattedComment = commentFormatter.format(messages, warnings, errors);
      client.makeComment(formattedComment);
    }
  }

  return { addMessage, addWarning, addError, makeComment };
}

module.exports = makeCommenter;