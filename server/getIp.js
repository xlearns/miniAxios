var express = require('express')
var app = express();
//发送请求，获取客户端ip
app.get('/', function (req, res) {
  var clientIp = getIp(req)
  console.log('客户端ip',clientIp)
  res.send('Hello World');
})

var getIp = function(req) {
  return req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
};
// 指定ipv4格式
var server = app.listen(3000, '0.0.0.0',function () {
  var host = server.address().address
  var port = server.address().port
  console.log('http://localhost:3000')
})

