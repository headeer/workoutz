import { Paper, Text, Group, Stack, ThemeIcon, Button, Transition } from '@mantine/core';
import { IconBulb, IconTrophy, IconFlame, IconHeartFilled, IconTarget } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import type { MotivationalTip } from '../lib/progress';

interface MotivationalTipsProps {
  tips: MotivationalTip[];
  onActionClick?: (action: string) => void;
}

const getIconForTipType = (type: MotivationalTip['type']) => {
  switch (type) {
    case 'encouragement':
      return <IconBulb size={20} />;
    case 'milestone':
      return <IconTrophy size={20} />;
    case 'streak':
      return <IconFlame size={20} />;
    case 'recovery':
      return <IconHeartFilled size={20} />;
    case 'challenge':
      return <IconTarget size={20} />;
  }
};

const getColorForTipType = (type: MotivationalTip['type']) => {
  switch (type) {
    case 'encouragement':
      return 'yellow';
    case 'milestone':
      return 'blue';
    case 'streak':
      return 'red';
    case 'recovery':
      return 'green';
    case 'challenge':
      return 'grape';
  }
};

export function MotivationalTips({ tips, onActionClick }: MotivationalTipsProps) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (tips.length > 1) {
      const interval = setInterval(() => {
        setIsVisible(false);
        setTimeout(() => {
          setCurrentTipIndex((current) => (current + 1) % tips.length);
          setIsVisible(true);
        }, 300);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [tips.length]);

  if (tips.length === 0) return null;

  const currentTip = tips[currentTipIndex];

  return (
    <Transition mounted={isVisible} transition="fade" duration={300}>
      {(styles) => (
        <Paper 
          shadow="sm" 
          p="md" 
          radius="md" 
          withBorder
          style={{
            ...styles,
            backgroundColor: `var(--mantine-color-${getColorForTipType(currentTip.type)}-0)`,
            borderColor: `var(--mantine-color-${getColorForTipType(currentTip.type)}-3)`
          }}
        >
          <Stack gap="md">
            <Group>
              <ThemeIcon 
                size="lg" 
                radius="md" 
                color={getColorForTipType(currentTip.type)}
                variant="light"
              >
                {getIconForTipType(currentTip.type)}
              </ThemeIcon>
              <Text fw={500} size="lg">
                {currentTip.message}
              </Text>
            </Group>
            {currentTip.action && (
              <Button
                variant="light"
                color={getColorForTipType(currentTip.type)}
                onClick={() => onActionClick?.(currentTip.action!)}
                fullWidth
              >
                {currentTip.action}
              </Button>
            )}
            {tips.length > 1 && (
              <Group justify="center" gap="xs">
                {tips.map((_, index) => (
                  <div
                    key={index}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: index === currentTipIndex
                        ? `var(--mantine-color-${getColorForTipType(currentTip.type)}-6)`
                        : 'var(--mantine-color-gray-3)',
                      transition: 'background-color 0.2s ease'
                    }}
                  />
                ))}
              </Group>
            )}
          </Stack>
        </Paper>
      )}
    </Transition>
  );
} 