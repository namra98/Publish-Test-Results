const core = require('@actions/core')
const github = require('@actions/github')
const request = require('request-promise');
const xmljs = require('xml-js');
const fs = require('fs');

class TestRun {
  constructor(RunId, State, Title, LastUpdated, Owner, IncompleteTests, IterationId, DropLocation, ErrorMessage, StartDate, CompleteDate, Controller, PostProcessState, Revision, LastUpdatedBy, Type, TestEnvironmentId, Version, Comment, TotalTests, PassedTests, NotApplicableTests, UnanalyzedTests, CreationDate) {
    this.RunId = RunId;
    this.state = State;
    this.Title = Title;
    this.LastUpdated = LastUpdated;
    this.Owner = Owner;
    this.IncompleteTests = IncompleteTests;
    this.IterationId = IterationId;
    this.DropLocation = DropLocation;
    this.ErrorMessage = ErrorMessage;
    this.StartDate = StartDate;
    this.CompleteDate = CompleteDate;
    this.Controller = Controller;
    this.PostProcessState = PostProcessState;
    this.Revision = Revision;
    this.LastUpdatedBy = LastUpdatedBy;
    this.Type = Type;
    this.TestEnvironmentId = TestEnvironmentId;
    this.Version = Version;
    this.Comment = Comment;
    this.TotalTests = TotalTests;
    this.PassedTests = PassedTests;
    this.NotApplicableTests = NotApplicableTests;
    this.UnanalyzedTests = UnanalyzedTests;
    this.CreationDate = CreationDate;
  }
}


class TestResult {
  constructor(TestRunId, TestCaseRefId, TestResultId, TestCaseId, CreationDate, LastUpdated, LastUpdatedBy, LastUpdateBy, Outcome, State, Revision, DateStarted, DateCompleted, Owner, RunBy, Duration, ComputerName, FailureType, ResolutionStateId, ResetCount, Comment, StackTrace, ErrorMessage, AfnStripId, RV, AutomatedTestName) {
    this.TestRunId = TestRunId;
    this.TestCaseRefId = TestCaseRefId;
    this.TestResultId = TestResultId;
    this.TestCaseId = TestCaseId;
    this.CreationDate = CreationDate;
    this.LastUpdated = LastUpdated;
    this.LastUpdatedBy = LastUpdatedBy;
    this.LastUpdateBy = LastUpdateBy;
    this.Outcome = Outcome;
    this.State = State;
    this.Revision = Revision;
    this.DateStarted = DateStarted;
    this.DateCompleted = DateCompleted;
    this.Owner = Owner;
    this.RunBy = RunBy;
    this.Duration = Duration;
    this.ComputerName = ComputerName;
    this.FailureType = FailureType;
    this.ResolutionStateId = ResolutionStateId;
    this.ResetCount = ResetCount;
    this.Comment = Comment;
    this.StackTrace = StackTrace;
    this.ErrorMessage = ErrorMessage;
    this.AfnStripId = AfnStripId;
    this.RV = RV;
    this.AutomatedTestName = AutomatedTestName;
  }
}


async function Publish(filepath, secret, check_run_id) {

  const xml = fs.readFileSync(filepath, 'utf8');
  const jsonData = JSON.parse(xmljs.xml2json(xml, { compact: true, spaces: 2 }));
  
  console.log(filepath);
  console.log(jsonData);

  
  for (var obj in jsonData) {
    if (obj == 'TestRun') {
      // Summary of TestRun.
      var counters = jsonData[obj]['ResultSummary']['Counters']['_attributes'];

      // Create Test run object and send it to Tcm.
      var testRun = new TestRun(
        check_run_id,
        "1",
        jsonData[obj]['TestSettings']['_attributes']['name'],
        "2019-07-01T04-00-00.000Z",
        jsonData[obj]['_attributes']['runUser'],
        "0",
        "23",
        "any",
        "errormessage",
        jsonData[obj]['Times']['_attributes']['start'],
        jsonData[obj]['Times']['_attributes']['finish'],
        "controller",
        "0",
        "1",
        "85c65d89-072a-4923-8360-497a4053153c",
        "0",
        "85c65d89-072a-4923-8360-497a4053153c",
        "1",
        "comments",
        counters['total'],
        counters['passed'],
        "0",
        counters["total"] - counters["executed"],
        jsonData[obj]['Times']['_attributes']['creation']
      );

      // send it to Tcm and save TestRunId.
      var testRunResponse = await request({
        url: `https://tcman.codedev.ms/${github.context.repo.repo}/_apis/test/runs?api-version=1.0`,
        method: "POST",
        headers: {
          'Authorization': 'Bearer ' + secret,
        },
        json: true,
        body: testRun
      }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log("No Error", body);
        }
        else {
          console.log("Error", body);
        }
      }
      );

      console.log("testRunResponse : ",testRunResponse);

      var testRunId = testRunResponse.testRunId;

      console.log("testRunId : ", testRunId);
      
      for (var result in jsonData[obj]['Results']['UnitTestResult']) {

        // Create Test Results.
        var testResult = new TestResult(testRunId,
          "1",
          "1",
          "1",
          jsonData[obj]['Results']['UnitTestResult'][result]['_attributes']['startTime'],
          jsonData[obj]['Results']['UnitTestResult'][result]['_attributes']['startTime'],
          'e683309b-8302-411a-92ec-abeff69258a2',
          "e683309b-8302-411a-92ec-abeff69258a2",
          jsonData[obj]['Results']['UnitTestResult'][result]['_attributes']['outcome'] === 'Passed' ? "0" : "1",
          "1",
          "1",
          jsonData[obj]['Results']['UnitTestResult'][result]['_attributes']['startTime'],
          jsonData[obj]['Results']['UnitTestResult'][result]['_attributes']['endTime'],
          'e683309b-8302-411a-92ec-abeff69258a2',
          "e683309b-8302-411a-92ec-abeff69258a2",
          jsonData[obj]['Results']['UnitTestResult'][result]['_attributes']['duration'],
          jsonData[obj]['TestSettings']['_attributes']['name'],
          "0",
          "0",
          "0",
          "No Comments.",
          jsonData[obj]['Results']['UnitTestResult'][result]['_attributes']['outcome'] === 'Failed' ? jsonData[obj]['Results']['UnitTestResult'][result]['Output']['ErrorInfo']['StackTrace']['_text'] : "",
          jsonData[obj]['Results']['UnitTestResult'][result]['_attributes']['outcome'] === 'Failed' ? jsonData[obj]['Results']['UnitTestResult'][result]['Output']['ErrorInfo']['Message']['_text'] : "",
          "0",
          "0",
          jsonData[obj]['Results']['UnitTestResult'][result]['_attributes']['testName']
        );

        var resurl = `https://tcman.codedev.ms/${github.context.repo.repo}/_apis/test/runs/${testRunId}/results?api-version=1.0`;
        console.log(resurl);
        // Publish Test result.
        var testResultResponse = await request({
          url: `https://tcman.codedev.ms/${github.context.repo.repo}/_apis/test/runs/${testRunId}/results?api-version=1.0`,
          method: "POST",
          headers: {
            'Authorization': 'Bearer ' + secret
          },
          json: true,
          body: testResult
        }, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            console.log("No Error", body);
            return body;
          }
          else {
            console.log("Error", body);
            return body;
          }
        }
        );

        console.log(testResultResponse);
      }
    }
  }
}

async function getCheckRunId(octokit) {
  var repo = github.context.repo.repo;
  var owner = github.context.repo.owner;
  var checks = await octokit.checks.listForRef({
    owner: owner,
    repo: repo,
    ref: github.context.ref
  });
  var check_run_id = checks.data.check_runs[0].id;
  console.log(check_run_id);
  return check_run_id;
}

async function getTcmToken() {
  var body = {
    repository: {
      name: github.context.repo.repo
    }
  }

  var req = await request({
    url: `http://localhost:3000/token`,
    method: "POST",
    json: true,
    body: body
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log("done", body);
      return body;
    }
    else {
      console.log("Error", body);
      return body;
    }
  }
  );

  console.log(req);

  return req;
}

async function parseXML(filepath) {
  const testxml = fs.readFileSync(filepath, 'utf8');
  const jsonData = JSON.parse(xmljs.xml2json(testxml, { compact: true, spaces: 2 }));
  console.log(jsonData);

}

async function run() {
  try {
    // Read inputs
    var githubToken = core.getInput('github-secret');
    var filepath = core.getInput('filepath');
    // Get token for Org bt calling GitHub App.
    const TcmToken = await getTcmToken();
    console.log(TcmToken);
    // Get the octokit client.
    const octokit = new github.GitHub(githubToken);

    // Get Check Run Id
    var check_run_id = await getCheckRunId(octokit);

    // Get Test Run using Token.
    var testRun = await Publish(filepath, TcmToken, check_run_id);
    console.log(`Test Run ${testRun}`);

  } catch (error) {
    core.setFailed(error.message);
  }

}

run();