'use client';

import { Container, Title, Group, Button } from '@mantine/core';
import { IconBarbell, IconChartBar } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Home() {
  const pathname = usePathname();

  return (
    <Container size="lg" py="xl">
      <Title ta="center" mb="xl">Training Plan App</Title>
      
      <Group justify="center" gap="xl" mb="xl">
        <Button
          component={Link}
          href="/piotr"
          variant={pathname === '/piotr' ? 'filled' : 'light'}
          color="blue"
          size="md"
          leftSection={<IconBarbell size={16} />}
        >
          Piotr's Workouts
        </Button>
        <Button
          component={Link}
          href="/tomek"
          variant={pathname === '/tomek' ? 'filled' : 'light'}
          color="green"
          size="md"
          leftSection={<IconBarbell size={16} />}
        >
          Tomasz's Workouts
        </Button>
        <Button
          component={Link}
          href="/summary"
          variant={pathname === '/summary' ? 'filled' : 'light'}
          color="grape"
          size="md"
          leftSection={<IconChartBar size={16} />}
        >
          Training Summary
        </Button>
      </Group>
    </Container>
  );
} 