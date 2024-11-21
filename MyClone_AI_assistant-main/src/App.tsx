import React from 'react';
import { Brain, MessageSquare, Settings as SettingsIcon, User2, Mic2, Archive, Database, Bot, Settings2 } from 'lucide-react';
import { ChatInterface } from './components/ChatInterface';
import { KnowledgeBase } from './components/KnowledgeBase';
import Settings from './components/Settings';
import CanteraRepository from './components/cantera/CanteraRepository';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container, IconButton, Tooltip } from '@mui/material';
import theme from './theme';
import './i18n';
import LanguageSelector from './components/LanguageSelector';
import AssistantCreation from './components/assistant/AssistantCreation';
import VoiceTraining from './components/voice/VoiceTraining';
import AvatarTraining from './components/avatar/AvatarTraining';
import { useTranslation } from 'react-i18next';

function App() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = React.useState<'chat' | 'knowledge' | 'assistant' | 'shape' | 'voice' | 'cantera' | 'settings'>('chat');

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatInterface />;
      case 'knowledge':
        return <KnowledgeBase />;
      case 'assistant':
        return <AssistantCreation onNavigate={(tab) => setActiveTab(tab)} />;
      case 'shape':
        return <AvatarTraining />;
      case 'voice':
        return <VoiceTraining />;
      case 'cantera':
        return <CanteraRepository />;
      case 'settings':
        return <Settings />;
      default:
        return <ChatInterface />;
    }
  };

  const tabs = [
    { id: 'chat', icon: <MessageSquare />, label: t('nav.chat') },
    { id: 'knowledge', icon: <Database />, label: t('nav.knowledge') },
    { id: 'assistant', icon: <Bot />, label: t('nav.assistant') },
    { id: 'cantera', icon: <Archive />, label: t('nav.cantera') },
    { id: 'settings', icon: <Settings2 />, label: t('nav.settings') }
  ];

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth={false} disableGutters>
          <Box sx={{ height: '100vh', bgcolor: 'background.default' }}>
            <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1200 }}>
              <LanguageSelector />
            </Box>
            <Box sx={{ display: 'flex', height: '100%' }}>
              {/* Sidebar */}
              <Box sx={{ 
                width: 64, 
                bgcolor: 'grey.900',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                py: 2,
                gap: 2
              }}>
                {tabs.map((tab) => (
                  <Tooltip key={tab.id} title={tab.label} placement="right">
                    <IconButton
                      sx={{
                        color: activeTab === tab.id ? 'primary.main' : 'grey.300',
                        '&:hover': {
                          color: 'primary.light',
                          backgroundColor: 'rgba(255, 255, 255, 0.08)'
                        },
                        transition: 'color 0.2s ease-in-out'
                      }}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.icon}
                    </IconButton>
                  </Tooltip>
                ))}
              </Box>

              {/* Main Content */}
              <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                {renderContent()}
              </Box>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;