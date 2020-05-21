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
  const octokit = new github.GitHub(token);

  octokit.repos.createDispatchEvent({
    owner,
    repo,
    event_type: 'test'
  });
}

try {
    // Read inputs
    const nameToGreet = core.getInput('who-to-greet');
    const githubToken = core.getInput('github-token');
    const secret = core.getInput('ptr-secret');
    console.log(`Gitub Secret : ${githubToken}`);

<<<<<<< HEAD
    var dispatchResponse = sendDispatchEvent(githubToken);
=======
    // Setup Octokit client
    const octokit = new github.GitHub({token: githubToken});

    var dispatchResponse = sendDispatchEvent(octokit ,githubToken);
>>>>>>> 6bb526a99fa5747b317594e41eae95984b001b09
    console.log(`REPO_DISPATCH : \n ${dispatchResponse}`)

    var testRun = getTestRun(secret);
    console.log(`PTR Secret\n ${testRun}`)
} catch (error) {
    core.setFailed(error.message);
}
