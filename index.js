const core = require('@actions/core')
const github = require('@actions/github')
var request = require('request');


function getTestRun(secret) {
    var options = {
        'method': 'GET',
        // 'url': 'https://www.google.com',
        'url': 'https://tcman.codedev.ms/org1/_apis/test/runs/1',
        'headers': {
          'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBpZCI6IjAwMDAwMDU0LTAwMDAtODg4OC04MDAwLTAwMDAwMDAwMDAwMCIsInRpZCI6IkNFRURGRUVELTAwMDAtODg4OC04MDAwLTAwMDAwMDAwMDAwMCIsImlhdCI6MTU4OTc4Nzk5NiwibmJmIjoxNTg5Nzg4MDU2LCJleHAiOjE1ODk3OTE1OTYsImF1ZCI6IjAwMDAwMDU0LTAwMDAtODg4OC04MDAwLTAwMDAwMDAwMDAwMC92aXN1YWxzdHVkaW8uY29tQENFRURGRUVELTAwMDAtODg4OC04MDAwLTAwMDAwMDAwMDAwMCIsImlzcyI6ImdoZXM6Ly93d3cuZ2l0aHViLmNvbSJ9.h9t1Khmb_ZoVxH6o2KfF-5iPBeVlyumPr--CRyoE8T6WLidmCA1WzFXCQeeum35TZ7TGcaf0pTAaA6ievrl_u8FCt5RCSirHt0SJyPu-Qx3J6wwxTD4qz7vu70kclVl8P53HkBFMCcPM3kxHEZAGN24F9nBdp5VeWC1qy8iC6GTZY95doeUtWj6W33ykLf12q_m9Rkpk_NgNpGZTvpql8Rib_9NPHHB7ry593r97e9DsmoY9BBPn6s4PQLoOYJSbZmeULdXWkq57FL6V-aqS6znIRuIg5hxGHRao_vCymlllutiQ9wsWeNw1ZJeBGdvsiOifh7sG7y3v7LXFdx4iOw'
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
    console.log(`PTR Secret\n ${secret}`)
} catch (error) {
    core.setFailed(error.message);
}