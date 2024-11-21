import React from 'react';
import { Box, Typography, Switch, FormControlLabel, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const Settings: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('settings.title')}
      </Typography>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          {t('settings.notifications')}
        </Typography>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label={t('settings.enableNotifications')}
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box>
        <Typography variant="h6" gutterBottom>
          {t('settings.privacy')}
        </Typography>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label={t('settings.dataCollection')}
        />
        <FormControlLabel
          control={<Switch />}
          label={t('settings.shareAnalytics')}
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box>
        <Typography variant="h6" gutterBottom>
          {t('settings.theme')}
        </Typography>
        <FormControlLabel
          control={<Switch />}
          label={t('settings.darkMode')}
        />
      </Box>
    </Box>
  );
};