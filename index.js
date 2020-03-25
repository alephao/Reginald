const github = require('@actions/github');
const core = require('@actions/core');

const makeCommentFormatter = require('./makeCommentFormatter');
const makeCommenter = require('./makeCommenter');
const makeRunner = require('./makeRunner');

async function run() {
  // Get GitHub token
  const token = core.getInput('repo-token', { required: true });

  // Get contents of mf file
  const jsFilePath = core.getInput('file-path', { required: true });

  // Get Reginald ID
  const reginaldId = core.getInput('reginald-id', { required: true });

  // Get prNumber
  const prNumber = getPrNumber();
  if (!prNumber) {
    console.log('Could not get pull request number from context, exiting');
    return;
  }

  // Create GitHub client
  const octokit = new github.GitHub(token);

  // Get contents of the Reginald file
  const jsFile = await fetchContent(octokit, jsFilePath);

  // Get pull request data
  // const { data: pullRequest } = await octokit.pulls.get({
  //     owner: github.context.repo.owner,
  //     repo: github.context.repo.repo,
  //     pull_number: prNumber,
  // });

  const owner = github.context.repo.owner;
  const repo = github.context.repo.repo;

  const commentActions = {
    findPreviousComment: async (id) => {
      return await core.group(`Finding previous comment with id ${id}`, async () => {
        core.debug(`Getting comments for /${owner}/${repo}/pull/${prNumber}`);
        const { data: comments } = await octokit.issues.listComments({
          owner,
          repo,
          issue_number: prNumber,
        });

        core.debug(`Got ${comments.count} comments`);
        core.debug(JSON.stringify(comments));

        const comment = comments.find((commentObject) => {
          return commentObject["body"].startsWith(`<!--reginald-id: ${id}-->`);
        })

        if (comment) {
          core.debug(`Found comment with id ${id}`)
          core.debug(JSON.stringify(comment))
        } else {
          core.debug(`Couldn't find comment with id ${id}`)
        }

        return comment
      });
    },
    editComment: async (comment_id, body) => {
      await octokit.issues.updateComment({
        owner,
        repo,
        comment_id,
        body,
      });
    },
    createComment: async (body) => {
      await octokit.issues.createComment({
        owner,
        repo,
        issue_number: prNumber,
        body
      });
    }
  };

  const makeCommentClient = (id) => {
    return {
      makeComment: async (body) => {
        core.debug(`Checking if there is a comment with id: ${id}`);
        const previousComment = await commentActions.findPreviousComment(id);
        core.debug(`Found:`);
        core.debug(JSON.stringify(previousComment));
        if (previousComment && previousComment["id"]) {
          core.debug("Editing comment...");
          await commentActions.editComment(previousComment["id"], body);
        } else {
          core.debug("Creating comment...");
          await commentActions.createComment(body);
        }
      }
    }
  }

  const commentFormatter = makeCommentFormatter(reginaldId); 
  const commentClient = makeCommentClient(reginaldId);
  const commenter = makeCommenter(commentClient, commentFormatter);
  const runner = makeRunner(commenter, jsFile);

  await runner.run();    
}

function getPrNumber() {
  const pullRequest = github.context.payload.pull_request;
  if (!pullRequest) {
    return undefined;
  }

  return pullRequest.number;
}

async function fetchContent(
  client,
  path
) {
  const response = await client.repos.getContents({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    path: path,
    ref: github.context.sha
  });

  return Buffer.from(response.data.content, response.data.encoding).toString();
}

run();