import express from 'express';
import cors from 'cors';
import * as ort from 'onnxruntime-node';
import { TokenizerLocal } from './tokenizer.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;
let session = null;
let tokenizer = null;

async function loadModel(modelId) {
  try {
    if (session) {
      await session.release();
    }

    // Load the ONNX model
    const modelPath = `./models/${modelId}/model.onnx`;
    session = await ort.InferenceSession.create(modelPath, {
      executionProviders: ['cpu'],
      graphOptimizationLevel: 'all',
      optimizedModelFilePath: `./models/${modelId}/model_optimized.onnx`,
    });

    // Initialize tokenizer
    tokenizer = new TokenizerLocal(modelId);
    await tokenizer.init();

    return { success: true };
  } catch (error) {
    console.error('Error loading model:', error);
    return { success: false, error: error.message };
  }
}

async function generateText(prompt, maxLength = 100) {
  if (!session || !tokenizer) {
    throw new Error('Model not loaded');
  }

  const inputIds = await tokenizer.encode(prompt);
  const inputTensor = new ort.Tensor('int64', inputIds, [1, inputIds.length]);

  const outputs = await session.run({
    input_ids: inputTensor,
  });

  const generatedIds = outputs.output_ids.data;
  const text = await tokenizer.decode(generatedIds);

  return text;
}

app.post('/load-model', async (req, res) => {
  const { modelId } = req.body;
  const result = await loadModel(modelId);
  res.json(result);
});

app.post('/generate', async (req, res) => {
  const { prompt, maxLength } = req.body;
  try {
    const text = await generateText(prompt, maxLength);
    res.json({ success: true, text });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Inference server running on port ${PORT}`);
});