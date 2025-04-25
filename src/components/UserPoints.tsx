import React, { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';
import confetti from 'canvas-confetti';
import { Text, Group, Badge, Box } from '@mantine/core';

interface UserPointsProps {
  username: string;
  points: number;
  showConfetti?: boolean;
}

export function UserPoints({ username, points, showConfetti = false }: UserPointsProps) {
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [showConfettiAnimation, setShowConfettiAnimation] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (showConfetti) {
      setShowConfettiAnimation(true);
      // Trigger confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Hide confetti after 3 seconds
      const timer = setTimeout(() => {
        setShowConfettiAnimation(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  return (
    <Box>
      {showConfettiAnimation && (
        <ReactConfetti
          width={dimensions.width}
          height={dimensions.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}
      <Group justify="space-between" align="center" gap="xs">
        <Text c="dark" size="lg" fw={700}>
          {username}
        </Text>
        <Badge
          size="xl"
          variant="gradient"
          gradient={{ from: 'teal', to: 'blue', deg: 60 }}
          style={{ padding: '0.5rem 1rem' }}
        >
          {points} pts
        </Badge>
      </Group>
    </Box>
  );
} 