import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import os from 'os';
import {
  getKnowledgeItems,
  addKnowledgeItem,
  deleteKnowledgeItem,
  getCurrentEmotion,
  addEmotionalState,
  analyzeEmotionalResponse
} from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3001;

// Get local IP addresses
const getLocalIPs = () => {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  
  for (const k in interfaces) {
    for (const k2 in interfaces[k]) {
      const address = interfaces[k][k2];
      if (address.family === 'IPv4' && !address.internal) {
        addresses.push(address.address);
      }
    }
  }
  return addresses;
};

const addresses = getLocalIPs();
const networkIp = addresses[0]; // Use first non-internal IPv4 address

// Enable CORS
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'uploads');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Available models endpoint
app.get('/api/models', (req, res) => {
  const models = [
    {
      id: 'Xenova/LaMini-Flan-T5-783M',
      name: 'LaMini-Flan-T5',
      description: 'A compact and efficient language model for text generation.'
    },
    {
      id: 'Xenova/distilgpt2',
      name: 'DistilGPT2',
      description: 'A lightweight version of GPT-2 for faster text generation.'
    }
  ];
  
  res.json({ success: true, models });
});

// Load model endpoint
app.post('/api/load-model', async (req, res) => {
  try {
    const { modelId } = req.body;
    
    // Validate model ID
    const validModels = ['Xenova/LaMini-Flan-T5-783M', 'Xenova/distilgpt2'];
    if (!validModels.includes(modelId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid model ID'
      });
    }

    // Simulate model loading
    await new Promise(resolve => setTimeout(resolve, 1000));

    res.json({
      success: true,
      message: `Model ${modelId} loaded successfully`
    });
  } catch (error) {
    console.error('Error loading model:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load model'
    });
  }
});

// Avatar upload endpoint
app.post('/train-avatar', upload.array('photos', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files uploaded'
      });
    }

    res.json({
      success: true,
      message: 'Files uploaded successfully',
      files: req.files.map(f => f.filename)
    });
  } catch (error) {
    console.error('Error handling avatar upload:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process avatar upload'
    });
  }
});

// Voice upload endpoint
app.post('/train-voice', upload.array('recordings', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files uploaded'
      });
    }

    res.json({
      success: true,
      message: 'Voice recordings uploaded successfully',
      files: req.files.map(f => f.filename)
    });
  } catch (error) {
    console.error('Error handling voice upload:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process voice recordings'
    });
  }
});

// Knowledge base endpoints
app.get('/api/knowledge', (req, res) => {
  try {
    const items = getKnowledgeItems();
    res.json({
      success: true,
      items
    });
  } catch (error) {
    console.error('Error getting knowledge items:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get knowledge items'
    });
  }
});

app.post('/api/knowledge', (req, res) => {
  try {
    const { content, source } = req.body;
    
    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Content is required'
      });
    }

    const newItem = {
      id: Date.now().toString(),
      content,
      source: source || 'manual',
      timestamp: Date.now()
    };

    addKnowledgeItem(newItem);

    res.json({
      success: true,
      item: newItem
    });
  } catch (error) {
    console.error('Error adding knowledge item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add knowledge item'
    });
  }
});

app.delete('/api/knowledge/:id', (req, res) => {
  try {
    const { id } = req.params;
    const result = deleteKnowledgeItem(id);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting knowledge item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete knowledge item'
    });
  }
});

// Emotion endpoints
app.get('/api/emotion', (req, res) => {
  try {
    const emotion = getCurrentEmotion();
    res.json({
      success: true,
      emotion: emotion || { emotion: 'neutral', intensity: 0 }
    });
  } catch (error) {
    console.error('Error getting emotion:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get emotion'
    });
  }
});

app.post('/api/emotion/analyze', (req, res) => {
  try {
    const { input } = req.body;
    
    if (!input) {
      return res.status(400).json({
        success: false,
        error: 'Input is required'
      });
    }

    const emotion = analyzeEmotionalResponse(input);
    addEmotionalState(emotion);

    res.json({
      success: true,
      emotion
    });
  } catch (error) {
    console.error('Error analyzing emotion:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze emotion'
    });
  }
});

// Knowledge upload endpoint
app.post('/api/knowledge/upload', upload.array('files'), (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    res.json({ 
      message: 'Files uploaded successfully',
      files: files.map(f => ({ 
        filename: f.filename,
        path: f.path,
        size: f.size
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Network info endpoint
app.get('/api/network-info', (req, res) => {
  const networkInterfaces = os.networkInterfaces();
  let ipAddress = 'localhost';

  // Find the first non-internal IPv4 address
  Object.keys(networkInterfaces).forEach((ifname) => {
    networkInterfaces[ifname].forEach((iface) => {
      if (iface.family === 'IPv4' && !iface.internal) {
        ipAddress = iface.address;
      }
    });
  });

  res.json({
    ip: ipAddress,
    port: 5173 // Vite dev server port
  });
});

// Avatar upload endpoint
app.post('/api/avatar/upload', upload.array('files'), (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Process avatar files and return URL
    const avatarUrl = `/uploads/${files[0].filename}`;
    
    res.json({ 
      message: 'Files uploaded successfully',
      avatarUrl,
      files: files.map(f => ({ 
        filename: f.filename,
        path: f.path,
        size: f.size
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
  console.log('Available on:');
  const networkInterfaces = os.networkInterfaces();
  Object.keys(networkInterfaces).forEach((ifname) => {
    networkInterfaces[ifname].forEach((iface) => {
      if (iface.family === 'IPv4' && !iface.internal) {
        console.log(`  http://${iface.address}:${port}`);
      }
    });
  });
});
