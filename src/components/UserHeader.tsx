import { Group, Title, Badge, Stack, Text, ThemeIcon, Paper } from '@mantine/core';
import { IconTrophy, IconFlame, IconStar } from '@tabler/icons-react';
import { useLanguage } from '../lib/LanguageContext';

interface UserHeaderProps {
  name: string;
  total_points: number;
  level: number;
  streakDays: number;
}

export function UserHeader({ name, total_points, level, streakDays }: UserHeaderProps) {
  const { t } = useLanguage();

  return (
    <Paper shadow="sm" p="md" radius="md" withBorder mb="lg">
      <Group justify="space-between" align="center">
        <Title order={2}>{name}{t('common.progress')}</Title>
        <Group gap="md">
          <Stack gap={0} align="center">
            <Group gap="xs">
              <ThemeIcon size="sm" color="yellow" variant="light">
                <IconStar size={14} />
              </ThemeIcon>
              <Text size="sm" fw={500}>{total_points}</Text>
            </Group>
            <Text size="xs" c="dimmed">{t('common.points')}</Text>
          </Stack>

          <Stack gap={0} align="center">
            <Group gap="xs">
              <ThemeIcon size="sm" color="blue" variant="light">
                <IconTrophy size={14} />
              </ThemeIcon>
              <Text size="sm" fw={500}>{level}</Text>
            </Group>
            <Text size="xs" c="dimmed">{t('common.level')}</Text>
          </Stack>

          <Stack gap={0} align="center">
            <Group gap="xs">
              <ThemeIcon size="sm" color="red" variant="light">
                <IconFlame size={14} />
              </ThemeIcon>
              <Text size="sm" fw={500}>{streakDays}</Text>
            </Group>
            <Text size="xs" c="dimmed">{t('common.dayStreak')}</Text>
          </Stack>
        </Group>
      </Group>
    </Paper>
  );
} 