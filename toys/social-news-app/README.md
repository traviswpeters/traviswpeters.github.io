https://github.com/bpesquet/thejsway/blob/master/manuscript/chapter19.md

## Using webpack to share code between client/server code

```javascript
npm install webpack
```

Unfortunately, since I only installed it locally, simply running `webpack ...` doesn't work.
No problem. We can invoke the `webpack` executable that was installed in the `node_modules/` directory.
To do so, we use the `npm bin` command to identify the correct directory,
    then invoke `webpack` on `client.js` to create a bundle.

```javascript
$(npm bin)/webpack ./client.js bundle.js
```

### Improved webpack

If we create a file with the webpack configuration information,
    we can simply invoke webpack as follows:

```javascript
$(npm bin)/webpack
```

The configuration file for webpack should contain at least the following:

```
# webpack.config.js
module.exports = {
    entry: "./client.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    }
};
```
