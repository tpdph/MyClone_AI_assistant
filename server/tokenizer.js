import { TokenizerLocal as Tokenizer } from 'tokenizers';
import fs from 'fs/promises';

export class TokenizerLocal {
  constructor(modelId) {
    this.modelId = modelId;
    this.tokenizer = null;
  }

  async init() {
    const vocabPath = `./models/${this.modelId}/tokenizer.json`;
    const vocab = await fs.readFile(vocabPath, 'utf-8');
    this.tokenizer = Tokenizer.fromString(vocab);
  }

  async encode(text) {
    if (!this.tokenizer) {
      throw new Error('Tokenizer not initialized');
    }
    const encoded = await this.tokenizer.encode(text);
    return encoded.ids;
  }

  async decode(ids) {
    if (!this.tokenizer) {
      throw new Error('Tokenizer not initialized');
    }
    return await this.tokenizer.decode(ids);
  }
}