const convert = require('xml-js');
const fs = require('fs');

const xml = fs.readFileSync('a.xml', 'utf8');

const jsonData = JSON.parse(convert.xml2json(xml, {compact: true, spaces: 2}));

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
  constructor(TestRunId , TestCaseRefId , TestResultId , TestCaseId , CreationDate , LastUpdated , LastUpdatedBy , LastUpdateBy , Outcome , State , Revision , DateStarted , DateCompleted , Owner , RunBy , Duration , ComputerName , FailureType , ResolutionStateId , ResetCount , Comment , StackTrace , ErrorMessage , AfnStripId , RV , AutomatedTestName)
  {
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

var testRuns = new Array();

for (var obj in jsonData) {
  if (obj == 'TestRun') {
    // Summary of TestRun.
    var counters = jsonData[obj]['ResultSummary']['Counters']['_attributes'];

    // Create Test run object and send it to Tcm.
    testRuns.push( 
      new TestRun(
      "1",
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
    ));

    // send it to Tcm and save TestRunId.
    var testRunId = "1";

    var testResults = new Array();

    // console.log(jsonData[obj]['Results']);
    for (var result in jsonData[obj]['Results']['UnitTestResult']) {
      // console.log(result, "->", jsonData[obj]['Results']['UnitTestResult'][result]);
      // Create Test Results.
      testResults.push(
        new TestResult(testRunId,
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
          )
      );
    }

    console.log(testResults);
    console.log(testRuns);
  }
}


exports.print = function() {
  console.log("Print");
}