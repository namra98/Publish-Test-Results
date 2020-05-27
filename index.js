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

function publishTestRuns(secret) {
  var testRun = {
    TestRunId : "2",
    RunId : github.run_id,
    State : "0",
    Title : "GitHub Action",
    LastUpdated : "2019-07-01T04-00-00.000Z",
    Owner : "GitHub Action.",
    IncompleteTests : "0",
    IterationId : "23",
    DropLocation : "droploc",
    ErrorMessage : "Error Message",
    StartDate : "2018-08-26T12:58:34.860",
    CompleteDate : "2018-08-26T12:58:34.860",
    Controller : "controller",
    PostProcessState : "0",
    Revision : "3",
    LastUpdatedBy : "85c65d89-072a-4923-8360-497a4053153c",
    Type : "0",
    TestEnvironmentId : "85c65d89-072a-4923-8360-497a4053153c",
    Version : "1",
    Comment : "No Comments.",
    TotalTests : "10",
    PassedTests : "9",
    NotApplicableTests : "0",
    UnanalyzedTests : "1",
    CreationDate : "2018-08-26T12:58:34.860"
  } 

  request({
    url: `https://tcman.codedev.ms/${github.context.repo.repo}/_apis/test/runs?api-version=1.0`,
    method: "POST",
    headers: {
      'Authorization':'Bearer ' + secret,
    },
    json: true,
    body: testRun
  }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
      return body;
    }
    else {
      console.log(body);
      return response;
    }
  }
  );
}

function createCheck(githubToken) {
  console.log(`SHA : ${github.context.sha}`);

  var repo = github.context.repo.repo;
  var owner = github.context.repo.owner;
  var data = octokit.checks.create({
    owner: owner,
    repo: repo,
    head_sha: github.context.sha,
    name: 'PublishTest',
    external_id: github.context.run_id
  });

  return data;

}

async function getCheckRunId(octokit) {
  var repo = github.context.repo.repo;
  var owner = github.context.repo.owner;
  var checks = await octokit.checks.listForRef({
    owner: owner,
    repo: repo,
    ref: github.context.ref
    // check_name: github.context.workflow
  });
  console.log(checks);
  var check_run_id = checks.data.check_runs[0].id;
  console.log(check_run_id);
  return check_run_id;
}


async function run() {
  try {
    // Read inputs
    const nameToGreet = core.getInput('who-to-greet');
    var githubToken = core.getInput('github-secret');
    const secret = core.getInput('ptr-secret');

    // Get the octokit client.
    const octokit = new github.GitHub(githubToken);

    // Get Check Run Id
    var check_run_id = await getCheckRunId(octokit);
    console.log(check_run_id);

    // Get Test Run using Token.
    // var testRun = publishTestRuns(secret);
    // console.log(`Test Run ${testRun}`);


    
  
  } catch (error) {
    core.setFailed(error.message);
  }

}

run();