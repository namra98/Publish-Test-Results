const crypto = require('crypto')
const request = require('request');

var body4 = {
    repository: {
      name: "calculator-actions-pipeline"
    }
}

var body5 = JSON.stringify(body4);
var body6 = JSON.stringify(body5);

const key = 'webhooksecret'

hash1 = crypto.createHmac('sha1', key)
    .update(String.raw`${body6}`)
    .digest('hex')
hash2 = crypto.createHmac('sha1', key)
    .update(body5)
    .digest('hex')

    // "{\"repository\":{\"name\":\"calculator-actions-pipeline\"}}"

console.log(String.raw`${body5}`, body6, hash1, hash2);
