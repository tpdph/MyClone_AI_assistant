import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Brain } from 'lucide-react';

interface KnowledgeProcessingProps {
  onComplete?: () => void;
}

const KnowledgeProcessing: React.FC<KnowledgeProcessingProps> = ({ onComplete }) => {
  const { t } = useTranslation();

  React.useEffect(() => {
    // Artificial delay for processing animation
    const timer = setTimeout(() => {
      onComplete?.();
    }, 5000); // 5 seconds delay

    return () => clearTimeout(timer);
  }, [onComplete]);

  const brainVariants = {
    animate: {
      scale: [1, 1.1, 1],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants = {
    animate: {
      opacity: [0.3, 1, 0.3],
      scale: [0.8, 1.2, 0.8],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '300px',
        position: 'relative'
      }}
    >
      <motion.div
        variants={pulseVariants}
        animate="animate"
        style={{
          position: 'absolute',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          backgroundColor: 'rgba(25, 118, 210, 0.1)'
        }}
      />
      
      <motion.div
        variants={brainVariants}
        animate="animate"
        style={{
          marginBottom: '2rem',
          color: '#1976d2'
        }}
      >
        <Brain size={64} />
      </motion.div>

      <Typography variant="h6" gutterBottom>
        {t('knowledgeBase.processing')}
      </Typography>

      <CircularProgress 
        size={24}
        sx={{ mt: 2 }}
      />
    </Box>
  );
};

export default KnowledgeProcessing;
