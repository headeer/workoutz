-- Clear existing data
TRUNCATE TABLE exercise_progress CASCADE;
TRUNCATE TABLE exercise_sets CASCADE;
TRUNCATE TABLE exercises CASCADE;
TRUNCATE TABLE workout_sections CASCADE;
TRUNCATE TABLE workouts CASCADE;
TRUNCATE TABLE user_progress CASCADE;

-- Insert workouts for Piotr
INSERT INTO workouts (id, name, day_trigger, user_name) VALUES
(1, 'TRENING 1', 'poniedzialek', 'piotrek'),
(2, 'TRENING 2', 'wtorek', 'piotrek'),
(3, 'TRENING 3', 'czwartek', 'piotrek'),
(4, 'TRENING 4', 'piatek', 'piotrek'),
(5, 'TRENING 5', 'sobota', 'piotrek');

-- Insert workouts for Tomasz
INSERT INTO workouts (id, name, day_trigger, user_name) VALUES
(6, 'BACK & BICEPS', 'day1', 'tomasz'),
(7, 'CHEST & TRICEPS', 'day2', 'tomasz'),
(8, 'LEGS', 'day3', 'tomasz'),
(9, 'SHOULDERS & ABS', 'day4', 'tomasz');

-- Insert sections for TRENING 1
INSERT INTO workout_sections (id, workout_id, title, description, order_index) VALUES
(1, 1, 'Rozgrzewka - MOBILNOŚĆ + AKTYWACJA', NULL, 1),
(2, 1, 'PIEKIELNA PIĄTKA', 'Wykonaj 3 obwody bez przerwy', 2),
(3, 1, 'Część główna', NULL, 3),
(4, 1, 'KORPUS', 'Obwód wykonujesz 3 razy bez przerwy', 4);

-- Insert all exercises first
-- Rozgrzewka exercises
INSERT INTO exercises (section_id, name, sets, reps, video_url, notes, is_completed, order_index) VALUES
(1, 'Rotacja obręczy barkowej w klęku podpartym', 1, '15 na stronę', 'https://youtu.be/-ESJy63bIqg', '- pozycja wyjściowa to klęk podparty\n- kolce biodrowe w pozycji neutralnej\n- dopinamy brzuch bez podwijania miednicy (zrób wydech, żebra mają puść w kierunku miednicy, okolice pępka podciągasz do kręgosłupa)', false, 1),
(1, 'Rotacja odcinka piersiowego w niskim wykroku (w podporze)', 1, '15 na stronę', 'https://youtu.be/gfmhmUVFmr8', 'Stopę i przeciwną dłoń ustaw w jednej linii. Wykonaj rotację.', false, 2),
(1, 'Rotacja odcinka piersiowego w głębokim przysiadzie', 1, '15 na stronę', 'https://youtu.be/SxQtcbxIyJw', 'PIlnujemy aby biodro pozostało nieruchomo, inicjacja ruchu jest w odcinku piersiowym, staw skokowy nie może zapadać się do środka.', false, 3),
(1, 'Odwodzenie ręki z gumą oporową', 2, '15 na stronę', NULL, '- łopatkę staramy się trzymać neutralnie (najlepiej aby "spychać" do depresji i dół łopatki przyklejać do klatki piersiowej)\n- Podczas ruchu łokieć nie zmienia pozycji, odwodzisz tylko przedramie. Początkowo zakres może być stosunkowo mały.', false, 4),
(1, 'Lift offs na brzuchu', 2, '10', 'https://youtu.be/HAab81BRiyU', '- pozycja wyjściowa na brzuchu (pięści na podłodzę blisko sylwetki na wysokości klatki piersiowej)\n- czoło leży na podłodzę\n- pośladki napięte\n- brzuch napięty\n- wykonaj wdech, następnie unieś pięści stricte w górę (łokieć w sufit), wyprostuj ramię w tył. Przytrzymaj 2-3 sekundy wróć do pozycji wyjściowej\n- każde powtórzenie jest poprzedzone ściągnięciem łopatek do depresji i lekkiej retrakcji (tą pozycję trzymamy cały czas)', false, 5);

-- PIEKIELNA PIĄTKA exercises
INSERT INTO exercises (section_id, name, duration, reps, is_completed, order_index) VALUES
(2, 'Górski bieg', '10 sekund', NULL, false, 1),
(2, 'Padnij powstań', NULL, '5', false, 2),
(2, 'Pompki klasyczne', NULL, '3', false, 3),
(2, 'Krzesełko ściana', '30 sekund', NULL, false, 4),
(2, 'Reverse plank', '20 sekund', NULL, false, 5);

-- Część główna exercises
INSERT INTO exercises (section_id, name, notes, is_completed, order_index) VALUES
(3, 'V – Piramida', 'Powtórzenia są obligatoryjne. Jeżeli psuje się technika lub jest za ciężko to dołóż proszę cieńką gumę lub wykonaj wolne opuszczanie.', false, 1),
(3, 'Dipy', 'Można wykonać z gumą jeżeli będzie za ciężko. Powtórzenia są OBLIGATORYJNE', false, 2),
(3, 'Podciągania australijskie na kołach', 'TEMPO (5115)\nOznacza to, że w górnej fazie trzymasz 5 sekund, 5 sekund trwa wolne opuszczanie, 1 sekunda to ile czasu jesteś na dole i ile czasu trwa ruch do góry', false, 3),
(3, 'Pompki', NULL, false, 4),
(3, 'Izometria w podciągnięciu nachwyt', NULL, false, 5);

-- KORPUS exercises
INSERT INTO exercises (section_id, name, reps, video_url, notes, is_completed, order_index) VALUES
(4, 'Martwy Robak', '15/15', 'https://youtu.be/vbYYoyNUBGQ', '- kolce biodrowe ustawione neutralnie\n- w tej pozycji dopinamy brzuch bez podwijania miednicy\n- na wydechu dopnij skosy, mostek obniż, okolice pępka przyciągamy do kręgosłupa', false, 1),
(4, 'Plank Bokiem na przedramionach', NULL, 'https://youtu.be/oWnRr2h51KE', NULL, false, 2),
(4, 'Pająk', '15/15', 'https://youtu.be/ERntBaJR30Y', 'Unosisz tylko dłonie na przemian\n- Pozycja w klęku podpartym\n- Barki na wysokości dłoni\n- Biodra na wysokości kolan\n- Kolce biodrowe neutralnie\n- dopnij brzuch bez podwijania miednicy', false, 3),
(4, 'Antyrotacja w wykroku', '15/15', 'https://youtu.be/ZTeYkUwbshM', 'Guma z oporem 14kg', false, 4),
(4, 'Hollow body nogi na podłodze', NULL, 'https://youtu.be/CyRzQiURBE4', 'Na wydechu napnij skosy, mostek obniż, dół brzucha przyciągasz do kręgosłupa. Brzuch w tej pozycji ma być płaski.', false, 5);

-- Get the actual exercise IDs
DO $$
DECLARE
    v_piramida_id INTEGER;
    dipy_id INTEGER;
    podciagania_id INTEGER;
    pompki_id INTEGER;
    izometria_id INTEGER;
    martwy_robak_id INTEGER;
    plank_id INTEGER;
BEGIN
    -- Get the IDs of the exercises we need
    SELECT id INTO v_piramida_id FROM exercises WHERE name = 'V – Piramida';
    SELECT id INTO dipy_id FROM exercises WHERE name = 'Dipy';
    SELECT id INTO podciagania_id FROM exercises WHERE name = 'Podciągania australijskie na kołach';
    SELECT id INTO pompki_id FROM exercises WHERE name = 'Pompki';
    SELECT id INTO izometria_id FROM exercises WHERE name = 'Izometria w podciągnięciu nachwyt';
    SELECT id INTO martwy_robak_id FROM exercises WHERE name = 'Martwy Robak';
    SELECT id INTO plank_id FROM exercises WHERE name = 'Plank Bokiem na przedramionach';

    -- Now insert exercise sets using the actual IDs
    -- V – Piramida sets
    INSERT INTO exercise_sets (exercise_id, set_number, reps, rest_time, is_completed) VALUES
    (v_piramida_id, 1, '8', 90, false),
    (v_piramida_id, 2, '7', 80, false),
    (v_piramida_id, 3, '6', 70, false),
    (v_piramida_id, 4, '5', 60, false),
    (v_piramida_id, 5, '4', 50, false),
    (v_piramida_id, 6, '5', 60, false),
    (v_piramida_id, 7, '6', 70, false),
    (v_piramida_id, 8, '7', 80, false),
    (v_piramida_id, 9, '8', 0, false);

    -- Dipy sets
    INSERT INTO exercise_sets (exercise_id, set_number, description, rest_time, is_completed) VALUES
    (dipy_id, 1, 'Seria 1: Maksymalna ilość powtórzeń', 120, false),
    (dipy_id, 2, 'Serie 2-5: 85% powtórzeń z pierwszej serii', 120, false);

    -- Podciągania australijskie sets
    INSERT INTO exercise_sets (exercise_id, set_number, reps, is_completed) VALUES
    (podciagania_id, 1, '6', false),
    (podciagania_id, 2, '6', false),
    (podciagania_id, 3, '6', false),
    (podciagania_id, 4, '6', false),
    (podciagania_id, 5, '6', false);

    -- Pompki sets
    INSERT INTO exercise_sets (exercise_id, set_number, description, is_completed) VALUES
    (pompki_id, 1, 'Seria 1: Maksymalna ilość powtórzeń', false),
    (pompki_id, 2, 'Serie 2-5: 75% powtórzeń z pierwszej serii', false);

    -- Izometria sets
    INSERT INTO exercise_sets (exercise_id, set_number, description, rest_time, is_completed) VALUES
    (izometria_id, 1, 'Maksymalny czas zwisu', 60, false),
    (izometria_id, 2, 'Maksymalny czas zwisu', 60, false),
    (izometria_id, 3, 'Maksymalny czas zwisu', 60, false);

    -- KORPUS sets
    INSERT INTO exercise_sets (exercise_id, set_number, duration, is_completed) VALUES
    (martwy_robak_id, 1, '30/30 sekund', false),
    (plank_id, 1, '30 sekund', false);
END $$;

-- Insert initial user progress
INSERT INTO user_progress (user_id, points, completed_exercises, completed_days, completed_weeks) VALUES
('piotrek', 5, 0, 0, 0),
('tomasz', 0, 0, 0, 0); 