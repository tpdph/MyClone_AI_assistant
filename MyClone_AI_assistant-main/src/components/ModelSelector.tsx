import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Box, Typography, CircularProgress, Alert, Card, CardContent, Button } from '@mui/material';

interface Model {
  id: string;
  name: string;
  description: string;
}

export const ModelSelector: React.FC = () => {
  const { t } = useTranslation();
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:3001/api/models');
      if (!response.ok) {
        throw new Error(t('model.error.fetch'));
      }
      const data = await response.json();
      setModels(data.models || []);
    } catch (err) {
      console.error('Error fetching models:', err);
      setError(t('model.error.load'));
    } finally {
      setLoading(false);
    }
  };

  const handleModelSelect = async (modelId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:3001/api/load-model', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ modelId }),
      });
      
      if (!response.ok) {
        throw new Error(t('model.error.load'));
      }
      
      const data = await response.json();
      if (data.success) {
        setSelectedModel(modelId);
      } else {
        throw new Error(data.error || t('model.error.load'));
      }
    } catch (err) {
      console.error('Error loading model:', err);
      setError(t('model.error.select'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('model.title')}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'grid', gap: 2 }}>
        {models.map((model) => (
          <Card
            key={model.id}
            variant="outlined"
            sx={{
              borderColor: selectedModel === model.id ? 'primary.main' : 'divider',
              bgcolor: selectedModel === model.id ? 'primary.light' : 'background.paper',
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {model.name}
              </Typography>
              <Typography color="text.secondary" paragraph>
                {model.description}
              </Typography>
              <Button
                variant={selectedModel === model.id ? "contained" : "outlined"}
                onClick={() => handleModelSelect(model.id)}
                fullWidth
              >
                {selectedModel === model.id ? t('model.selected') : t('model.select')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};