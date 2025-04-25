import React, { useEffect, useState } from 'react';
import { Container, Title, Text, Card, Group, Stack, Progress, Badge, Divider, ThemeIcon } from '@mantine/core';
import { IconTrendingUp, IconFlame, IconClock, IconTarget } from '@tabler/icons-react';

interface UserProgress {
  totalPoints: number;
  completedExercises: number;
  completedDays: number;
  completedWeeks: number;
  lastWorkoutDate?: string;
  favoriteExercises?: string[];
  personalRecords?: {
    exercise: string;
    weight?: number;
    reps?: number;
    date: string;
  }[];
}

interface Workout {
  id: number;
  name: string;
  sections: {
    name: string;
    exercises: {
      name: string;
      isCompleted: boolean;
      sets?: number;
      reps?: string;
    }[];
  }[];
}

export function Summary() {
  const [userProgress, setUserProgress] = useState<{ tomasz: UserProgress; piotrek: UserProgress }>({
    tomasz: { totalPoints: 0, completedExercises: 0, completedDays: 0, completedWeeks: 0 },
    piotrek: { totalPoints: 0, completedExercises: 0, completedDays: 0, completedWeeks: 0 }
  });
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progressRes, workoutsRes] = await Promise.all([
          fetch('http://localhost:3000/userProgress'),
          fetch('http://localhost:3000/workouts')
        ]);

        const progressData = await progressRes.json();
        const workoutsData = await workoutsRes.json();

        setUserProgress(progressData);
        setWorkouts(workoutsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateConsistency = (user: 'tomasz' | 'piotrek') => {
    const totalWorkouts = workouts.filter(w => w.id >= 6 && w.id <= 9).length; // Assuming 4 workouts per week
    const completedWorkouts = userProgress[user].completedDays;
    return (completedWorkouts / totalWorkouts) * 100;
  };

  const getProgressInsights = (user: 'tomasz' | 'piotrek') => {
    const progress = userProgress[user];
    const insights: string[] = [];

    // Basic achievements
    if (progress.completedWeeks > 0) {
      insights.push(`Completed ${progress.completedWeeks} full weeks of training`);
    }

    if (progress.completedExercises > 0) {
      insights.push(`Mastered ${progress.completedExercises} different exercises`);
    }

    if (progress.totalPoints > 0) {
      insights.push(`Earned ${progress.totalPoints} achievement points`);
    }

    // Milestone achievements
    if (progress.completedWeeks >= 4) {
      insights.push("Reached the 1-month training milestone! 🎉");
    }
    if (progress.completedWeeks >= 12) {
      insights.push("Completed 3 months of consistent training! 💪");
    }
    if (progress.completedExercises >= 20) {
      insights.push("Mastered 20+ different exercises! 🏋️‍♂️");
    }

    return insights;
  };

  const getNextSteps = (user: 'tomasz' | 'piotrek') => {
    const progress = userProgress[user];
    const steps: string[] = [];

    if (progress.completedWeeks === 0) {
      steps.push("Focus on learning proper form for each exercise");
      steps.push("Aim to complete at least 2 workouts per week");
      steps.push("Start tracking your weights and reps");
    } else if (progress.completedWeeks < 4) {
      steps.push("Increase workout frequency to 3-4 times per week");
      steps.push("Focus on progressive overload");
      steps.push("Track your rest periods between sets");
    } else {
      steps.push("Consider adding advanced techniques");
      steps.push("Focus on mind-muscle connection");
      steps.push("Optimize your nutrition and recovery");
    }

    return steps;
  };

  const getPersonalTrainerNote = (user: 'tomasz' | 'piotrek') => {
    const progress = userProgress[user];
    const consistency = calculateConsistency(user);

    if (progress.completedWeeks === 0) {
      return "Welcome to your fitness journey! Focus on building a solid foundation with proper form and consistency.";
    } else if (progress.completedWeeks < 4) {
      if (consistency >= 80) {
        return "Excellent start! Your consistency is impressive. Keep focusing on form and gradually increasing intensity.";
      } else {
        return "Good progress! Try to maintain a more consistent schedule to see better results.";
      }
    } else if (progress.completedWeeks < 8) {
      if (consistency >= 80) {
        return "Outstanding dedication! You're ready to start pushing your limits with progressive overload.";
      } else {
        return "You're making good progress! Focus on maintaining your workout schedule for optimal results.";
      }
    } else {
      if (consistency >= 80) {
        return "Exceptional commitment! Consider setting new goals and challenging yourself with advanced techniques.";
      } else {
        return "Great job so far! Try to increase your consistency to maximize your progress.";
      }
    }
  };

  if (loading) {
    return <Text>Loading summary...</Text>;
  }

  return (
    <Container size="lg" py="xl">
      <Title order={1} ta="center" mb="xl">Training Summary</Title>

      <Stack gap="md">
        <Group justify="center" mb="md">
          {(['tomasz', 'piotrek'] as const).map((user) => (
            <Card key={user} shadow="sm" p="lg" radius="md" withBorder>
              <Stack gap="md">
                <Group justify="flex-start">
                  <ThemeIcon size="lg" radius="md" variant="light">
                    <IconTrendingUp size={20} />
                  </ThemeIcon>
                  <Text size="lg" fw={500}>
                    Consistency Score
                  </Text>
                </Group>
                <Progress
                  value={calculateConsistency(user)}
                  size="xl"
                  radius="xl"
                >
                  {`${Math.round(calculateConsistency(user))}%`}
                </Progress>

                <Divider />

                <Text size="lg" fw={500}>
                  Progress Insights
                </Text>

                <Stack gap="md">
                  {getProgressInsights(user).map((insight, index) => (
                    <Text key={index} c="dimmed">
                      • {insight}
                    </Text>
                  ))}
                </Stack>
              </Stack>
            </Card>
          ))}
        </Group>

        <Stack gap="md">
          <Text size="lg" fw={700}>Progress Insights</Text>
          {getProgressInsights('tomasz').map((insight, index) => (
            <Text key={index} color="dimmed">
              • {insight}
            </Text>
          ))}
        </Stack>

        <Text size="lg" fw={700}>Progress Overview</Text>

        <Stack gap="md">
          <Group justify="flex-start">
            <ThemeIcon size="lg" radius="md" variant="light">
              <IconTrendingUp size={20} />
            </ThemeIcon>
            <Text size="lg" fw={500}>
              Consistency Score
            </Text>
          </Group>
          <Progress
            value={calculateConsistency('tomasz')}
            size="xl"
            radius="xl"
          >
            {`${Math.round(calculateConsistency('tomasz'))}%`}
          </Progress>
        </Stack>

        <Text size="lg" fw={700}>Achievements</Text>

        <Stack gap="md">
          {getProgressInsights('tomasz').map((insight, index) => (
            <Text key={index} color="dimmed">
              • {insight}
            </Text>
          ))}
        </Stack>
      </Stack>
    </Container>
  );
} 