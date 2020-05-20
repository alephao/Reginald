### Fail pull-request if title doesn't follow pattern

```js
if (!/\[[A-Z]+-[0-9]+\]\s/.test(reginald.pr.title)) {
  reginald.error("Title should start with the ticket nuber e.g.: [JIRA-123]")
}
```

### Warn if a file was modified

```js
if (reginald.git.modifiedFiles.some(value => value.endsWith('Reginaldfile.js'))) {
   reginald.warning("Reginaldfile was modified");
}
```

* Feel free to create a pull-request adding your own example!