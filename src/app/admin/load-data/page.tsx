"use client";

import { Button, Alert, Stack, Text, Loader } from '@mantine/core';
import { useState } from 'react';
import { loadWorkoutData } from '../../../lib/migrations/loadWorkoutData';

export default function AdminLoadDataPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLoadData = async () => {
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      // Check if workouts.json exists
      const res = await fetch('/workouts.json');
      if (!res.ok) {
        setError('workouts.json file not found in /public. Please add it before loading data.');
        setLoading(false);
        return;
      }
      await loadWorkoutData();
      setSuccess('Workout data loaded successfully!');
    } catch (e: any) {
      setError(e.message || 'Error loading workout data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack align="center" justify="center" mt="xl">
      <Text size="xl" fw={700}>Admin: Load Workout Data</Text>
      <Button onClick={handleLoadData} loading={loading} disabled={loading} color="blue">
        Load Data
      </Button>
      {loading && <Loader />}
      {success && <Alert color="green">{success}</Alert>}
      {error && <Alert color="red">{error}</Alert>}
      <Text c="dimmed" size="sm" mt="md">
        This will import workouts from <b>/public/workouts.json</b> into Supabase. Make sure the file exists and is valid.
      </Text>
    </Stack>
  );
} 