import { Pipeline, pipeline } from '@xenova/transformers';
import * as Comlink from 'comlink';

class AIWorker {
  private pipeline: Pipeline | null = null;
  private modelId: string | null = null;

  async loadModel(modelId: string) {
    if (this.modelId === modelId && this.pipeline) {
      return;
    }

    try {
      this.pipeline = await pipeline('text-generation', modelId);
      this.modelId = modelId;
    } catch (error) {
      console.error('Error loading model:', error);
      throw error;
    }
  }

  async generate(prompt: string, maxLength: number = 100) {
    if (!this.pipeline) {
      throw new Error('Model not loaded');
    }

    try {
      const result = await this.pipeline(prompt, {
        max_new_tokens: maxLength,
        temperature: 0.7,
        do_sample: true,
      });

      return result[0].generated_text;
    } catch (error) {
      console.error('Error generating text:', error);
      throw error;
    }
  }
}

Comlink.expose(new AIWorker());