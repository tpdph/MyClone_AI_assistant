import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Avatar from './Avatar.tsx';

const AvatarTraining: React.FC = () => {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    setProcessing(true);
    setError(null);

    const formData = new FormData();
    acceptedFiles.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('/api/avatar/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload files');
      }

      const data = await response.json();
      setAvatarUrl(data.avatarUrl);
      setProcessing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error uploading files');
      setProcessing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png']
    },
    maxFiles: 1
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {t('avatar.title')}
      </Typography>
      
      <Box sx={{ 
        display: 'flex', 
        gap: 4, 
        flexDirection: { xs: 'column', md: 'row' } 
      }}>
        {/* Avatar Preview */}
        <Box sx={{ 
          flex: 1,
          minHeight: 300,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px solid #ccc',
          borderRadius: 1
        }}>
          {avatarUrl ? (
            <Avatar url={avatarUrl} />
          ) : (
            <Typography color="text.secondary">
              {t('avatar.noAvatar')}
            </Typography>
          )}
        </Box>

        {/* Upload Section */}
        <Box sx={{ flex: 1 }}>
          <Box
            {...getRootProps()}
            sx={{
              p: 3,
              border: '2px dashed #ccc',
              borderRadius: 1,
              cursor: 'pointer',
              bgcolor: isDragActive ? 'action.hover' : 'background.paper',
              '&:hover': {
                bgcolor: 'action.hover'
              }
            }}
          >
            <input {...getInputProps()} />
            <Typography align="center">
              {isDragActive
                ? t('avatar.dropHere')
                : t('avatar.dragDrop')}
            </Typography>
          </Box>

          {processing && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <CircularProgress size={24} />
              <Typography sx={{ ml: 1 }}>
                {t('avatar.processing')}
              </Typography>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {files.length > 0 && !processing && !error && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {t('avatar.uploadSuccess')}
            </Alert>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AvatarTraining;
