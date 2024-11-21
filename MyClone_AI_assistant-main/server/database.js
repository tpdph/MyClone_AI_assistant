import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'assistant.db'));

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS knowledge_base (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    source TEXT NOT NULL,
    timestamp INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    messages TEXT NOT NULL,
    timestamp INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS emotional_state (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    emotion TEXT NOT NULL,
    intensity REAL NOT NULL,
    trigger TEXT,
    timestamp INTEGER NOT NULL
  );
`);

// Knowledge base operations
export const getKnowledgeItems = () => {
  const stmt = db.prepare('SELECT * FROM knowledge_base ORDER BY timestamp DESC');
  return stmt.all();
};

export const addKnowledgeItem = (item) => {
  const stmt = db.prepare(
    'INSERT INTO knowledge_base (id, content, source, timestamp) VALUES (?, ?, ?, ?)'
  );
  return stmt.run(item.id, item.content, item.source, item.timestamp);
};

export const deleteKnowledgeItem = (id) => {
  const stmt = db.prepare('DELETE FROM knowledge_base WHERE id = ?');
  return stmt.run(id);
};

// Conversation operations
export const getConversations = () => {
  const stmt = db.prepare('SELECT * FROM conversations ORDER BY timestamp DESC LIMIT 50');
  return stmt.all().map(conv => ({
    ...conv,
    messages: JSON.parse(conv.messages)
  }));
};

export const addConversation = (conversation) => {
  const stmt = db.prepare(
    'INSERT INTO conversations (id, messages, timestamp) VALUES (?, ?, ?)'
  );
  return stmt.run(
    conversation.id,
    JSON.stringify(conversation.messages),
    conversation.timestamp
  );
};

// Emotional state operations
export const getCurrentEmotion = () => {
  const stmt = db.prepare('SELECT * FROM emotional_state ORDER BY timestamp DESC LIMIT 1');
  return stmt.get();
};

export const addEmotionalState = (emotion) => {
  const stmt = db.prepare(
    'INSERT INTO emotional_state (emotion, intensity, trigger, timestamp) VALUES (?, ?, ?, ?)'
  );
  return stmt.run(emotion.emotion, emotion.intensity, emotion.trigger, Date.now());
};

// Emotional analysis
export const analyzeEmotionalResponse = (input) => {
  // Basic emotion detection based on keywords and patterns
  const emotions = {
    joy: ['happy', 'great', 'wonderful', 'excited', 'love', '😊', '😃'],
    sadness: ['sad', 'sorry', 'disappointed', 'unhappy', 'miss', '😢', '😔'],
    anger: ['angry', 'frustrated', 'annoyed', 'upset', 'hate', '😠', '😡'],
    fear: ['afraid', 'scared', 'worried', 'nervous', 'anxious', '😨', '😰'],
    surprise: ['wow', 'amazing', 'unexpected', 'incredible', '😲', '😮'],
    neutral: []
  };

  const text = input.toLowerCase();
  let dominantEmotion = 'neutral';
  let maxScore = 0;

  for (const [emotion, keywords] of Object.entries(emotions)) {
    const score = keywords.reduce((acc, keyword) => {
      return acc + (text.includes(keyword) ? 1 : 0);
    }, 0);

    if (score > maxScore) {
      maxScore = score;
      dominantEmotion = emotion;
    }
  }

  // Calculate intensity (0-1)
  const intensity = Math.min(maxScore / 3, 1);

  return {
    emotion: dominantEmotion,
    intensity,
    trigger: input
  };
};

export default db;
