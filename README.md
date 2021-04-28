# Prestashop 1.7.x REST client

This Node.js library enables JavaScript applications to communicate with Prestashop 1.7.x sites using their REST API.

**NOTE: the library is not finished yet!**


## Installation

The library can be installed using the Npm package manager:

```
    npm install --save github:alexgenovese/prestashop-api-nodejs
```

## Usage

The code sample below shows the usage of the library:

```javascript
    var Prestashop = require('prestashop-api-nodejs');

    var options = {
          url: 'prestashop.local',
          key: '<Prestashop Token>'
    };
    var client = new Prestashop(options);
    await client.get({
          resource: 'customers',
          output_format: 'JSON',
          ws_key: '<Prestashop Token>'
        })
```
