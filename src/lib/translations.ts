export type Language = 'en' | 'pl';

export const translations = {
  en: {
    common: {
      points: 'Points',
      level: 'Level',
      dayStreak: 'Day Streak',
      progress: "'s Progress",
      loading: 'Loading...',
      error: 'Error',
      save: 'Save',
      cancel: 'Cancel',
      close: 'Close',
      completed: 'Completed',
      notCompleted: 'Not Completed',
      appTitle: 'Training Plan App',
      keepGoing: "Keep going! Don't break the chain!",
      exercises: 'Exercises',
      workouts: 'Workouts',
      minutes: 'minutes',
      days: {
        mon: 'Mon',
        tue: 'Tue',
        wed: 'Wed',
        thu: 'Thu',
        fri: 'Fri',
        sat: 'Sat',
        sun: 'Sun'
      },
      noData: 'No data found',
      sections: 'Sections',
      sets: 'Sets',
      reps: 'Reps',
      kg: 'kg',
      continue: 'Continue',
    },
    achievements: {
      title: 'Achievements',
      unlocked: 'Unlocked!',
      locked: 'Keep going to unlock!',
      newUnlocked: 'New Achievements Unlocked!',
    },
    workouts: {
      title: 'Workouts',
      piotr: "Piotr's Workouts",
      tomek: "Tomasz's Workouts",
      loading: 'Loading your workouts...',
      noWorkoutsFound: 'No workouts found. Please check if workouts have been added to the database.',
      failedToFetch: 'Failed to fetch workouts',
      failedToComplete: 'Failed to complete exercise',
      estimatedTime: 'Estimated time: {0} minutes',
      noExercises: 'No exercises in this section',
      exerciseVideo: 'Exercise Video',
      watchVideo: 'Watch video',
      exerciseDetails: 'Exercise details',
      sectionDetails: 'Section details',
      startRestTimer: 'Start Rest Timer',
      markComplete: 'Mark Complete',
      days: {
        day1: 'Back & Biceps',
        day2: 'Chest & Triceps',
        day3: 'Legs',
        day4: 'Shoulders & Abs'
      },
      completed: 'Completed',
      planned: 'Planned',
      exerciseCompleted: 'Exercise Completed!',
      pointsEarned: '{points} Points Earned!',
      streakBonus: '+{bonus} Streak Bonus Points',
      resetWorkout: 'Reset workout progress',
      resetSuccess: 'Workout Reset',
      resetMessage: 'All exercises have been reset successfully',
      resetError: 'Failed to reset workout progress',
      alreadyCompleted: 'Already completed',
      progressStatus: '{completed}/{total} exercises completed',
    },
    stats: {
      title: 'Training Summary',
      totalPoints: 'Total Points',
      completedExercises: 'Completed Exercises',
      completedDays: 'Completed Days',
      completedWeeks: 'Completed Weeks',
      weeklyProgress: 'Weekly Progress',
      monthlyProgress: 'Monthly Progress',
      consistencyScore: 'Consistency Score',
      nextLevel: 'points to next level',
      trainingAdvice: 'Training Advice',
      recoveryTips: 'Recovery Tips',
      trainingFocus: 'Training Focus',
      streak: 'Streak',
      days: 'days',
      masterLevel: 'Master Level {0}',
      completionRate: 'Completion Rate',
      exercisesCompleted: '{0} exercises completed',
      weeklyProgressTitle: 'Weekly Progress',
      workoutsCompleted: '{0}/{1} workouts',
      achievements: 'Achievements',
      unlocked: 'Unlocked!',
      dailyTipsLabel: 'Daily tips based on your progress',
      recoveryTipsText: 'Based on your recent workouts, focus on stretching and mobility exercises today. Consider light cardio to promote active recovery.',
      trainingFocusText: 'Your next workout should focus on upper body strength. Pay extra attention to form during compound exercises.',
    },
    motivational: {
      firstWorkout: {
        message: "Ready to start your fitness journey? The first step is always the most important!",
        action: "Schedule your first workout today"
      },
      workoutComplete: {
        message: "Great work on your workout today! Keep this momentum going!",
        action: "Plan your next session"
      },
      recovery: {
        message: "Yesterday's workout was great! Today might be a good recovery day.",
        action: "Focus on stretching and mobility"
      },
      streak: {
        message: "It's been a few days since your last workout. Let's get back on track!",
        action: "Start with a light workout today"
      },
      milestone: {
        message: "You're crushing it! 3+ workouts this week shows real dedication.",
        action: "Try increasing weights or reps"
      },
      personalBest: {
        message: "New personal best! Your hard work is paying off.",
        action: "Set a new goal for next week"
      }
    }
  },
  pl: {
    common: {
      points: 'Punkty',
      level: 'Poziom',
      dayStreak: 'Seria dni',
      progress: ' - Postępy',
      loading: 'Ładowanie...',
      error: 'Błąd',
      save: 'Zapisz',
      cancel: 'Anuluj',
      close: 'Zamknij',
      completed: 'Ukończone',
      notCompleted: 'Nieukończone',
      appTitle: 'Plan Treningowy',
      keepGoing: 'Tak trzymaj! Nie przerywaj serii!',
      exercises: 'Ćwiczenia',
      workouts: 'Treningi',
      minutes: 'minut',
      days: {
        mon: 'Pon',
        tue: 'Wt',
        wed: 'Śr',
        thu: 'Czw',
        fri: 'Pt',
        sat: 'Sob',
        sun: 'Ndz'
      },
      noData: 'Nie znaleziono danych',
      sections: 'Sekcje',
      sets: 'Serie',
      reps: 'Powtórzenia',
      kg: 'kg',
      continue: 'Kontynuuj',
    },
    achievements: {
      title: 'Osiągnięcia',
      unlocked: 'Odblokowane!',
      locked: 'Trenuj dalej, aby odblokować!',
      newUnlocked: 'Nowe Osiągnięcia Odblokowane!',
    },
    workouts: {
      title: 'Treningi',
      piotr: 'Treningi Piotra',
      tomek: 'Treningi Tomasza',
      loading: 'Ładowanie twoich treningów...',
      noWorkoutsFound: 'Nie znaleziono treningów. Sprawdź czy treningi zostały dodane do bazy danych.',
      failedToFetch: 'Nie udało się pobrać treningów',
      failedToComplete: 'Nie udało się ukończyć ćwiczenia',
      estimatedTime: 'Szacowany czas: {0} minut',
      noExercises: 'Brak ćwiczeń w tej sekcji',
      exerciseVideo: 'Film z ćwiczeniem',
      watchVideo: 'Zobacz film',
      exerciseDetails: 'Szczegóły ćwiczenia',
      sectionDetails: 'Szczegóły sekcji',
      startRestTimer: 'Rozpocznij timer odpoczynku',
      markComplete: 'Oznacz jako ukończone',
      days: {
        day1: 'Plecy i Biceps',
        day2: 'Klatka i Triceps',
        day3: 'Nogi',
        day4: 'Barki i Brzuch'
      },
      completed: 'Ukończone',
      planned: 'Zaplanowane',
      exerciseCompleted: 'Ćwiczenie Ukończone!',
      pointsEarned: 'Zdobyto {points} Punktów!',
      streakBonus: '+{bonus} Punktów za Serię',
      resetWorkout: 'Zresetuj postęp treningu',
      resetSuccess: 'Trening Zresetowany',
      resetMessage: 'Wszystkie ćwiczenia zostały zresetowane pomyślnie',
      resetError: 'Nie udało się zresetować postępu treningu',
      alreadyCompleted: 'Już ukończone',
      progressStatus: 'Ukończono {completed}/{total} ćwiczeń',
    },
    stats: {
      title: 'Podsumowanie Treningów',
      totalPoints: 'Suma punktów',
      completedExercises: 'Ukończone ćwiczenia',
      completedDays: 'Ukończone dni',
      completedWeeks: 'Ukończone tygodnie',
      weeklyProgress: 'Postęp tygodniowy',
      monthlyProgress: 'Postęp miesięczny',
      consistencyScore: 'Wynik regularności',
      nextLevel: 'punktów do następnego poziomu',
      trainingAdvice: 'Porady treningowe',
      recoveryTips: 'Wskazówki regeneracyjne',
      trainingFocus: 'Fokus treningowy',
      streak: 'Seria',
      days: 'dni',
      masterLevel: 'Poziom mistrzowski {0}',
      completionRate: 'Stopień ukończenia',
      exercisesCompleted: '{0} ukończonych ćwiczeń',
      weeklyProgressTitle: 'Postęp tygodniowy',
      workoutsCompleted: '{0}/{1} treningów',
      achievements: 'Osiągnięcia',
      unlocked: 'Odblokowane!',
      dailyTipsLabel: 'Codzienne wskazówki oparte na twoim postępie',
      recoveryTipsText: 'Na podstawie twoich ostatnich treningów, skup się dziś na rozciąganiu i ćwiczeniach mobilności. Rozważ lekki kardio dla aktywnej regeneracji.',
      trainingFocusText: 'Twój następny trening powinien skupić się na sile górnej części ciała. Zwróć szczególną uwagę na formę podczas ćwiczeń złożonych.',
    },
    motivational: {
      firstWorkout: {
        message: "Gotowy na rozpoczęcie swojej przygody fitness? Pierwszy krok jest zawsze najważniejszy!",
        action: "Zaplanuj swój pierwszy trening"
      },
      workoutComplete: {
        message: "Świetna robota z dzisiejszym treningiem! Utrzymaj ten momentum!",
        action: "Zaplanuj następną sesję"
      },
      recovery: {
        message: "Wczorajszy trening był świetny! Dziś może być dobry dzień na regenerację.",
        action: "Skup się na rozciąganiu i mobilności"
      },
      streak: {
        message: "Minęło kilka dni od ostatniego treningu. Wracamy do formy!",
        action: "Zacznij od lekkiego treningu"
      },
      milestone: {
        message: "Świetnie ci idzie! 3+ treningi w tym tygodniu pokazują prawdziwe zaangażowanie.",
        action: "Spróbuj zwiększyć ciężary lub powtórzenia"
      },
      personalBest: {
        message: "Nowy rekord osobisty! Twoja ciężka praca przynosi efekty.",
        action: "Ustaw nowy cel na następny tydzień"
      }
    }
  }
}; 