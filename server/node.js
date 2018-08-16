import ChainManager from './chainManager';
import WebSocket from 'ws';

class Node {
    constructor() {
      this.NEW_BLOCK = 'NEW_BLOCK';
      this.BLOCK_REQUEST = 'BLOCK_REQUEST';
      this.NEW_CHAIN = 'NEW_CHAIN';
      this.CHAIN_REQUEST = 'CHAIN_REQUEST';

      this.chainManager = new ChainManager();
      this.chainManager.initChain();

      const lowestPort = 4000;
      const port = lowestPort + Math.floor(Math.random() * 1000);
      this.wss = new WebSocket.Server({port: port});

      console.log('WSS listening on port: ' + port);

      this.wss.on('connection', (ws) => {
        this.initConnection(ws);
      })
    }

    initConnection(ws) {
      ws.on('error', (err) => {
        console.log(err);
      });

      ws.on('open', () => {
        this.handleSocketMessages(ws);
        this.requestLatestBlockFromPeer(ws);
      });
    }

    handleSocketMessages(ws) {
      ws.on('message', (message) => {
        message = JSON.parse(message);
        switch (message.event) {
          case this.NEW_BLOCK:
            this.processNewBlock(message.data);
          case this.BLOCK_REQUEST:
            this.sendLatestBlockToPeer(ws);
          case this.NEW_CHAIN:
            this.processNewChain(message.data);
          case this.CHAIN_REQUEST:
            this.sendChainToPeer(ws);
        }
      });
    }

    requestLatestBlockFromPeer(peer) {
      peer.send(JSON.stringify({event: this.BLOCK_REQUEST}));
    }

    sendLatestBlockToPeer(peer) {
      peer.send(JSON.stringify({event: this.NEW_BLOCK, message: this.chainManager.getCurrentBlock()}));
    }

    processNewBlock(block) {
      if (block.index = this.chainManager().getNextIndex()) {
        this.addBlock(block);
        console.log(this.chainManager().printChain());
      } else if (block.index > this.chainManager().getNextIndex()) {
        this.requestChainsFromPeers();
        console.log(this.chainManager().printChain());
      }
    }

    createBlockAndBroadcast(data) {
        let block = this.createBlock(data);
        this.broadcast({event: this.NEW_BLOCK, data: block});
    }

    createBlock(data) {
      let block = this.chainManager.createBlock(data);
      this.chainManager.addBlock(block);
      return block;
    }

    addBlock(block) {
      chainManager.addBlock(block);
    }

    requestChainsFromPeers() {
      this.broadcast({event: this.CHAIN_REQUEST});
    }

    sendChainToPeer(ws) {
      let message = {event: this.NEW_CHAIN, data: this.chainManager.getChain()};
      ws.send(JSON.stringify(message));
    }

    processNewChain(chain) {
      if (this.chainManager.verifyChain(chain)) {
        this.chainManager.replaceChain(chain);
      }
    }

    addPeer(port) {
      let ws = new WebSocket('ws://localhost:' + port);
      this.initConnection(ws);
    }

    broadcast(message) {
      this.wss.clients.forEach(() => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message));
        }
      })
    }
}

export default Node;
