-- Update sequences to handle custom IDs
SELECT setval('workouts_id_seq', (SELECT MAX(id) FROM workouts));
SELECT setval('workout_sections_id_seq', (SELECT MAX(id) FROM workout_sections));
SELECT setval('exercises_id_seq', (SELECT MAX(id) FROM exercises));

-- Insert workouts for Tomasz
INSERT INTO workouts (id, name, day_trigger, user_name) VALUES
(10, 'BACK & BICEPS', 'day1', 'tomasz'),
(11, 'CHEST & TRICEPS', 'day2', 'tomasz'),
(12, 'LEGS', 'day3', 'tomasz'),
(13, 'SHOULDERS & ABS', 'day4', 'tomasz');

-- Update sequence after custom IDs
SELECT setval('workouts_id_seq', (SELECT MAX(id) FROM workouts));

-- Insert sections for BACK & BICEPS
INSERT INTO workout_sections (id, workout_id, title, description, order_index) VALUES
(31, 10, 'Rozgrzewka - MOBILNOŚĆ + AKTYWACJA', NULL, 1),
(32, 10, 'Część główna', NULL, 2);

-- Update sequence after custom IDs
SELECT setval('workout_sections_id_seq', (SELECT MAX(id) FROM workout_sections));

-- Insert exercises for BACK & BICEPS - Rozgrzewka
INSERT INTO exercises (section_id, name, sets, reps, video_url, notes, is_completed, order_index) VALUES
(31, 'Rotacja obręczy barkowej w klęku podpartym', 1, '15 na stronę', 'https://www.youtube.com/embed/-ESJy63bIqg', '- pozycja wyjściowa to klęk podparty\n- kolce biodrowe w pozycji neutralnej\n- dopinamy brzuch bez podwijania miednicy (zrób wydech, żebra mają puść w kierunku miednicy, okolice pępka podciągasz do kręgosłupa)', false, 1),
(31, 'Rotacja odcinka piersiowego w niskim wykroku (w podporze)', 1, '15 na stronę', 'https://www.youtube.com/embed/gfmhmUVFmr8', 'Stopę i przeciwną dłoń ustaw w jednej linii. Wykonaj rotację.', false, 2),
(31, 'Rotacja odcinka piersiowego w głębokim przysiadzie', 1, '15 na stronę', 'https://www.youtube.com/embed/SxQtcbxIyJw', 'PIlnujemy aby biodro pozostało nieruchomo, inicjacja ruchu jest w odcinku piersiowym, staw skokowy nie może zapadać się do środka.', false, 3);

-- Insert exercises for BACK & BICEPS - Część główna
INSERT INTO exercises (section_id, name, sets, reps, rest_time, video_url, is_completed, order_index) VALUES
(32, 'Wall Scap Pulldowns', 2, 'Max', 60, 'https://www.youtube.com/embed/OtgQDv7u1TM', false, 1),
(32, 'Lying Towel Rows', 2, 'Max', 30, 'https://www.youtube.com/embed/HEfaoch16wI', false, 2),
(32, 'Lying Superman', 2, 'Max', 120, 'https://www.youtube.com/embed/KTWWh3GsyYw', false, 3),
(32, 'Chin Ups', 3, 'Max', 30, 'https://www.youtube.com/embed/Oi3bW9nQmGI', false, 4),
(32, 'Australian Chin Ups', 3, 'Max', 180, 'https://www.youtube.com/embed/X-u_1Tp7Idc', false, 5),
(32, 'Angels of Death', 2, 'Max', 60, 'https://www.youtube.com/embed/o0FcYPZ8w3w', false, 6);

-- Insert sections for CHEST & TRICEPS
INSERT INTO workout_sections (id, workout_id, title, description, order_index) VALUES
(33, 11, 'Rozgrzewka - MOBILNOŚĆ + AKTYWACJA', NULL, 1),
(34, 11, 'Część główna', NULL, 2);

-- Insert exercises for CHEST & TRICEPS - Rozgrzewka
INSERT INTO exercises (section_id, name, sets, reps, video_url, notes, is_completed, order_index) VALUES
(33, 'Rotacja obręczy barkowej w klęku podpartym', 1, '15 na stronę', 'https://www.youtube.com/embed/-ESJy63bIqg', '- pozycja wyjściowa to klęk podparty\n- kolce biodrowe w pozycji neutralnej\n- dopinamy brzuch bez podwijania miednicy (zrób wydech, żebra mają puść w kierunku miednicy, okolice pępka podciągasz do kręgosłupa)', false, 1),
(33, 'Rotacja odcinka piersiowego w niskim wykroku (w podporze)', 1, '15 na stronę', 'https://www.youtube.com/embed/gfmhmUVFmr8', 'Stopę i przeciwną dłoń ustaw w jednej linii. Wykonaj rotację.', false, 2),
(33, 'Rotacja odcinka piersiowego w głębokim przysiadzie', 1, '15 na stronę', 'https://www.youtube.com/embed/SxQtcbxIyJw', 'PIlnujemy aby biodro pozostało nieruchomo, inicjacja ruchu jest w odcinku piersiowym, staw skokowy nie może zapadać się do środka.', false, 3);

-- Insert exercises for CHEST & TRICEPS - Część główna
INSERT INTO exercises (section_id, name, sets, reps, rest_time, video_url, is_completed, order_index) VALUES
(34, 'Standard Push Ups', 1, 'Max', 120, 'https://www.youtube.com/embed/ba8tr1NzwXU', false, 1),
(34, 'Weighted Dips', 3, '6-8', 30, 'https://www.youtube.com/embed/1_4OICx2WrY', false, 2),
(34, 'Diamond Push Ups', 2, 'Max', 120, 'https://www.youtube.com/embed/qhVVjIRVTPw', false, 3),
(34, 'Wide Grip Push Ups', 3, 'Max', 30, 'https://www.youtube.com/embed/ayWoVYjsdYA', false, 4),
(34, 'Incline Wide Grip Push Ups', 3, 'Max', 120, 'https://www.youtube.com/embed/Y7Fttk_zTFY', false, 5),
(34, 'Archer Push Ups', 2, 'Max', 120, 'https://www.youtube.com/embed/dKv_KYG65As', false, 6),
(34, 'Triceps Bench Dips', 3, 'Max', 60, 'https://www.youtube.com/embed/jlVIALohg2I', false, 7);

-- Insert sections for LEGS
INSERT INTO workout_sections (id, workout_id, title, description, order_index) VALUES
(35, 12, 'Rozgrzewka - MOBILNOŚĆ + AKTYWACJA', NULL, 1),
(36, 12, 'Część główna', NULL, 2);

-- Insert exercises for LEGS - Rozgrzewka
INSERT INTO exercises (section_id, name, sets, reps, video_url, notes, is_completed, order_index) VALUES
(35, 'Rotacja obręczy barkowej w klęku podpartym', 1, '15 na stronę', 'https://www.youtube.com/embed/-ESJy63bIqg', '- pozycja wyjściowa to klęk podparty\n- kolce biodrowe w pozycji neutralnej\n- dopinamy brzuch bez podwijania miednicy (zrób wydech, żebra mają puść w kierunku miednicy, okolice pępka podciągasz do kręgosłupa)', false, 1),
(35, 'Rotacja odcinka piersiowego w niskim wykroku (w podporze)', 1, '15 na stronę', 'https://www.youtube.com/embed/gfmhmUVFmr8', 'Stopę i przeciwną dłoń ustaw w jednej linii. Wykonaj rotację.', false, 2),
(35, 'Rotacja odcinka piersiowego w głębokim przysiadzie', 1, '15 na stronę', 'https://www.youtube.com/embed/SxQtcbxIyJw', 'PIlnujemy aby biodro pozostało nieruchomo, inicjacja ruchu jest w odcinku piersiowym, staw skokowy nie może zapadać się do środka.', false, 3);

-- Insert exercises for LEGS - Część główna
INSERT INTO exercises (section_id, name, sets, reps, rest_time, video_url, is_completed, order_index) VALUES
(36, 'Walking Lunges', 2, 'Max', 30, 'https://www.youtube.com/embed/tQNktxPkSeE', false, 1),
(36, 'Morning Salutations', 2, 'Max', 60, 'https://www.youtube.com/embed/bdgoj1nTMbA', false, 2),
(36, 'Bulgarian Split Squats', 3, 'Max', 30, 'https://www.youtube.com/embed/uODWo4YqbT8', false, 3),
(36, 'Pulse Squats', 3, 'Max', 180, 'https://www.youtube.com/embed/QV0KBKANprw', false, 4),
(36, 'Crossack Squats', 3, 'Max', 120, 'https://www.youtube.com/embed/YVrfnCUXB8Q', false, 5),
(36, 'Alt Curtsy Lunges', 3, 'Max', 30, 'https://www.youtube.com/embed/3bLJmIG_L0o', false, 6),
(36, 'Step Ups', 3, 'Max', 180, 'https://www.youtube.com/embed/T4brBsjS_KU', false, 7),
(36, 'Single Leg RDL''s', 2, 'Max', 120, 'https://www.youtube.com/embed/zteT9sVYOSM', false, 8),
(36, 'Single Leg Calf Raises', 3, 'Max', 60, 'https://www.youtube.com/embed/OG3OgpXsirQ', false, 9);

-- Insert sections for SHOULDERS & ABS
INSERT INTO workout_sections (id, workout_id, title, description, order_index) VALUES
(37, 13, 'Rozgrzewka - MOBILNOŚĆ + AKTYWACJA', NULL, 1),
(38, 13, 'Część główna', NULL, 2);

-- Insert exercises for SHOULDERS & ABS - Rozgrzewka
INSERT INTO exercises (section_id, name, sets, reps, video_url, notes, is_completed, order_index) VALUES
(37, 'Rotacja obręczy barkowej w klęku podpartym', 1, '15 na stronę', 'https://www.youtube.com/embed/-ESJy63bIqg', '- pozycja wyjściowa to klęk podparty\n- kolce biodrowe w pozycji neutralnej\n- dopinamy brzuch bez podwijania miednicy (zrób wydech, żebra mają puść w kierunku miednicy, okolice pępka podciągasz do kręgosłupa)', false, 1),
(37, 'Rotacja odcinka piersiowego w niskim wykroku (w podporze)', 1, '15 na stronę', 'https://www.youtube.com/embed/gfmhmUVFmr8', 'Stopę i przeciwną dłoń ustaw w jednej linii. Wykonaj rotację.', false, 2),
(37, 'Rotacja odcinka piersiowego w głębokim przysiadzie', 1, '15 na stronę', 'https://www.youtube.com/embed/SxQtcbxIyJw', 'PIlnujemy aby biodro pozostało nieruchomo, inicjacja ruchu jest w odcinku piersiowym, staw skokowy nie może zapadać się do środka.', false, 3);

-- Insert exercises for SHOULDERS & ABS - Część główna
INSERT INTO exercises (section_id, name, sets, reps, rest_time, video_url, is_completed, order_index) VALUES
(38, 'Elevated Shoulder Taps', 3, 'Max', 120, 'https://www.youtube.com/embed/l-_tycjIXKY', false, 1),
(38, 'Pike Push Ups', 3, 'Max', 30, 'https://www.youtube.com/embed/XckEEwa1BPI', false, 2),
(38, 'High Side Plank Raises', 3, 'Max', 120, 'https://www.youtube.com/embed/mzeYnzwGrqM', false, 3),
(38, 'Reverse Plank Lean', 3, 'Max', 120, 'https://www.youtube.com/embed/UsEWwLIO6Rk', false, 4),
(38, 'Wall Side Plank Raises', 3, 'Max', 120, 'https://www.youtube.com/embed/0gllILQ48V8', false, 5);

-- Final sequence updates
SELECT setval('workouts_id_seq', (SELECT MAX(id) FROM workouts));
SELECT setval('workout_sections_id_seq', (SELECT MAX(id) FROM workout_sections));
SELECT setval('exercises_id_seq', (SELECT MAX(id) FROM exercises)); 