import { Paper, Text, Group, Stack, Progress, Badge, ThemeIcon, Grid, Card, RingProgress, ActionIcon, Tooltip, Transition, Box, Button } from '@mantine/core';
import { IconBarbell, IconFlame, IconTrophy, IconMedal, IconStar, IconStarFilled, IconHeartFilled, IconChartBar, IconInfoCircle, IconTrendingUp, IconCheck, IconRefresh } from '@tabler/icons-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MotivationalTips } from './MotivationalTips';
import { getMotivationalTip } from '../lib/progress';
import type { WorkoutStats } from '../lib/progress';
import { useLanguage } from '../lib/LanguageContext';
import type { translations } from '../lib/translations';

interface TrainingSummaryProps {
  userId: string;
  userProgress: {
    total_points: number;
    completed_exercises: number;
    completed_days: number;
    completed_weeks: number;
    streak_days: number;
    total_workouts: number;
  };
  rewards: {
    current_level: number;
    points_to_next_level: number;
    achievements: Array<{
      id: string;
      name: string;
      description: string;
      icon: string;
      achieved: boolean;
    }>;
  };
  weeklyProgress: {
    completed_workouts: number;
    total_workouts: number;
    days: Array<{
      day: string;
      completed: boolean;
      planned: boolean;
    }>;
  };
  onRestartTraining?: () => void;
  onResetDay?: (day: string) => void;
}

export function TrainingSummary({ userId, userProgress, rewards, weeklyProgress, onRestartTraining, onResetDay }: TrainingSummaryProps) {
  const [hoveredAchievement, setHoveredAchievement] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const router = useRouter();
  const { t } = useLanguage();

  const calculateLevelProgress = () => {
    const pointsPerLevel = 1000;
    const currentPoints = userProgress.total_points % pointsPerLevel;
    return (currentPoints / pointsPerLevel) * 100;
  };

  // Calculate workout stats for motivational tips
  const workoutStats: WorkoutStats = {
    lastWorkoutDate: null,
    weeklyWorkouts: weeklyProgress.completed_workouts,
    monthlyWorkouts: userProgress.completed_days,
    preferredDays: weeklyProgress.days
      .filter(day => day.planned)
      .map(day => day.day),
    averageExercisesPerWorkout: Math.round(userProgress.completed_exercises / userProgress.total_workouts) || 0,
    favoriteExercises: [],
    personalBests: []
  };

  const motivationalTips = getMotivationalTip(workoutStats);

  const handleTipAction = (action: string) => {
    const workoutPath = userId === 'piotrek' ? '/piotr' : '/tomek';
    
    switch (action) {
      case t('motivational.firstWorkout.action'):
      case t('motivational.streak.action'):
        router.push(workoutPath);
        break;
      case t('motivational.workoutComplete.action'):
        router.push(workoutPath);
        break;
      case t('motivational.recovery.action'):
        router.push(`${workoutPath}?type=mobility`);
        break;
      case t('motivational.milestone.action'):
        router.push(`${workoutPath}?type=strength`);
        break;
      case t('motivational.personalBest.action'):
        router.push('/summary');
        break;
      default:
        console.log('Unhandled action:', action);
    }
  };

  const statCards = [
    {
      id: 'points',
      title: t('stats.totalPoints'),
      value: userProgress.total_points,
      icon: <IconStar size={24} />,
      color: 'yellow',
      progress: calculateLevelProgress(),
      subtitle: `${rewards.points_to_next_level} ${t('stats.nextLevel')}`
    },
    {
      id: 'streak',
      title: t('stats.streak'),
      value: `${userProgress.streak_days} ${t('stats.days')}`,
      icon: <IconFlame size={24} />,
      color: 'red',
      subtitle: t('common.keepGoing')
    },
    {
      id: 'level',
      title: t('common.level'),
      value: rewards.current_level,
      icon: <IconTrophy size={24} />,
      color: 'blue',
      subtitle: t('stats.masterLevel').replace('{0}', rewards.current_level.toString())
    },
    {
      id: 'completion',
      title: t('stats.completionRate'),
      value: `${userProgress.total_workouts > 0 
        ? Math.min(100, Math.round((userProgress.completed_exercises / Math.max(1, userProgress.total_workouts * 5)) * 100))
        : 0}%`,
      icon: <IconChartBar size={24} />,
      color: 'green',
      subtitle: t('stats.exercisesCompleted').replace('{0}', userProgress.completed_exercises.toString())
    }
  ];

  const getDayTranslation = (day: string) => {
    const dayMap: Record<string, keyof typeof translations['en']['common']['days']> = {
      'Mon': 'mon',
      'Tue': 'tue',
      'Wed': 'wed',
      'Thu': 'thu',
      'Fri': 'fri',
      'Sat': 'sat',
      'Sun': 'sun'
    };
    return t(`common.days.${String(dayMap[day])}`);
  };

  return (
    <Stack gap="lg">
      <MotivationalTips tips={motivationalTips} onActionClick={handleTipAction} />
      
      <Grid>
        {statCards.map((card) => (
          <Grid.Col key={card.id} span={{ base: 12, sm: 6, md: 3 }}>
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer',
                transform: expandedCard === card.id ? 'scale(1.02)' : 'scale(1)',
                boxShadow: expandedCard === card.id ? '0 8px 16px rgba(0,0,0,0.1)' : undefined
              }}
              onClick={() => setExpandedCard(expandedCard === card.id ? null : card.id)}
            >
              <Group justify="space-between" align="flex-start">
                <div>
                  <Text size="xs" c="dimmed">{card.title}</Text>
                  <Text size="xl" fw={700}>{card.value}</Text>
                </div>
                <ThemeIcon size="xl" radius="md" variant="light" color={card.color}>
                  {card.icon}
                </ThemeIcon>
              </Group>
              {card.progress !== undefined && (
                <>
                  <Progress
                    value={card.progress}
                    mt="md"
                    size="sm"
                    color={card.color}
                    animated
                  />
                  <Text size="xs" ta="center" mt="xs">
                    {Math.round(card.progress)}%
                  </Text>
                </>
              )}
              <Text size="xs" c="dimmed" mt="sm">
                {card.subtitle}
              </Text>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text fw={700} size="lg" mb="md">{t('stats.weeklyProgressTitle')}</Text>
        <Grid>
          <Grid.Col span={8}>
            <Group gap="xs" mb="md">
              {weeklyProgress.days.map((day, index) => (
                <Paper
                  key={day.day}
                  p="md"
                  withBorder
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    backgroundColor: day.completed ? 'var(--mantine-color-blue-1)' : 'transparent',
                    borderColor: day.planned ? 'var(--mantine-color-blue-5)' : 'var(--mantine-color-gray-3)',
                    borderWidth: day.planned ? '2px' : '1px',
                    transition: 'all 0.2s ease',
                    transform: day.completed ? 'translateY(-2px)' : 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <Stack gap={4}>
                    <Text size="sm" fw={500}>{getDayTranslation(day.day)}</Text>
                    <Transition mounted={day.completed || day.planned} transition="pop">
                      {(styles) => (
                        <ThemeIcon 
                          color={day.completed ? 'blue' : 'gray'} 
                          variant={day.completed ? 'filled' : 'light'} 
                          size="md" 
                          style={styles}
                        >
                          {day.completed ? <IconCheck size={16} /> : <IconBarbell size={16} />}
                        </ThemeIcon>
                      )}
                    </Transition>
                    
                    {day.completed && onResetDay && (
                      <Tooltip label={t('workouts.resetWorkout')} position="bottom">
                        <ActionIcon 
                          variant="light" 
                          color="blue" 
                          size="sm" 
                          mt={5}
                          onClick={(e) => {
                            e.stopPropagation();
                            onResetDay(`day${index + 1}`);
                          }}
                        >
                          <IconRefresh size={14} />
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </Stack>
                  {day.completed && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        backgroundColor: 'var(--mantine-color-blue-5)'
                      }}
                    />
                  )}
                </Paper>
              ))}
            </Group>
            <Group align="center" mb="md">
              <Progress
                value={(weeklyProgress.completed_workouts / weeklyProgress.total_workouts) * 100}
                size="lg"
                color="blue"
                style={{ flex: 1 }}
                animated
              />
              <Text size="sm" fw={500}>
                {t('stats.workoutsCompleted')
                  .replace('{0}', weeklyProgress.completed_workouts.toString())
                  .replace('{1}', weeklyProgress.total_workouts.toString())}
              </Text>
            </Group>
          </Grid.Col>
          <Grid.Col span={4}>
            <Box style={{ position: 'relative' }}>
              <RingProgress
                sections={[
                  { value: (weeklyProgress.completed_workouts / weeklyProgress.total_workouts) * 100, color: 'blue' },
                ]}
                label={
                  <Text ta="center" size="lg" fw={700}>
                    {Math.round((weeklyProgress.completed_workouts / weeklyProgress.total_workouts) * 100)}%
                  </Text>
                }
                size={160}
                thickness={16}
              />
              <IconTrendingUp
                size={24}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  opacity: 0.1
                }}
              />
            </Box>
          </Grid.Col>
        </Grid>
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" align="center" mb="md">
          <Text fw={700} size="lg">{t('stats.achievements')}</Text>
          <Group>
            <Button
              leftSection={<IconBarbell size={18} />}
              variant="light"
              color="blue"
              onClick={() => router.push(userId === 'piotrek' ? '/piotr' : '/tomek')}
              size="sm"
            >
              {t('workouts.viewWorkouts') || "View Workouts"}
            </Button>
            <Tooltip label={t('workouts.resetWorkoutsKeepPoints') || "Reset workouts while preserving points"}>
              <Button
                leftSection={<IconRefresh size={18} />}
                variant="light"
                color="blue"
                onClick={() => {
                  if (onRestartTraining) {
                    onRestartTraining();
                  }
                }}
                size="sm"
              >
                {t('workouts.resetWorkouts') || "Reset Workouts"}
              </Button>
            </Tooltip>
          </Group>
        </Group>
        <Grid>
          {rewards.achievements.map((achievement) => (
            <Grid.Col key={achievement.id} span={{ base: 12, sm: 6, md: 4 }}>
              <Paper
                p="md"
                withBorder
                style={{
                  transition: 'all 0.2s ease',
                  transform: hoveredAchievement === achievement.id ? 'translateY(-4px)' : 'none',
                  cursor: 'pointer',
                  backgroundColor: achievement.achieved ? '#fff9db' : undefined
                }}
                onMouseEnter={() => setHoveredAchievement(achievement.id)}
                onMouseLeave={() => setHoveredAchievement(null)}
              >
                <Group>
                  <ThemeIcon
                    size="xl"
                    radius="md"
                    variant="light"
                    color={achievement.achieved ? 'yellow' : 'gray'}
                    style={{ transition: 'all 0.2s ease' }}
                  >
                    {achievement.achieved ? <IconStarFilled size={24} /> : <IconMedal size={24} />}
                  </ThemeIcon>
                  <div>
                    <Text fw={500}>{achievement.name}</Text>
                    <Text size="sm" c="dimmed">{achievement.description}</Text>
                    {achievement.achieved ? (
                      <Badge color="yellow" variant="light" mt="xs">
                        {t('stats.unlocked')}
                      </Badge>
                    ) : (
                      <Tooltip label={t('achievements.locked')} transitionProps={{ transition: 'pop', duration: 200 }}>
                        <Badge color="gray" variant="light" mt="xs">
                          {t('achievements.locked')}
                        </Badge>
                      </Tooltip>
                    )}
                  </div>
                </Group>
              </Paper>
            </Grid.Col>
          ))}
        </Grid>
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Text fw={700} size="lg">{t('stats.trainingAdvice')}</Text>
          <Tooltip label={t('stats.dailyTipsLabel')} transitionProps={{ transition: 'pop', duration: 200 }}>
            <ActionIcon variant="light" color="blue" size="lg">
              <IconInfoCircle size={20} />
            </ActionIcon>
          </Tooltip>
        </Group>
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Paper
              p="md"
              withBorder
              style={{
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }
              }}
            >
              <Group mb="xs">
                <ThemeIcon color="blue" variant="light" size="lg">
                  <IconHeartFilled size={20} />
                </ThemeIcon>
                <Text fw={500}>{t('stats.recoveryTips')}</Text>
              </Group>
              <Text size="sm" c="dimmed">
                {t('stats.recoveryTipsText')}
              </Text>
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Paper
              p="md"
              withBorder
              style={{
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }
              }}
            >
              <Group mb="xs">
                <ThemeIcon color="green" variant="light" size="lg">
                  <IconBarbell size={20} />
                </ThemeIcon>
                <Text fw={500}>{t('stats.trainingFocus')}</Text>
              </Group>
              <Text size="sm" c="dimmed">
                {t('stats.trainingFocusText')}
              </Text>
            </Paper>
          </Grid.Col>
        </Grid>
      </Card>
    </Stack>
  );
} 