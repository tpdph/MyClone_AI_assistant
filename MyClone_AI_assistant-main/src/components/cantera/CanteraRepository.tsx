import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Chip,
  Container,
  Button,
  CardActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
} from '@mui/material';
import { Play, Crown, Pause, Star, GitBranch, ExternalLink, Trash2, Folder } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BaseItem {
  id: string;
  category: 'default' | 'vip' | 'user';
}

interface VoiceItem extends BaseItem {
  previewUrl: string;
  language: string;
  gender: 'male' | 'female';
  imageUrl?: string;
}

interface Repository {
  id: string;
  name: string;
  description: string;
  stars: number;
  url: string;
}

interface LocalRepository {
  path: string;
  name: string;
  lastUpdated: string;
}

const defaultVoices: VoiceItem[] = [
  { 
    id: 'trump',
    category: 'vip',
    previewUrl: '/voices/vip/trump.mp3',
    language: 'en',
    gender: 'male',
    imageUrl: '/avatars/vip/trump.jpg'
  },
  { 
    id: 'freeman',
    category: 'vip',
    previewUrl: '/voices/vip/freeman.mp3',
    language: 'en',
    gender: 'male',
    imageUrl: '/avatars/vip/freeman.jpg'
  },
  { 
    id: 'jobs',
    category: 'vip',
    previewUrl: '/voices/vip/jobs.mp3',
    language: 'en',
    gender: 'male',
    imageUrl: '/avatars/vip/jobs.jpg'
  },
  { 
    id: 'garland',
    category: 'vip',
    previewUrl: '/voices/vip/garland.mp3',
    language: 'en',
    gender: 'female',
    imageUrl: '/avatars/vip/garland.jpg'
  },
  { 
    id: 'mairena',
    category: 'vip',
    previewUrl: '/voices/vip/mairena.mp3',
    language: 'es',
    gender: 'female',
    imageUrl: '/avatars/vip/mairena.jpg'
  },
  { 
    id: 'pantoja',
    category: 'vip',
    previewUrl: '/voices/vip/pantoja.mp3',
    language: 'es',
    gender: 'female',
    imageUrl: '/avatars/vip/pantoja.jpg'
  },
  { 
    id: 'natural-male-1',
    category: 'default',
    previewUrl: '/voices/natural-male-1.mp3',
    language: 'es',
    gender: 'male',
    imageUrl: '/images/personalities/male-1.jpg'
  },
  { 
    id: 'natural-female-1',
    category: 'default',
    previewUrl: '/voices/natural-female-1.mp3',
    language: 'es',
    gender: 'female',
    imageUrl: '/images/personalities/female-1.jpg'
  }
];

const repositories: Repository[] = [
  // Add your repositories here
];

const localRepos: LocalRepository[] = [
  // Add your local repositories here
];

const CanteraRepository: React.FC = () => {
  const { t } = useTranslation();
  const [selectedVoice, setSelectedVoice] = React.useState<string | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [voiceFilter, setVoiceFilter] = React.useState<{
    category: 'all' | 'vip' | 'default';
    gender: 'all' | 'male' | 'female';
  }>({
    category: 'all',
    gender: 'all'
  });
  const [isCloning, setIsCloning] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const filteredVoices = defaultVoices.filter(voice => {
    if (voiceFilter.category !== 'all' && voice.category !== voiceFilter.category) return false;
    if (voiceFilter.gender !== 'all' && voice.gender !== voiceFilter.gender) return false;
    return true;
  });

  const handlePlayVoice = (voiceId: string) => {
    if (selectedVoice === voiceId && isPlaying) {
      // Stop playing
      setIsPlaying(false);
    } else {
      // Start playing
      setSelectedVoice(voiceId);
      setIsPlaying(true);
    }
  };

  const handleClone = (repo: Repository) => {
    setIsCloning(true);
    // Add your cloning logic here
    setIsCloning(false);
  };

  const handleDelete = (path: string) => {
    // Add your deletion logic here
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {t('cantera.title')}
        </Typography>
        <Typography variant="body1" paragraph>
          {t('cantera.description')}
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            {t('cantera.repositories')}
          </Typography>
          <Grid container spacing={3}>
            {repositories.map((repo) => (
              <Grid item xs={12} sm={6} md={4} key={repo.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {repo.name}
                    </Typography>
                    <Typography color="text.secondary" paragraph>
                      {repo.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Star size={16} />
                      <Typography variant="body2">
                        {repo.stars} {t('cantera.stars')}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      startIcon={<GitBranch />}
                      onClick={() => handleClone(repo)}
                      disabled={isCloning}
                    >
                      {isCloning ? t('cantera.cloning') : t('cantera.clone')}
                    </Button>
                    <Button
                      startIcon={<ExternalLink />}
                      onClick={() => window.open(repo.url, '_blank')}
                    >
                      {t('cantera.viewOnGithub')}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            {t('cantera.localRepositories')}
          </Typography>
          <List>
            {localRepos.map((repo) => (
              <ListItem
                key={repo.path}
                secondaryAction={
                  <IconButton edge="end" onClick={() => handleDelete(repo.path)}>
                    <Trash2 />
                  </IconButton>
                }
              >
                <ListItemIcon>
                  <Folder />
                </ListItemIcon>
                <ListItemText
                  primary={repo.name}
                  secondary={t('cantera.lastUpdated', { date: repo.lastUpdated })}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default CanteraRepository;
