
const formatMessage = (body) => {
  return `💬 ${body}`;
}

const formatWarning = (body) => {
  return `⚠️ ${body}`;
}

const formatError = (body) => {
  return `🚫 ${body}`;
}

const formatComment = (messages, warnings, errors) => {
  var formattedComments = [];

  if (messages && messages.length > 0) {
    const formattedMessages = messages
      .map((message, _0, _1) => formatMessage(message))
      .join("\n");

    const messageBlock = `**Messages**\n${formattedMessages}`;

    formattedComments.push(messageBlock);
  }

  if (warnings && warnings.length > 0) {
    const formattedWarnings = warnings
      .map((warning, _0, _1) => formatWarning(warning))
      .join("\n");

    const warningBlock = `**Warnings**\n${formattedWarnings}`;
    
    formattedComments.push(warningBlock);
  }

  if (errors && errors.length > 0) {
    const formattedErrors = errors
      .map((error, _0, _1) => formatError(error))
      .join("\n");

    const errorBlock = `**Errors**\n${formattedErrors}`;

    formattedComments.push(errorBlock);
  }

  return formattedComments.join("\n\n");
}

const commentFormatter = {
  format: formatComment
}

module.exports = commentFormatter;