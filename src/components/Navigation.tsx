'use client';

import { Group, Button } from '@mantine/core';
import { IconBarbell, IconChartBar } from '@tabler/icons-react';
import Link from 'next/link';
import { useLanguage } from '../lib/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useEffect, useState } from 'react';
import { getUserProgress } from '../pages/api/userProgress';

export function Navigation() {
  const { t } = useLanguage();
  const [piotrekPoints, setPiotrekPoints] = useState<number>(0);
  const [tomekPoints, setTomekPoints] = useState<number>(0);

  useEffect(() => {
    getUserProgress('piotrek').then((data) => setPiotrekPoints(data?.total_points || 0));
    getUserProgress('tomasz').then((data) => setTomekPoints(data?.total_points || 0));
  }, []);

  return (
    <>
      <Group justify="space-between" mb="xl">
        <h1 style={{ textAlign: 'center' }}>
          {t('common.appTitle')}
        </h1>
        <LanguageSwitcher />
      </Group>
      <Group justify="center" gap="xl" wrap="wrap" mb="xl">
        <Link href="/piotr" passHref>
          <Button
            variant="light"
            color="blue"
            size="md"
            leftSection={<IconBarbell size={16} />}
            rightSection={<span style={{ marginLeft: 8, fontWeight: 600, color: '#845ef7' }}>{piotrekPoints} pts</span>}
          >
            {t('workouts.piotr')}
          </Button>
        </Link>
        <Link href="/tomek" passHref>
          <Button
            variant="light"
            color="green"
            size="md"
            leftSection={<IconBarbell size={16} />}
            rightSection={<span style={{ marginLeft: 8, fontWeight: 600, color: '#40c057' }}>{tomekPoints} pts</span>}
          >
            {t('workouts.tomek')}
          </Button>
        </Link>
        <Link href="/summary" passHref>
          <Button
            variant="light"
            color="grape"
            size="md"
            leftSection={<IconChartBar size={16} />}
          >
            {t('stats.title')}
          </Button>
        </Link>
      </Group>
    </>
  );
}