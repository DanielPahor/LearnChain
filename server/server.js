import express from 'express';
import Node from './node';
import path from 'path';
import bodyParser from 'body-parser'

let node = new Node();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend: true}))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/../client/index.html'));
});

app.get('/create/:message', (req, res) => {
  let message = req.params.message;
  node.createBlockAndBroadcast(message);
});

app.get('/add/:peerPort', (req, res) => {
  let port = req.params.peerPort;
  node.addPeer(port);
});

const lowestPort = 3000;
const port = lowestPort + Math.floor(Math.random() * 1000);

app.listen(port, () => {
  console.log('HTTP server listening on port: ' + port);
});
