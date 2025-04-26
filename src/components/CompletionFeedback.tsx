import { Modal, Stack, Text, Group, ThemeIcon, Badge, Paper, Button, RingProgress, Center } from '@mantine/core';
import { IconTrophy, IconStar, IconConfetti, IconFlame } from '@tabler/icons-react';
import { useLanguage } from '../lib/LanguageContext';
import { notifications } from '@mantine/notifications';
import { useEffect } from 'react';

interface CompletionFeedbackProps {
  isOpen: boolean;
  onClose: () => void;
  points: number;
  streakBonus?: number;
  achievements?: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
  }>;
}

export function CompletionFeedback({ isOpen, onClose, points, streakBonus = 0, achievements = [] }: CompletionFeedbackProps) {
  const { t } = useLanguage();

  useEffect(() => {
    if (isOpen && achievements.length > 0) {
      achievements.forEach(achievement => {
        notifications.show({
          title: t('achievements.unlocked'),
          message: achievement.name,
          color: 'yellow',
          icon: <IconTrophy size={20} />,
          autoClose: 5000,
        });
      });
    }
  }, [isOpen, achievements, t]);

  const formatMessage = (template: string, values: Record<string, string | number>) => {
    return template.replace(/{(\w+)}/g, (match, key) => String(values[key] || match));
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={t('workouts.exerciseCompleted')}
      size="sm"
      centered
      withCloseButton={false}
    >
      <Stack gap="lg">
        <Center>
          <ThemeIcon size={80} radius={40} color="green" variant="light">
            <IconConfetti size={40} />
          </ThemeIcon>
        </Center>

        <Stack gap="xs" align="center">
          <Text size="xl" fw={700} ta="center">
            {formatMessage(t('workouts.pointsEarned'), { points })}
          </Text>
          {streakBonus > 0 && (
            <Group gap="xs">
              <IconFlame size={16} style={{ color: 'var(--mantine-color-red-6)' }} />
              <Text size="sm" c="dimmed">
                {formatMessage(t('workouts.streakBonus'), { bonus: streakBonus })}
              </Text>
            </Group>
          )}
        </Stack>

        {achievements.length > 0 && (
          <Stack gap="md">
            <Text fw={500} ta="center">{t('achievements.newUnlocked')}</Text>
            {achievements.map((achievement) => (
              <Paper key={achievement.id} p="md" radius="md" withBorder>
                <Group>
                  <ThemeIcon
                    size="xl"
                    radius="md"
                    variant="light"
                    color="yellow"
                  >
                    {achievement.icon === 'trophy' ? (
                      <IconTrophy size={24} />
                    ) : (
                      <IconStar size={24} />
                    )}
                  </ThemeIcon>
                  <Stack gap={4}>
                    <Text fw={500}>{achievement.name}</Text>
                    <Text size="sm" c="dimmed">{achievement.description}</Text>
                    <Badge color="yellow" variant="light" mt={4}>
                      {t('achievements.unlocked')}
                    </Badge>
                  </Stack>
                </Group>
              </Paper>
            ))}
          </Stack>
        )}

        <Button onClick={onClose} fullWidth mt="md">
          {t('common.continue')}
        </Button>
      </Stack>
    </Modal>
  );
} 