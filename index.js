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


try {
    const nameToGreet = core.getInput('who-to-greet');
    console.log(`Hello ${nameToGreet}!`);
    const time = (new Date()).toTimeString();
    core.setOutput("time", time);
    const secret = core.getInput('ptr-secret');
    console.log(`PTR Secret\n ${secret}`)
    var testRun = getTestRun(secret);
    console.log(`PTR Secret\n ${testRun}`)
} catch (error) {
    core.setFailed(error.message);
}