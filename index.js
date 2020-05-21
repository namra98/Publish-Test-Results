const core = require('@actions/core')
const github = require('@actions/github')
var request = require('request');


function getTestRun(secret) {
    var options = {
        'method': 'GET',    
        'url': 'https://tcman.codedev.ms/org1/_apis/test/runs/1',
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

function sendDispatchEvent(token) {
  console.log("ss");
  console.log(typeof token === 'string');
  const octokit = new github.GitHub(token);

  octokit.repos.createDispatchEvent({
    owner,
    repo,
    event_type: 'test'
  });
}

async function run() {
  try {
    // Read inputs
    const nameToGreet = core.getInput('who-to-greet');
    var githubToken = core.getInput('github-token');
    githubToken = githubToken.toString();
    const secret = core.getInput('ptr-secret');
    console.log(`GitHub Secret : ${githubToken.length}`);

    // // Setup Octokit client
    // const octokit = new github.GitHub(githubToken);

    var dispatchResponse = sendDispatchEvent(githubToken);
    console.log(`REPO_DISPATCH : \n ${dispatchResponse}`)

    var testRun = getTestRun(secret);
    console.log(`PTR Secret\n ${testRun}`)
  } catch (error) {
    core.setFailed(error.message);
  }

}

run();