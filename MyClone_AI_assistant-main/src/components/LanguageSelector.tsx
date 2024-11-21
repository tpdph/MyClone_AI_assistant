import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
  Box,
  Typography,
  IconButton,
  Popover,
  Paper,
  Tooltip,
} from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸', native: 'English' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', native: 'Español' },
  { code: 'fr', name: 'French', flag: '🇫🇷', native: 'Français' },
  { code: 'de', name: 'German', flag: '🇩🇪', native: 'Deutsch' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', native: 'Русский' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳', native: '中文' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', native: '日本語' }
];

const LanguageSelector: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? 'language-popover' : undefined;

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <div>
      <Tooltip title={t('common.language')} arrow>
        <IconButton
          onClick={handleClick}
          sx={{
            borderRadius: 2,
            p: 1,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LanguageIcon />
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {currentLanguage.flag} {currentLanguage.native}
            </Typography>
          </Box>
        </IconButton>
      </Tooltip>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1,
            overflow: 'hidden',
            width: 200,
          },
        }}
      >
        <Paper sx={{ maxHeight: 300, overflow: 'auto' }}>
          {languages.map((lang) => (
            <MenuItem
              key={lang.code}
              selected={i18n.language === lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              sx={{
                py: 1.5,
                px: 2,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  },
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>
                  {lang.flag}
                </Typography>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {lang.native}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {lang.name}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          ))}
        </Paper>
      </Popover>
    </div>
  );
};

export default LanguageSelector;
