import React, { useState, useEffect } from 'react';
import { MantineProvider, Container, Title, Tabs, Stack, Group, Button } from '@mantine/core';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { WorkoutList } from './components/WorkoutList';
import { UserPoints } from './components/UserPoints';
import { Summary } from './components/Summary';
import { IconBarbell, IconChartBar } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { WorkoutDay } from './types';

type UserId = 'tomasz' | 'piotrek';

interface UserPointsState {
  tomasz: number;
  piotrek: number;
}

function PiotrWorkouts({ workouts, onExerciseComplete }: { workouts: WorkoutDay[]; onExerciseComplete: (userId: UserId, points: number) => void }) {
  const getCurrentDayTab = () => {
    const dayMap: { [key: string]: string } = {
      1: 'poniedzialek',
      2: 'wtorek',
      4: 'czwartek',
      5: 'piatek',
      6: 'sobota'
    };
    const currentDay = dayjs().day();
    return dayMap[currentDay] || 'poniedzialek';
  };

  return (
    <Tabs defaultValue={getCurrentDayTab()} mb="xl">
      <Tabs.List grow>
        <Tabs.Tab value="poniedzialek" color="blue">Poniedziałek</Tabs.Tab>
        <Tabs.Tab value="wtorek" color="green">Wtorek</Tabs.Tab>
        <Tabs.Tab value="czwartek" color="grape">Czwartek</Tabs.Tab>
        <Tabs.Tab value="piatek" color="orange">Piątek</Tabs.Tab>
        <Tabs.Tab value="sobota" color="red">Sobota</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="poniedzialek" pt="md">
        <WorkoutList 
          trainingId={1} 
          workouts={workouts} 
          onExerciseComplete={onExerciseComplete} 
        />
      </Tabs.Panel>
      <Tabs.Panel value="wtorek" pt="md">
        <WorkoutList 
          trainingId={2} 
          workouts={workouts} 
          onExerciseComplete={onExerciseComplete} 
        />
      </Tabs.Panel>
      <Tabs.Panel value="czwartek" pt="md">
        <WorkoutList 
          trainingId={3} 
          workouts={workouts} 
          onExerciseComplete={onExerciseComplete} 
        />
      </Tabs.Panel>
      <Tabs.Panel value="piatek" pt="md">
        <WorkoutList 
          trainingId={4} 
          workouts={workouts} 
          onExerciseComplete={onExerciseComplete} 
        />
      </Tabs.Panel>
      <Tabs.Panel value="sobota" pt="md">
        <WorkoutList 
          trainingId={5} 
          workouts={workouts} 
          onExerciseComplete={onExerciseComplete} 
        />
      </Tabs.Panel>
    </Tabs>
  );
}

function TomekWorkouts({ workouts, onExerciseComplete }: { workouts: WorkoutDay[]; onExerciseComplete: (userId: UserId, points: number) => void }) {
  return (
    <Tabs defaultValue="day1" mb="xl">
      <Tabs.List grow>
        <Tabs.Tab value="day1" color="blue">Back & Biceps</Tabs.Tab>
        <Tabs.Tab value="day2" color="green">Chest & Triceps</Tabs.Tab>
        <Tabs.Tab value="day3" color="grape">Legs</Tabs.Tab>
        <Tabs.Tab value="day4" color="orange">Shoulders & Abs</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="day1" pt="md">
        <WorkoutList 
          trainingId={6} 
          workouts={workouts} 
          onExerciseComplete={onExerciseComplete} 
        />
      </Tabs.Panel>
      <Tabs.Panel value="day2" pt="md">
        <WorkoutList 
          trainingId={7} 
          workouts={workouts} 
          onExerciseComplete={onExerciseComplete} 
        />
      </Tabs.Panel>
      <Tabs.Panel value="day3" pt="md">
        <WorkoutList 
          trainingId={8} 
          workouts={workouts} 
          onExerciseComplete={onExerciseComplete} 
        />
      </Tabs.Panel>
      <Tabs.Panel value="day4" pt="md">
        <WorkoutList 
          trainingId={9} 
          workouts={workouts} 
          onExerciseComplete={onExerciseComplete} 
        />
      </Tabs.Panel>
    </Tabs>
  );
}

function Navigation() {
  const location = useLocation();
  
  return (
    <Group position="center" spacing="xl" mb="xl">
      <Button
        component={Link}
        to="/piotr"
        variant={location.pathname === '/piotr' ? 'filled' : 'light'}
        color="blue"
        size="md"
        leftIcon={<IconBarbell size={16} />}
      >
        Piotr's Workouts
      </Button>
      <Button
        component={Link}
        to="/tomek"
        variant={location.pathname === '/tomek' ? 'filled' : 'light'}
        color="green"
        size="md"
        leftIcon={<IconBarbell size={16} />}
      >
        Tomasz's Workouts
      </Button>
      <Button
        component={Link}
        to="/summary"
        variant={location.pathname === '/summary' ? 'filled' : 'light'}
        color="grape"
        size="md"
        leftIcon={<IconChartBar size={16} />}
      >
        Training Summary
      </Button>
    </Group>
  );
}

function App() {
  const [workouts, setWorkouts] = useState<WorkoutDay[]>([]);
  const [userPoints, setUserPoints] = useState<UserPointsState>({
    tomasz: 0,
    piotrek: 0
  });
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/workouts')
      .then(response => response.json())
      .then(data => setWorkouts(data));

    fetch('http://localhost:3000/userProgress')
      .then(response => response.json())
      .then(data => {
        setUserPoints({
          tomasz: data.tomasz.totalPoints,
          piotrek: data.piotrek.totalPoints
        });
      });
  }, []);

  const handleExerciseComplete = async (userId: UserId, points: number) => {
    // Update local state
    const newPoints = userPoints[userId] + points;
    setUserPoints(prev => ({
      ...prev,
      [userId]: newPoints
    }));
    
    // Only show confetti for section completion (25 points) or workout completion (50 points)
    if (points >= 25) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }

    // Save points to server
    try {
      const response = await fetch('http://localhost:3000/userProgress', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [userId]: {
            totalPoints: newPoints,
            completedExercises: userPoints[userId] / 5, // Each exercise is worth 5 points
            completedDays: Math.floor(newPoints / 25), // Each day is worth 25 points
            completedWeeks: Math.floor(newPoints / 100) // Each week is worth 100 points
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save points');
      }
    } catch (error) {
      console.error('Error saving points:', error);
      // Revert local state if server update fails
      setUserPoints(prev => ({
        ...prev,
        [userId]: prev[userId] - points
      }));
    }
  };

  return (
    <BrowserRouter>
      <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: 'light' }}>
        <Container size="lg" py={20}>
          <Title order={1} align="center" mb={20}>
            Plan Treningowy 💪
          </Title>
          
          <Navigation />

          <Stack spacing="xl">
            <Group position="apart" grow>
              <UserPoints 
                username="Tomasz" 
                points={userPoints.tomasz} 
                showConfetti={showConfetti} 
              />
              <UserPoints 
                username="Piotrek" 
                points={userPoints.piotrek} 
                showConfetti={showConfetti} 
              />
            </Group>

            <Routes>
              <Route path="/" element={<Navigate to="/piotr" replace />} />
              <Route path="/piotr" element={<PiotrWorkouts workouts={workouts} onExerciseComplete={handleExerciseComplete} />} />
              <Route path="/tomek" element={<TomekWorkouts workouts={workouts} onExerciseComplete={handleExerciseComplete} />} />
              <Route path="/summary" element={<Summary />} />
            </Routes>
          </Stack>
        </Container>
      </MantineProvider>
    </BrowserRouter>
  );
}

export default App;
