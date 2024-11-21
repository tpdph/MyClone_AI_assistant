import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { User2, Mic2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface AssistantCreationProps {
  onNavigate: (tab: 'shape' | 'voice') => void;
}

const MotionPaper = motion(Paper);

const ANIMATIONS = {
  card: {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2, ease: "easeInOut" }
    },
    tap: { scale: 0.95 }
  },
  icon: {
    hover: {
      rotate: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.5, ease: "easeInOut" }
    }
  }
} as const;

const AssistantCreation: React.FC<AssistantCreationProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('assistant.title')}
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4 }}>
        {t('assistant.description')}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <MotionPaper
            elevation={3}
            sx={{
              p: 3,
              cursor: 'pointer',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            whileHover={ANIMATIONS.card.hover}
            whileTap={ANIMATIONS.card.tap}
            onClick={() => onNavigate('shape')}
          >
            <motion.div whileHover={ANIMATIONS.icon.hover}>
              <User2 size={48} />
            </motion.div>
            <Typography variant="h6" sx={{ mt: 2 }}>
              {t('shape.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              {t('shape.description')}
            </Typography>
          </MotionPaper>
        </Grid>

        <Grid item xs={12} md={6}>
          <MotionPaper
            elevation={3}
            sx={{
              p: 3,
              cursor: 'pointer',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            whileHover={ANIMATIONS.card.hover}
            whileTap={ANIMATIONS.card.tap}
            onClick={() => onNavigate('voice')}
          >
            <motion.div whileHover={ANIMATIONS.icon.hover}>
              <Mic2 size={48} />
            </motion.div>
            <Typography variant="h6" sx={{ mt: 2 }}>
              {t('voice.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              {t('voice.description')}
            </Typography>
          </MotionPaper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AssistantCreation;
