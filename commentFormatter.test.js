const commentFormatter = require('./commentFormatter');

test('Test formatted message with messages, warning and errors', () => {
  const messages = ["Message 1", "Message 2"];
  const warnings = ["Warning 1", "Warning 2"];
  const errors = ["Error 1", "Error 2"];

  const formattedComments = commentFormatter.format(messages, warnings, errors);

  expect(formattedComments).toEqual(`**Messages**
:speech_balloon: Message 1
:speech_balloon: Message 2

**Warnings**
:warning: Warning 1
:warning: Warning 2

**Errors**
:no_entry_sign: Error 1
:no_entry_sign: Error 2`);
});

test('Test formatted message with only messages', () => {
  const messages = ["Message 1", "Message 2"];

  const formattedComments = commentFormatter.format(messages, [], []);

  expect(formattedComments).toEqual(`**Messages**
:speech_balloon: Message 1
:speech_balloon: Message 2`);
});