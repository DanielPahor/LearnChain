class Chain {
  constructor() {
    this.blocks = [];
    this.currentBlock;
    this.genesisBlock;
  }

  getLength() {
    return this.blocks.length;
  }

  getGenesisBlock() {
    return this.genesisBlock;
  }

  getCurrentBlock() {
    return this.currentBlock;
  }

  getCurrentBlockHash() {
    return this.currentBlock.hash;
  }

  setGenesisBlock(block) {
    this.addBlock(block);
    this.genesisBlock = block;
  }

  addBlock(block) {
    this.blocks.push(block);
    this.currentBlock = block;
  }
}

export default Chain;
