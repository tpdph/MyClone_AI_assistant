const API_BASE = 'http://localhost:3001';

export async function loadModel(modelId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/load-model`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ modelId }),
  });

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error);
  }
}

export async function generateText(prompt: string, maxLength: number = 100): Promise<string> {
  const response = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, maxLength }),
  });

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error);
  }

  return result.text;
}