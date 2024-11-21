import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import * as ort from 'onnxruntime-node';
import { TokenizerLocal } from './tokenizer.js';
import { voiceService } from './services/voiceService.js';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.path.includes('avatar') ? 'avatar' : req.path.includes('knowledge') ? 'knowledge' : 'voice';
    const uploadDir = path.join(process.cwd(), 'uploads', type);
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    // Accept images and videos only
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/') || file.mimetype.startsWith('audio/') || file.mimetype.startsWith('application/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image, video, audio, and application files are allowed'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

const PORT = 3001;
let session = null;
let tokenizer = null;

// Available models
const availableModels = [
  {
    id: 'gpt2-small',
    name: 'GPT-2 Small',
    description: 'A lightweight GPT-2 model suitable for text generation'
  },
  {
    id: 'voice-model-1',
    name: 'Voice Model v1',
    description: 'Default voice synthesis model'
  }
];

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

// API Routes
app.get('/api/models', (req, res) => {
  res.json({ success: true, models: availableModels });
});

app.post('/api/load-model', async (req, res) => {
  const { modelId } = req.body;
  const result = await loadModel(modelId);
  res.json(result);
});

app.post('/api/generate', async (req, res) => {
  const { prompt, maxLength } = req.body;
  try {
    const text = await generateText(prompt, maxLength);
    res.json({ success: true, text });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Avatar training endpoint
app.post('/api/train-avatar', (req, res) => {
  upload.array('photos', 10)(req, res, async (err) => {
    try {
      if (err) {
        console.error('Upload error:', err);
        return res.status(400).json({ 
          success: false, 
          error: err.message || 'Error uploading files' 
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'No files uploaded' 
        });
      }

      // Log the uploaded files
      console.log('Uploaded files:', req.files.map(f => ({ 
        name: f.originalname, 
        path: f.path 
      })));

      // Here you would implement the avatar generation logic
      // For example, using MediaPipe or a similar service
      const photoFiles = req.files.map(file => file.path);
      
      // Placeholder for avatar generation
      const modelUrl = '/models/avatar/default.glb';

      // Ensure the model file exists
      const modelPath = path.join(process.cwd(), 'models', 'avatar', 'default.glb');
      if (!fs.existsSync(modelPath)) {
        return res.status(500).json({ 
          success: false, 
          error: 'Avatar model not found' 
        });
      }

      return res.json({ 
        success: true, 
        modelUrl,
        files: req.files.length
      });
    } catch (error) {
      console.error('Error training avatar:', error);
      return res.status(500).json({ 
        success: false, 
        error: error.message || 'Internal server error' 
      });
    }
  });
});

// Knowledge base file upload endpoint
app.post('/api/knowledge/upload', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, error: 'No files uploaded' });
    }

    // Process uploaded files
    const uploadedFiles = req.files.map(file => ({
      name: file.originalname,
      path: file.path,
      type: file.mimetype
    }));

    // Extract text content from files (placeholder)
    // In a real implementation, you would use libraries like pdf-parse for PDFs,
    // mammoth for Word documents, etc.
    const content = req.body.content || 'Uploaded files: ' + uploadedFiles.map(f => f.name).join(', ');

    res.json({
      success: true,
      content,
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Error processing knowledge base files:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Voice training endpoint
app.post('/api/train-voice', upload.array('recordings', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, error: 'No files uploaded' });
    }

    const recordingFiles = req.files.map(file => file.path);
    await voiceService.trainModel(recordingFiles);

    res.json({ success: true, modelId: 'voice-model-1' });
  } catch (error) {
    console.error('Error training voice model:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Text-to-speech endpoint
app.post('/api/synthesize', async (req, res) => {
  try {
    const { text, voiceId } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, error: 'No text provided' });
    }

    const audioBuffer = await voiceService.synthesizeSpeech(text);
    res.json({ success: true, audio: audioBuffer });
  } catch (error) {
    console.error('Error synthesizing speech:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Create upload directories if they don't exist
  const uploadDirs = ['avatar', 'voice', 'knowledge'].map(type => 
    path.join(process.cwd(), 'uploads', type)
  );
  
  uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
});