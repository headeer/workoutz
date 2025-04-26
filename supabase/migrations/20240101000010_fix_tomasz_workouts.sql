-- First, delete all workouts for Tomasz
DELETE FROM exercise_sets WHERE exercise_id IN (
  SELECT id FROM exercises WHERE section_id IN (
    SELECT id FROM workout_sections WHERE workout_id IN (
      SELECT id FROM workouts WHERE user_name = 'tomasz'
    )
  )
);

DELETE FROM exercises WHERE section_id IN (
  SELECT id FROM workout_sections WHERE workout_id IN (
    SELECT id FROM workouts WHERE user_name = 'tomasz'
  )
);

DELETE FROM workout_sections WHERE workout_id IN (
  SELECT id FROM workouts WHERE user_name = 'tomasz'
);

DELETE FROM workouts WHERE user_name = 'tomasz';

-- Insert workouts for specific days
INSERT INTO workouts (id, name, day_trigger, user_name) VALUES
(6, 'BACK & BICEPS', 'day1', 'tomasz'),
(7, 'CHEST & TRICEPS', 'day2', 'tomasz'),
(8, 'LEGS', 'day3', 'tomasz'),
(9, 'SHOULDERS & ABS', 'day4', 'tomasz');

-- Insert sections for all Tomasz's workouts
INSERT INTO workout_sections (id, workout_id, title, description, order_index) VALUES
-- BACK & BICEPS
(40, 6, 'Rozgrzewka - MOBILNOŚĆ + AKTYWACJA', NULL, 1),
(41, 6, 'Część główna', NULL, 2),

-- CHEST & TRICEPS
(42, 7, 'Rozgrzewka - MOBILNOŚĆ + AKTYWACJA', NULL, 1),
(43, 7, 'Część główna', NULL, 2),

-- LEGS
(44, 8, 'Rozgrzewka - MOBILNOŚĆ + AKTYWACJA', NULL, 1),
(45, 8, 'Część główna', NULL, 2),

-- SHOULDERS & ABS
(46, 9, 'Rozgrzewka - MOBILNOŚĆ + AKTYWACJA', NULL, 1),
(47, 9, 'Część główna', NULL, 2);

-- Insert exercises for BACK & BICEPS - Rozgrzewka
INSERT INTO exercises (section_id, name, sets, reps, video_url, notes, is_completed, order_index) VALUES
(40, 'Rotacja obręczy barkowej w klęku podpartym', 1, '15 na stronę', 'https://www.youtube.com/embed/-ESJy63bIqg', '- pozycja wyjściowa to klęk podparty\n- kolce biodrowe w pozycji neutralnej\n- dopinamy brzuch bez podwijania miednicy (zrób wydech, żebra mają puść w kierunku miednicy, okolice pępka podciągasz do kręgosłupa)', false, 1),
(40, 'Rotacja odcinka piersiowego w niskim wykroku (w podporze)', 1, '15 na stronę', 'https://www.youtube.com/embed/gfmhmUVFmr8', 'Stopę i przeciwną dłoń ustaw w jednej linii. Wykonaj rotację.', false, 2),
(40, 'Rotacja odcinka piersiowego w głębokim przysiadzie', 1, '15 na stronę', 'https://www.youtube.com/embed/SxQtcbxIyJw', 'PIlnujemy aby biodro pozostało nieruchomo, inicjacja ruchu jest w odcinku piersiowym, staw skokowy nie może zapadać się do środka.', false, 3);

-- Insert exercises for BACK & BICEPS - Część główna
INSERT INTO exercises (section_id, name, sets, reps, rest_time, video_url, is_completed, order_index) VALUES
(41, 'Wall Scap Pulldowns', 2, 'Max', 60, 'https://www.youtube.com/embed/OtgQDv7u1TM', false, 1),
(41, 'Lying Towel Rows', 2, 'Max', 30, 'https://www.youtube.com/embed/HEfaoch16wI', false, 2),
(41, 'Lying Superman', 2, 'Max', 120, 'https://www.youtube.com/embed/KTWWh3GsyYw', false, 3),
(41, 'Chin Ups', 3, 'Max', 30, 'https://www.youtube.com/embed/Oi3bW9nQmGI', false, 4),
(41, 'Australian Chin Ups', 3, 'Max', 180, 'https://www.youtube.com/embed/X-u_1Tp7Idc', false, 5),
(41, 'Angels of Death', 2, 'Max', 60, 'https://www.youtube.com/embed/o0FcYPZ8w3w', false, 6);

-- Insert exercises for CHEST & TRICEPS - Rozgrzewka
INSERT INTO exercises (section_id, name, sets, reps, video_url, notes, is_completed, order_index) VALUES
(42, 'Rotacja obręczy barkowej w klęku podpartym', 1, '15 na stronę', 'https://www.youtube.com/embed/-ESJy63bIqg', '- pozycja wyjściowa to klęk podparty\n- kolce biodrowe w pozycji neutralnej\n- dopinamy brzuch bez podwijania miednicy (zrób wydech, żebra mają puść w kierunku miednicy, okolice pępka podciągasz do kręgosłupa)', false, 1),
(42, 'Rotacja odcinka piersiowego w niskim wykroku (w podporze)', 1, '15 na stronę', 'https://www.youtube.com/embed/gfmhmUVFmr8', 'Stopę i przeciwną dłoń ustaw w jednej linii. Wykonaj rotację.', false, 2),
(42, 'Rotacja odcinka piersiowego w głębokim przysiadzie', 1, '15 na stronę', 'https://www.youtube.com/embed/SxQtcbxIyJw', 'PIlnujemy aby biodro pozostało nieruchomo, inicjacja ruchu jest w odcinku piersiowym, staw skokowy nie może zapadać się do środka.', false, 3);

-- Insert exercises for CHEST & TRICEPS - Część główna
INSERT INTO exercises (section_id, name, sets, reps, rest_time, video_url, is_completed, order_index) VALUES
(43, 'Standard Push Ups', 1, 'Max', 120, 'https://www.youtube.com/embed/ba8tr1NzwXU', false, 1),
(43, 'Weighted Dips', 3, '6-8', 30, 'https://www.youtube.com/embed/1_4OICx2WrY', false, 2),
(43, 'Diamond Push Ups', 2, 'Max', 120, 'https://www.youtube.com/embed/qhVVjIRVTPw', false, 3),
(43, 'Wide Grip Push Ups', 3, 'Max', 30, 'https://www.youtube.com/embed/ayWoVYjsdYA', false, 4),
(43, 'Incline Wide Grip Push Ups', 3, 'Max', 120, 'https://www.youtube.com/embed/Y7Fttk_zTFY', false, 5),
(43, 'Archer Push Ups', 2, 'Max', 120, 'https://www.youtube.com/embed/dKv_KYG65As', false, 6),
(43, 'Triceps Bench Dips', 3, 'Max', 60, 'https://www.youtube.com/embed/jlVIALohg2I', false, 7);

-- Insert exercises for LEGS - Rozgrzewka
INSERT INTO exercises (section_id, name, sets, reps, video_url, notes, is_completed, order_index) VALUES
(44, 'Rotacja obręczy barkowej w klęku podpartym', 1, '15 na stronę', 'https://www.youtube.com/embed/-ESJy63bIqg', '- pozycja wyjściowa to klęk podparty\n- kolce biodrowe w pozycji neutralnej\n- dopinamy brzuch bez podwijania miednicy (zrób wydech, żebra mają puść w kierunku miednicy, okolice pępka podciągasz do kręgosłupa)', false, 1),
(44, 'Rotacja odcinka piersiowego w niskim wykroku (w podporze)', 1, '15 na stronę', 'https://www.youtube.com/embed/gfmhmUVFmr8', 'Stopę i przeciwną dłoń ustaw w jednej linii. Wykonaj rotację.', false, 2),
(44, 'Rotacja odcinka piersiowego w głębokim przysiadzie', 1, '15 na stronę', 'https://www.youtube.com/embed/SxQtcbxIyJw', 'PIlnujemy aby biodro pozostało nieruchomo, inicjacja ruchu jest w odcinku piersiowym, staw skokowy nie może zapadać się do środka.', false, 3);

-- Insert exercises for LEGS - Część główna
INSERT INTO exercises (section_id, name, sets, reps, rest_time, video_url, is_completed, order_index) VALUES
(45, 'Walking Lunges', 2, 'Max', 30, 'https://www.youtube.com/embed/tQNktxPkSeE', false, 1),
(45, 'Morning Salutations', 2, 'Max', 60, 'https://www.youtube.com/embed/bdgoj1nTMbA', false, 2),
(45, 'Bulgarian Split Squats', 3, 'Max', 30, 'https://www.youtube.com/embed/uODWo4YqbT8', false, 3),
(45, 'Pulse Squats', 3, 'Max', 180, 'https://www.youtube.com/embed/QV0KBKANprw', false, 4),
(45, 'Crossack Squats', 3, 'Max', 120, 'https://www.youtube.com/embed/YVrfnCUXB8Q', false, 5),
(45, 'Alt Curtsy Lunges', 3, 'Max', 30, 'https://www.youtube.com/embed/3bLJmIG_L0o', false, 6),
(45, 'Step Ups', 3, 'Max', 180, 'https://www.youtube.com/embed/T4brBsjS_KU', false, 7),
(45, 'Single Leg RDL''s', 2, 'Max', 120, 'https://www.youtube.com/embed/zteT9sVYOSM', false, 8),
(45, 'Single Leg Calf Raises', 3, 'Max', 60, 'https://www.youtube.com/embed/OG3OgpXsirQ', false, 9);

-- Insert exercises for SHOULDERS & ABS - Rozgrzewka
INSERT INTO exercises (section_id, name, sets, reps, video_url, notes, is_completed, order_index) VALUES
(46, 'Rotacja obręczy barkowej w klęku podpartym', 1, '15 na stronę', 'https://www.youtube.com/embed/-ESJy63bIqg', '- pozycja wyjściowa to klęk podparty\n- kolce biodrowe w pozycji neutralnej\n- dopinamy brzuch bez podwijania miednicy (zrób wydech, żebra mają puść w kierunku miednicy, okolice pępka podciągasz do kręgosłupa)', false, 1),
(46, 'Rotacja odcinka piersiowego w niskim wykroku (w podporze)', 1, '15 na stronę', 'https://www.youtube.com/embed/gfmhmUVFmr8', 'Stopę i przeciwną dłoń ustaw w jednej linii. Wykonaj rotację.', false, 2),
(46, 'Rotacja odcinka piersiowego w głębokim przysiadzie', 1, '15 na stronę', 'https://www.youtube.com/embed/SxQtcbxIyJw', 'PIlnujemy aby biodro pozostało nieruchomo, inicjacja ruchu jest w odcinku piersiowym, staw skokowy nie może zapadać się do środka.', false, 3);

-- Insert exercises for SHOULDERS & ABS - Część główna
INSERT INTO exercises (section_id, name, sets, reps, rest_time, video_url, is_completed, order_index) VALUES
(47, 'Elevated Shoulder Taps', 3, 'Max', 120, 'https://www.youtube.com/embed/l-_tycjIXKY', false, 1),
(47, 'Pike Push Ups', 3, 'Max', 30, 'https://www.youtube.com/embed/XckEEwa1BPI', false, 2),
(47, 'High Side Plank Raises', 3, 'Max', 120, 'https://www.youtube.com/embed/mzeYnzwGrqM', false, 3),
(47, 'Reverse Plank Lean', 3, 'Max', 120, 'https://www.youtube.com/embed/UsEWwLIO6Rk', false, 4),
(47, 'Wall Side Plank Raises', 3, 'Max', 120, 'https://www.youtube.com/embed/0gllILQ48V8', false, 5);

-- Update sequences
SELECT setval('workout_sections_id_seq', (SELECT MAX(id) FROM workout_sections));
SELECT setval('exercises_id_seq', (SELECT MAX(id) FROM exercises)); 