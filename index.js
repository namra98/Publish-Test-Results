const core = require('@actions/core')
const github = require('@actions/github')
var request = require('request');


function getTestRun(secret) {
    var options = {
        'method': 'GET',    
        'url': `https://tcman.codedev.ms/${github.context.repo.repo}/_apis/test/runs/1`,
        'headers': {
          'Authorization': 'Bearer ' + secret,
        }
      };
      request(options, function (error, response) { 
        if (error) throw new Error(error);
        console.log(response.body);
        return response.body;
      });
}

function createCheck() {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/vnd.github.antiope-preview+json',
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    'User-Agent': 'PTR-action'
  }

  const body = {
    name: 'publishtest',
    head_sha: GITHUB_SHA,
    status: 'in_progress',
    started_at: new Date()
  }

  const { data } = request(`https://api.github.com/repos/${github.context.repo.owner}/${github.context.repo.repo}/check-runs`, {
    method: 'POST',
    headers,
    body
  })

  console.log(`Created Check Run : ${data}`);

}

// function sendDispatchEvent(token) {
//   const octokit = new github.GitHub(token);

//   var fullrepo = github.context.repo;
//   var repo = fullrepo.repo;
//   var owner = fullrepo.owner;
//   octokit.repos.createDispatchEvent({
//     owner,
//     repo,
//     event_type: 'test'
//   });
// }

async function run() {
  try {
    // Read inputs
    const nameToGreet = core.getInput('who-to-greet');
    var githubToken = core.getInput('github-secret');
    const secret = core.getInput('ptr-secret');

    console.log(github.context);
    console.log(github.context.action);
    console.log(github.context.actor);
    console.log(github.context.workflow);
    console.log(github.context.payload);
    console.log(github.context.workflow);

    // var dispatchResponse = sendDispatchEvent(githubToken);
    // console.log(`REPO_DISPATCH : \n ${dispatchResponse}`)

    // Get Test Run using Token.
    var testRun = getTestRun(secret);
    console.log(`Test Run\n ${testRun}`);

    // Send run info to GitHub App.
    var check = createCheck();
  

  } catch (error) {
    core.setFailed(error.message);
  }

}

run();