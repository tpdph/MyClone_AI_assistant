import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface VoiceTriggerProps {
  onTrigger: (transcript: string) => void;
  isListening?: boolean;
}

export const VoiceTrigger: React.FC<VoiceTriggerProps> = ({ onTrigger, isListening: externalIsListening }) => {
  const { t } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (typeof externalIsListening !== 'undefined') {
      setIsListening(externalIsListening);
    }
  }, [externalIsListening]);

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join('');

        if (event.results[0].isFinal) {
          onTrigger(transcript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        setError(event.error);
        setIsListening(false);
      };
    } else {
      setError(t('voice.errors.notSupported'));
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTrigger]);

  const setupAudioContext = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const updateAudioLevel = () => {
        if (!analyserRef.current) return;
        
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;
        setAudioLevel(average / 128); // Normalize to 0-1
        
        animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      };
      
      updateAudioLevel();
    } catch (err) {
      setError(t('voice.errors.microphoneAccess'));
    }
  };

  const cleanupAudioContext = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const toggleListening = async () => {
    if (!recognitionRef.current) {
      setError(t('voice.errors.notSupported'));
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      cleanupAudioContext();
    } else {
      try {
        await setupAudioContext();
        recognitionRef.current.start();
      } catch (err) {
        setError(t('voice.errors.recognition'));
      }
    }
    setIsListening(!isListening);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={toggleListening}
        className={`relative z-10 rounded-full p-3 text-white transition-colors ${
          isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
        whileTap={{ scale: 0.95 }}
        title={isListening ? t('voice.stopListening') : t('voice.startListening')}
      >
        {isListening ? (
          <MicOff className="w-6 h-6" />
        ) : (
          <Mic className="w-6 h-6" />
        )}
      </motion.button>

      {isListening && (
        <motion.div
          className="absolute inset-0 rounded-full bg-indigo-200 z-0"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.2, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            transform: `scale(${1 + audioLevel * 0.5})`,
          }}
        />
      )}

      {error && (
        <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  );
};
