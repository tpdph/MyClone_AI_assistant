import React from 'react';
import {
  Box,
  Typography,
  Slider,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Smile,
  Frown,
  Meh,
  Zap,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const MotionIconButton = motion(IconButton);

interface EmotionalStateProps {
  onStateChange: (state: string, intensity: number) => void;
}

const EmotionalState: React.FC<EmotionalStateProps> = ({ onStateChange }) => {
  const { t } = useTranslation();
  const [selectedState, setSelectedState] = React.useState<string>('neutral');
  const [intensity, setIntensity] = React.useState<number>(50);

  const emotionalStates = [
    { id: 'neutral', icon: Meh, label: t('emotional.states.neutral') },
    { id: 'happy', icon: Smile, label: t('emotional.states.happy') },
    { id: 'sad', icon: Frown, label: t('emotional.states.sad') },
    { id: 'excited', icon: Zap, label: t('emotional.states.excited') },
    { id: 'concerned', icon: AlertCircle, label: t('emotional.states.concerned') },
    { id: 'professional', icon: Briefcase, label: t('emotional.states.professional') }
  ];

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    onStateChange(state, intensity);
  };

  const handleIntensityChange = (_event: Event, newValue: number | number[]) => {
    const value = Array.isArray(newValue) ? newValue[0] : newValue;
    setIntensity(value);
    onStateChange(selectedState, value);
  };

  const getIntensityLabel = (value: number) => {
    if (value <= 33) return t('emotional.intensity.low');
    if (value <= 66) return t('emotional.intensity.medium');
    return t('emotional.intensity.high');
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t('emotional.title')}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          {t('emotional.description')}
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {emotionalStates.map(({ id, icon: Icon, label }) => (
            <Grid item key={id}>
              <Tooltip title={label}>
                <MotionIconButton
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  color={selectedState === id ? 'primary' : 'default'}
                  onClick={() => handleStateChange(id)}
                  sx={{
                    bgcolor: selectedState === id ? 'primary.light' : 'transparent',
                    '&:hover': {
                      bgcolor: selectedState === id ? 'primary.light' : 'action.hover'
                    }
                  }}
                >
                  <Icon />
                </MotionIconButton>
              </Tooltip>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ px: 2 }}>
          <Typography id="intensity-slider" gutterBottom>
            {t('emotional.intensity.title')}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Slider
              value={intensity}
              onChange={handleIntensityChange}
              aria-labelledby="intensity-slider"
              valueLabelDisplay="auto"
              valueLabelFormat={getIntensityLabel}
              sx={{ ml: 1 }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EmotionalState;
