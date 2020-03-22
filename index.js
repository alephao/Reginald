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

  const commentClinet = {
    makeComment: async (comment) => {
      await octokit.issues.createComment({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,        
        issue_number: prNumber,
        body: comment
      });
    }
  };

  const commentFormatter = makeCommentFormatter(reginaldId); 
  const commenter = makeCommenter(commentClinet, commentFormatter);
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