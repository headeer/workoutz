-- Clear existing data
TRUNCATE TABLE exercise_progress CASCADE;
TRUNCATE TABLE exercise_sets CASCADE;
TRUNCATE TABLE exercises CASCADE;
TRUNCATE TABLE workout_sections CASCADE;
TRUNCATE TABLE workouts CASCADE;
TRUNCATE TABLE user_progress CASCADE;

-- Insert initial workouts
INSERT INTO workouts (name, day_trigger, user_name) VALUES
('TRENING 1', 'Monday', 'piotrek'),
('TRENING 2', 'Tuesday', 'piotrek'),
('TRENING 3', 'Wednesday', 'piotrek'),
('TRENING 4', 'Thursday', 'piotrek'),
('TRENING 5', 'Friday', 'piotrek');

-- Insert sections for TRENING 1
INSERT INTO workout_sections (workout_id, title, description, order_index) VALUES
(1, 'Rozgrzewka', 'Wykonaj każde ćwiczenie przez 30 sekund, odpocznij 30 sekund między ćwiczeniami', 1),
(1, 'Część główna', 'Wykonaj 3 serie po 10 powtórzeń każdego ćwiczenia', 2),
(1, 'Schładzanie', 'Wykonaj każde ćwiczenie przez 30 sekund', 3);

-- Insert sections for TRENING 2
INSERT INTO workout_sections (workout_id, title, description, order_index) VALUES
(2, 'Rozgrzewka', 'Wykonaj każde ćwiczenie przez 30 sekund', 1),
(2, 'Część główna', 'Wykonaj wszystkie ćwiczenia zgodnie z planem', 2),
(2, 'Schładzanie', 'Rozciąganie', 3);

-- Insert sections for TRENING 3
INSERT INTO workout_sections (workout_id, title, description, order_index) VALUES
(3, 'Rozgrzewka', 'Wykonaj każde ćwiczenie przez 30 sekund', 1),
(3, 'Część główna', 'Trening siłowy nóg', 2);

-- Insert sections for TRENING 4
INSERT INTO workout_sections (workout_id, title, description, order_index) VALUES
(4, 'Rozgrzewka', 'Rozgrzej się dokładnie przed treningiem', 1),
(4, 'Część główna', 'Trening interwałowy', 2);

-- Insert sections for TRENING 5
INSERT INTO workout_sections (workout_id, title, description, order_index) VALUES
(5, 'Rozgrzewka', 'Rozgrzej się dokładnie przed treningiem', 1),
(5, 'Część główna', 'Trening całego ciała', 2);

-- Insert exercises for TRENING 1 - Rozgrzewka
INSERT INTO exercises (section_id, name, sets, reps, rest_time, notes, is_completed, order_index) VALUES
(1, 'Bieg w miejscu', 1, '30 sekund', 30, NULL, false, 1),
(1, 'Skakanie na skakance', 1, '30 sekund', 30, NULL, false, 2),
(1, 'Wymachy ramion', 1, '30 sekund', 30, NULL, false, 3),
(1, 'Wymachy nóg', 1, '30 sekund', 30, NULL, false, 4),
(1, 'Skręty tułowia', 1, '30 sekund', 30, NULL, false, 5);

-- Insert exercises for TRENING 1 - Część główna
INSERT INTO exercises (section_id, name, sets, reps, weight, rest_time, notes, is_completed, order_index) VALUES
(2, 'Przysiady', 3, '10', '+5kg', 60, 'Utrzymaj proste plecy', false, 1),
(2, 'Wykroki', 3, '10 na nogę', '+5kg', 60, 'Kolano nie może wyjść przed palce', false, 2),
(2, 'Pompki', 3, '10', NULL, 60, 'Utrzymaj napięty brzuch', false, 3),
(2, 'Podciąganie na drążku', 3, '5', NULL, 60, 'Jeśli nie dasz rady, użyj gumy', false, 4),
(2, 'Deska', 3, '30 sekund', NULL, 60, 'Utrzymaj napięty brzuch', false, 5);

-- Insert exercises for TRENING 1 - Schładzanie
INSERT INTO exercises (section_id, name, sets, duration, rest_time, notes, is_completed, order_index) VALUES
(3, 'Rozciąganie nóg', 1, '30 sekund', 30, NULL, false, 1),
(3, 'Rozciąganie pleców', 1, '30 sekund', 30, NULL, false, 2),
(3, 'Rozciąganie ramion', 1, '30 sekund', 30, NULL, false, 3);

-- Insert exercises for TRENING 2 - Rozgrzewka
INSERT INTO exercises (section_id, name, sets, duration, rest_time, notes, is_completed, order_index) VALUES
(4, 'Krążenia ramion', 1, '30 sekund', 30, NULL, false, 1),
(4, 'Krążenia bioder', 1, '30 sekund', 30, NULL, false, 2),
(4, 'Pajacyki', 1, '30 sekund', 30, NULL, false, 3);

-- Insert exercises for TRENING 2 - Część główna
INSERT INTO exercises (section_id, name, sets, reps, weight, rest_time, notes, is_completed, order_index) VALUES
(5, 'Wiosłowanie sztangą', 4, '8', '+10kg', 120, 'Ściągaj łopatki', false, 1),
(5, 'Wyciskanie na ławce poziomej', 4, '8', '+15kg', 120, 'Kontroluj ruch', false, 2),
(5, 'Podciąganie nachwytem', 4, '6', NULL, 120, NULL, false, 3),
(5, 'Pompki na poręczach', 4, '8', NULL, 120, NULL, false, 4);

-- Insert exercises for TRENING 2 - Schładzanie
INSERT INTO exercises (section_id, name, sets, duration, rest_time, notes, is_completed, order_index) VALUES
(6, 'Rozciąganie pleców', 1, '45 sekund', 30, NULL, false, 1),
(6, 'Rozciąganie klatki piersiowej', 1, '45 sekund', 30, NULL, false, 2);

-- Insert exercises for TRENING 3 - Rozgrzewka
INSERT INTO exercises (section_id, name, sets, duration, rest_time, notes, is_completed, order_index) VALUES
(7, 'Przysiady bez obciążenia', 1, '30 sekund', 30, NULL, false, 1),
(7, 'Wykroki w miejscu', 1, '30 sekund', 30, NULL, false, 2);

-- Insert exercises for TRENING 3 - Część główna
INSERT INTO exercises (section_id, name, sets, reps, weight, rest_time, notes, is_completed, order_index) VALUES
(8, 'Przysiad ze sztangą', 5, '5', '+8kg', 180, 'Pełen zakres ruchu', false, 1),
(8, 'Martwy ciąg', 5, '5', '+12kg', 180, 'Trzymaj proste plecy', false, 2),
(8, 'Wypady', 5, '5', '+8kg', 180, NULL, false, 3),
(8, 'Hip Thrust', 5, '8', '+15kg', 180, NULL, false, 4);

-- Insert exercises for TRENING 4 - Rozgrzewka
INSERT INTO exercises (section_id, name, sets, duration, rest_time, notes, is_completed, order_index) VALUES
(9, 'Trucht w miejscu', 1, '1 minuta', 30, NULL, false, 1),
(9, 'Krążenia stawów', 1, '30 sekund', 30, NULL, false, 2);

-- Insert exercises for TRENING 4 - Część główna
INSERT INTO exercises (section_id, name, sets, duration, rest_time, notes, is_completed, order_index) VALUES
(10, 'Sprint w miejscu', 7, '10 sekund', 90, NULL, false, 1),
(10, 'Mountain climbers', 7, '10 sekund', 90, NULL, false, 2),
(10, 'Burpees', 5, '5', 90, NULL, false, 3),
(10, 'Jumping jacks', 5, '12', 120, NULL, false, 4),
(10, 'Plank z dotknięciami', 5, '20 sekund', 120, NULL, false, 5);

-- Insert exercises for TRENING 5 - Rozgrzewka
INSERT INTO exercises (section_id, name, sets, duration, rest_time, notes, is_completed, order_index) VALUES
(11, 'Rozgrzewka całego ciała', 1, '5 minut', 0, 'Wykonuj płynne ruchy', false, 1);

-- Insert exercises for TRENING 5 - Część główna
INSERT INTO exercises (section_id, name, sets, reps, weight, rest_time, notes, is_completed, order_index) VALUES
(12, 'Przysiad bułgarski', 3, '10', '+5kg', 90, NULL, false, 1),
(12, 'Unoszenie hantli bokiem', 3, '20', '+5kg do ręki', 90, NULL, false, 2),
(12, 'Wiosłowanie hantlami', 3, '15', '+8kg do ręki', 90, NULL, false, 3),
(12, 'Pompki diamentowe', 4, '12', NULL, 90, NULL, false, 4),
(12, 'Plank z unoszeniem nóg', 4, '15', NULL, 90, NULL, false, 5),
(12, 'Wznosy łydek', 3, '15', '+12kg', 90, NULL, false, 6),
(12, 'Brzuszki', 3, '15', NULL, 90, NULL, false, 7),
(12, 'Deska bokiem', 3, '80 sekund', NULL, 0, NULL, false, 8);

-- Insert exercise sets for TRENING 1 exercises
INSERT INTO exercise_sets (exercise_id, set_number, reps, weight, rest_time, is_completed) VALUES
(6, 1, '10', '+5kg', 60, false),
(6, 2, '10', '+5kg', 60, false),
(6, 3, '10', '+5kg', 60, false);

INSERT INTO exercise_sets (exercise_id, set_number, reps, weight, rest_time, is_completed) VALUES
(7, 1, '10 na nogę', '+5kg', 60, false),
(7, 2, '10 na nogę', '+5kg', 60, false),
(7, 3, '10 na nogę', '+5kg', 60, false);

INSERT INTO exercise_sets (exercise_id, set_number, reps, rest_time, is_completed) VALUES
(8, 1, '10', 60, false),
(8, 2, '10', 60, false),
(8, 3, '10', 60, false);

INSERT INTO exercise_sets (exercise_id, set_number, reps, rest_time, is_completed) VALUES
(9, 1, '5', 60, false),
(9, 2, '5', 60, false),
(9, 3, '5', 60, false);

INSERT INTO exercise_sets (exercise_id, set_number, duration, rest_time, is_completed) VALUES
(10, 1, '30 sekund', 60, false),
(10, 2, '30 sekund', 60, false),
(10, 3, '30 sekund', 60, false);

-- Insert initial user progress
INSERT INTO user_progress (user_id, points, completed_exercises, completed_days, completed_weeks) VALUES
('piotrek', 0, 0, 0, 0);

-- Insert initial exercise progress
INSERT INTO exercise_progress (user_id, exercise_id, date, weight, reps, notes) VALUES
('piotrek', 6, CURRENT_TIMESTAMP, 5, 10, 'First attempt'),
('piotrek', 7, CURRENT_TIMESTAMP, 5, 10, 'First attempt'),
('piotrek', 8, CURRENT_TIMESTAMP, NULL, 10, 'First attempt'),
('piotrek', 9, CURRENT_TIMESTAMP, NULL, 5, 'First attempt'); 