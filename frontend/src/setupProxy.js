const { createProxyMiddleware } = require("http-proxy-middleware");
const connect = require("../../config/connect.json");

const { serverHost } = connect;

module.exports = function (app) {
  app.use(createProxyMiddleware("/api", { target: serverHost }));
};
