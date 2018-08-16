import Chain from './chain';
import Block from './block';
import crypto from 'crypto';

class ChainManager {
  initChain() {
    this.chain = new Chain();
    // arbitrary string generated with SHA256
    this.genesisHash = '86d5bc08c2eba828a8e3588e25ad26a312ce77f6ecc02e3500ba05607f49c935';
    let genesisBlock = new Block(0, "Genesis", this.genesisHash);
    this.chain.setGenesisBlock(genesisBlock);
  }

  getMaxIndex() {
    return this.chain.getLength() - 1;
  }

  getNextIndex() {
    return this.getMaxIndex() + 1;
  }

  getChain() {
    return this.chain;
  }

  getCurrentBlock() {
    return this.chain.getCurrentBlock();
  }

  createBlock(data) {
    let block = new Block(this.getMaxIndex() + 1, data, this.chain.getCurrentBlockHash());
    return block;
  }

  addBlock(nextBlock) {
    if (this.verifyBlock(this.chain.getCurrentBlock(), nextBlock)) {
      this.chain.addBlock(nextBlock);
      console.log(this.printChain());
    }
  }

  verifyBlock(block, nextBlock) {
    if (this.blockIsSuccessor(block, nextBlock) && this.verifyHash(nextBlock) && this.verifyPOW(nextBlock.hash)) {
      return true;
    } else {
      return false;
    }
  }

  blockIsSuccessor(block, nextBlock) {
    return nextBlock.index == block.index + 1 && nextBlock.previousHash == block.hash;
  }

  verifyHash(block) {
    let hash = crypto.createHash('sha256');
    hash.update(block.index + block.data + block.timestamp + block.previousHash + block.nonce);
    hash = hash.digest('hex');

    return block.hash === hash;
  }

  verifyPOW(hash) {
    return hash.substring(0,3) === '000'
  }

  verifyChain(chain) {
    if (chain.getLength() <= this.chain.getLength()) {
      return false;
    }

    if (chain.getGenesisBlock().hash !== this.chain.getGenesisBlock().hash) {
      return false;
    }

    return this.checkAllBlocksValid(chain);
  }

  checkAllBlocksValid(chain) {
    let chainLength = chain.blocks.length;
    let chainBlocks = chain.blocks
    let currentBlock;
    let nextBlock;

    for (let i = 0; i < chainLength - 1; i++) {
      currentBlock = chainBlocks[i];
      nextBlock = chainBlocks[i+1];

      if (!this.verifyBlock(currentBlock, nextBlock)) {
        return false;
      }
    }

    return true;
  }

  replaceChain(newChain) {
    if (this.verifyChain(newChain)) {
      this.chain = newChain;
    } else {
      console.log('could not verify chain');
    }
  }

  printChain() {
    console.log(this.chain.blocks);
  }
}

export default ChainManager;
