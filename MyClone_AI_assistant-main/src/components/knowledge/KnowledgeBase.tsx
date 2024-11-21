import React, { useState } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import KnowledgeProcessing from './KnowledgeProcessing';

const KnowledgeBase: React.FC = () => {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles(droppedFiles);
    handleUpload(droppedFiles);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setFiles(selectedFiles);
      handleUpload(selectedFiles);
    }
  };

  const handleUpload = (filesToUpload: File[]) => {
    setIsProcessing(true);
    // Here you would typically upload the files to your server
    // For now, we'll just show the processing animation
  };

  const handleProcessingComplete = () => {
    setIsProcessing(false);
    // Here you would typically update the UI with the processed knowledge
  };

  if (isProcessing) {
    return <KnowledgeProcessing onComplete={handleProcessingComplete} />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('knowledge.title')}
      </Typography>

      <Paper
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        sx={{
          mt: 3,
          p: 4,
          textAlign: 'center',
          border: '2px dashed #ccc',
          borderRadius: 2,
          cursor: 'pointer',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'rgba(25, 118, 210, 0.04)'
          }
        }}
      >
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          id="file-input"
        />
        <label htmlFor="file-input">
          <Upload size={48} style={{ marginBottom: '1rem', color: '#1976d2' }} />
          <Typography variant="h6" gutterBottom>
            {t('assistant.uploadFiles')}
          </Typography>
          <Button variant="contained" component="span">
            {t('common.add')}
          </Button>
        </label>
      </Paper>
    </Box>
  );
};

export default KnowledgeBase;
