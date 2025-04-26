import { UnstyledButton, Group, Text, Box } from '@mantine/core';
import { useLanguage } from '@/lib/LanguageContext';
import { Language } from '@/lib/translations';
import { IconCheck } from '@tabler/icons-react';
import classes from './LanguageSwitcher.module.css';

const LANGUAGES = {
  en: {
    name: 'English',
    flag: '🇬🇧',
    code: 'en'
  },
  pl: {
    name: 'Polski',
    flag: '🇵🇱',
    code: 'pl'
  }
} as const;

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <Group gap="sm">
      {Object.values(LANGUAGES).map((lang) => (
        <UnstyledButton
          key={lang.code}
          onClick={() => setLanguage(lang.code as Language)}
          className={classes.languageButton}
          data-active={language === lang.code || undefined}
        >
          <Group gap="xs" wrap="nowrap">
            <Box className={classes.flag}>
              {lang.flag}
            </Box>
            <Box>
              <Text size="sm" fw={500}>
                {lang.name}
              </Text>
            </Box>
            {language === lang.code && (
              <Box className={classes.checkIcon}>
                <IconCheck size={14} />
              </Box>
            )}
          </Group>
        </UnstyledButton>
      ))}
    </Group>
  );
} 