const request = require('request');
const httpBuildQuery = require('http-build-query');
var nodeBase64 = require('nodejs-base64-converter');

const params = ['filter', 'display', 'sort', 'limit', 'schema', 'id_shop', 'id_group_shop', 'query', 'language'];

const req = (opt) => {
    return new Promise((resolve) => {
        request(opt, (err, res, body) => {
            resolve({
                err: err,
                res: res,
                body: body
            });
        });
    });
};

const exec = async (opt) => {
    let {err, res, body} = await req(opt);
    if(err) return {status_code: 500, response: null, headers: null}
    return {
        status_code: res.statusCode,
        response: body,
        headers: res.headers
    };
};

const buildQuery = (opt) => {
    let url_params = {};
    let query = '';
    for(let param of params) {
        for(let [key, value] of Object.entries(opt)) {
            if(key === param || key.includes(param)) {
                url_params[key] = opt[key];
            }
        }
    }
    if(Object.entries(url_params).length > 0) {
        query = `${httpBuildQuery(url_params)}`;
    }
    return query;
};

const buildRoute = (options, opt) => {
    let route = `${options.url}/api/${opt['resource']}`;
    if(opt['id']) route = `${route}/${opt['id']}`;
    return route;
};

const buildUrl = (options, opt) => {
    let route = buildRoute(options, opt);
    let query = buildQuery(opt);
    url = `${route}?ws_key=${options.key}&output_format=JSON&${query}`;
    return url;
};

module.exports = function( options ) {
    const base64_key = nodeBase64.encode(options.key + ':')

    this.post = async (opt) => {
        let url = buildUrl(options, opt);
        let body = opt['body'];
        let req = await exec({
            url: url,
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + base64_key,
                'Content-Type': 'application/json'
            },
            body: opt['output_format'] === 'JSON' ? JSON.stringify(body) : body
        });
        return JSON.parse(req['response'])
    };
    this.get = async (opt) => {
        let url = buildUrl(options, opt);
        let req = await exec({
            url: url,
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + base64_key,
                'Content-Type': 'application/json'
            }
        });
        return JSON.parse(req['response'])
    };
    this.head = async (opt) => {
        let url = buildUrl(options, opt);
        let req = await exec({
            url: url,
            method: 'HEAD',
            headers: {
                'Authorization': 'Basic ' + base64_key,
                'Content-Type': 'application/json'
            }
        });
        return req.response
    };
    this.put = async (opt) => {
        let url = buildUrl(options, opt);
        let body = opt['body'];
        let req = await exec({
            url: url,
            method: 'PUT',
            headers: {
                'Authorization': 'Basic ' + base64_key,
                'Content-Type': 'application/json'
            },
            body: opt['output_format'] === 'JSON' ? JSON.stringify(body) : body
        });
        return JSON.parse(req['response'])
    };
    this.delete = async (opt) => {
        let url = buildUrl(options, opt);
        let req = await exec({
            url: url,
            method: 'DELETE',
            headers: {
                Expect: '100-continue'
            }
        });
        return req.response
    };
}
