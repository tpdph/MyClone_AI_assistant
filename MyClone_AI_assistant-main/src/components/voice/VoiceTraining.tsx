import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Box, Typography, Button, Alert, Modal, Paper } from '@mui/material';
import { Mic, Square, Upload, Trash2, Volume2, HelpCircle, Smartphone } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from 'react-i18next';

interface AudioRecording {
  url: string;
  blob: Blob;
}

interface NetworkInfo {
  ip: string;
  port: number;
}

const VoiceTraining: React.FC = () => {
  const { t } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<AudioRecording[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    fetch('/api/network-info')
      .then(response => response.json())
      .then((data: NetworkInfo) => {
        setNetworkInfo(data);
        // Use the network IP instead of localhost
        const url = `http://${data.ip}:${data.port}/voice-record`;
        setQrUrl(url);
      })
      .catch(error => {
        console.error('Error fetching network info:', error);
        // Fallback to current window location if network info fails
        const protocol = window.location.protocol;
        const hostname = window.location.hostname;
        const port = window.location.port || (protocol === 'https:' ? '443' : '80');
        const baseUrl = `${protocol}//${hostname}:${port}`;
        setQrUrl(`${baseUrl}/voice-record`);
      });
  }, []);

  const getQRUrl = () => {
    if (!networkInfo) return qrUrl;
    return `http://${networkInfo.ip}:${networkInfo.port}/voice-record`;
  };

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setRecordings(prev => [...prev, { url, blob: audioBlob }]);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setError(null);
    } catch (err) {
      setError(t('voice.micPermission'));
      console.error('Error accessing microphone:', err);
    }
  }, [t]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const deleteRecording = useCallback((index: number) => {
    const recording = recordings[index];
    URL.revokeObjectURL(recording.url);
    setRecordings(prev => prev.filter((_, i) => i !== index));
  }, [recordings]);

  const handleUpload = useCallback(async () => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      recordings.forEach((recording, index) => {
        formData.append(`recording${index}`, recording.blob, `recording${index}.wav`);
      });

      // TODO: Replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      recordings.forEach(recording => URL.revokeObjectURL(recording.url));
      setRecordings([]);
      setIsUploading(false);
    } catch (err) {
      setError(t('voice.error'));
      setIsUploading(false);
    }
  }, [recordings, t]);

  const handleRecordClick = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  const playRecording = useCallback((index: number) => {
    const recording = recordings[index];
    const audio = new Audio(recording.url);
    audio.play();
  }, [recordings]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('voice.title')}
      </Typography>
      <Typography variant="body1" paragraph>
        {t('voice.description')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          color={isRecording ? 'error' : 'primary'}
          onClick={handleRecordClick}
          startIcon={isRecording ? <Square /> : <Mic />}
        >
          {isRecording ? t('voice.stopRecording') : t('voice.startRecording')}
        </Button>
        
        <Button
          variant="outlined"
          onClick={() => setShowQRCode(true)}
          startIcon={<Smartphone />}
        >
          {t('voice.recordOnPhone')}
        </Button>

        <Button
          variant="outlined"
          onClick={() => setShowTips(true)}
          startIcon={<HelpCircle />}
        >
          {t('voice.tips')}
        </Button>
      </Box>

      <Modal
        open={showQRCode}
        onClose={() => setShowQRCode(false)}
        aria-labelledby="qr-code-modal"
      >
        <Paper sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxWidth: 400,
          outline: 'none'
        }}>
          <Typography id="qr-code-modal" variant="h6" gutterBottom>
            {t('voice.scanQR')}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <QRCodeSVG value={getQRUrl()} size={256} />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {t('voice.scanInstructions')}
          </Typography>
        </Paper>
      </Modal>

      {showTips && (
        <Box sx={{ 
          bgcolor: 'primary.light',
          p: 2,
          borderRadius: 1,
          mb: 3,
          color: 'primary.contrastText'
        }}>
          <Typography variant="h6" gutterBottom>
            {t('voice.tipsTitle')}
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2 }}>
            {[1, 2, 3, 4].map((num) => (
              <Typography component="li" key={num}>
                {t(`voice.tip${num}`)}
              </Typography>
            ))}
          </Box>
        </Box>
      )}

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('voice.recordings')}
        </Typography>
        {recordings.map((recording, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 2,
              p: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
            }}
          >
            <Typography>
              {t('voice.recording')} {index + 1}
            </Typography>
            <audio src={recording.url} controls />
            <Button
              startIcon={<Volume2 />}
              onClick={() => playRecording(index)}
            >
              {t('voice.play')}
            </Button>
            <Button
              color="error"
              startIcon={<Trash2 />}
              onClick={() => deleteRecording(index)}
            >
              {t('voice.delete')}
            </Button>
          </Box>
        ))}
      </Box>

      {recordings.length > 0 && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={isUploading}
          startIcon={<Upload />}
          sx={{ mt: 2 }}
        >
          {isUploading ? t('voice.uploading') : t('voice.upload')}
        </Button>
      )}
    </Box>
  );
};

export default VoiceTraining;
