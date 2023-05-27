const configObj = require('./config.json');
const NodeRSA  = require ('node-rsa');
var path = require('path');
const {DOMAIN, PRIVKEY_PATH, CERT_PATH, PORT,CA_PATH } = configObj;
const express = require('express');
const app = express();
const fs = require('fs');

const routes = require('./routes'),
      bodyParser = require('body-parser'),
      cors = require('cors'),
      https = require('https');


app.use(bodyParser.json({"limit":"10000kb"}));

let sslOptions = {key: fs.readFileSync(PRIVKEY_PATH),cert: fs.readFileSync(CERT_PATH),ca: fs.readFileSync(CA_PATH)};

//访问的公私钥
let key = new NodeRSA({ b :1024 } );
app.set('publicKey', key.exportKey('public'));
app.set('privateKey', key.exportKey('private'));

app.set('domain', DOMAIN.toLowerCase());
app.use(bodyParser.json({type: 'application/activity+json'})); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(bodyParser.json());

app.use('/api/admin', cors(),  routes.admin);
// app.use('/', express.static('public'));
app.use('/.well-known/webfinger', cors(), routes.webfinger);
app.use('/u', cors(), routes.user);
app.use('/m', cors(), routes.message);
app.use('/siwe',  cors(),routes.siwe);
app.use('/discussions',  cors(),routes.discussion);
app.use('/events',  cors(),routes.events);
app.use('/news',  cors(),routes.news);
app.use('/daism',  cors(),routes.daism);


//加载指定目录静态资源
app.use(express.static(__dirname + '/public'))

//配置任何请求都转到index.html，而index.html会根据React-Router规则去匹配任何一个route
app.get('*', function (request, response){
  response.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})


 const server=https.createServer(sslOptions,app).listen(PORT, function(){
   console.log('Express server listening on port 443' );
 });

server.setTimeout(0);

