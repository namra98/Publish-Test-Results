var request = require('request-promise');


async function run() {
    var req = await request({
        url: `https://example.com/`,
        method: "GET"
      }
      );

    console.log(req);
    return req;
}

async function r() {
    var res = await run();
    console.log("res", res);
}

r();