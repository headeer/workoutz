'use client';

import { Group, Button } from '@mantine/core';
import { IconBarbell, IconChartBar } from '@tabler/icons-react';
import Link from 'next/link';
import { useLanguage } from '../src/lib/LanguageContext';
import { LanguageSwitcher } from '../src/components/LanguageSwitcher';

export function Navigation() {
  const { t } = useLanguage();

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