import crypto from 'crypto';

class Block {
  constructor(index, data, previousHash) {
    this.index = index;
    this.data = data;
    this.nonce = 0;
    this.previousHash = previousHash;

    // this is to ensure consistency amongst genesis blocks
    if (index == 0) {
      this.timestamp = 1534291200;
    } else {
      this.timestamp = Date.now();
    }

    this.hash = this.createProofOfWork();
  }

  getHash() {
      return this.hash;
  }

  createProofOfWork() {
    console.log('completing proof of work for local block with index ' + this.index + '...');

    while(true) {
      let hash = this.generateHash();

      if (this.isCorrectHash(hash)) {
        return hash;
      } else {
        this.changeHashIngredients();
      }
    }
  }

  generateHash() {
    let hash = crypto.createHash('sha256');
    hash.update(this.index + this.data + this.timestamp + this.previousHash + this.nonce);
    hash = hash.digest('hex');
    return hash;
  }

  isCorrectHash(hash) {
    return hash.substring(0,3) === '000';
  }

  changeHashIngredients() {
    this.nonce++;
  }
}

export default Block;
