-- First, delete all workouts for Piotr
DELETE FROM exercise_sets WHERE exercise_id IN (
  SELECT id FROM exercises WHERE section_id IN (
    SELECT id FROM workout_sections WHERE workout_id IN (
      SELECT id FROM workouts WHERE user_name = 'piotrek'
    )
  )
);

DELETE FROM exercises WHERE section_id IN (
  SELECT id FROM workout_sections WHERE workout_id IN (
    SELECT id FROM workouts WHERE user_name = 'piotrek'
  )
);

DELETE FROM workout_sections WHERE workout_id IN (
  SELECT id FROM workouts WHERE user_name = 'piotrek'
);

DELETE FROM workouts WHERE user_name = 'piotrek';

-- Insert workouts for specific days
INSERT INTO workouts (id, name, day_trigger, user_name) VALUES
(1, 'TRENING 1', '1', 'piotrek'), -- Monday
(2, 'TRENING 2', '2', 'piotrek'), -- Tuesday
(3, 'TRENING 3', '4', 'piotrek'), -- Thursday
(4, 'TRENING 4', '5', 'piotrek'), -- Friday
(5, 'TRENING 5', '6', 'piotrek'); -- Saturday

-- Insert sections for all Piotr's workouts
INSERT INTO workout_sections (id, workout_id, title, description, order_index) VALUES
-- TRENING 1 (Monday)
(1, 1, 'Rozgrzewka - MOBILNOŚĆ + AKTYWACJA', NULL, 1),
(2, 1, 'PIEKIELNA PIĄTKA', 'Wykonaj 3 obwody bez przerwy', 2),
(3, 1, 'KORPUS', 'Obwód wykonujesz 3 razy bez przerwy', 3),

-- TRENING 2 (Tuesday)
(4, 2, 'Rozgrzewka - MOBILNOŚĆ + AKTYWACJA', NULL, 1),
(5, 2, 'PIEKIELNA PIĄTKA', 'Wykonaj 3 obwody bez przerwy', 2),
(6, 2, 'KORPUS', 'Obwód wykonujesz 3 razy bez przerwy', 3),

-- TRENING 3 (Thursday)
(7, 3, 'Rozgrzewka - MOBILNOŚĆ + AKTYWACJA', NULL, 1),
(8, 3, 'PIEKIELNA PIĄTKA', 'Wykonaj 3 obwody bez przerwy', 2),
(9, 3, 'KORPUS', 'Obwód wykonujesz 3 razy bez przerwy', 3),

-- TRENING 4 (Friday)
(10, 4, 'Rozgrzewka - MOBILNOŚĆ + AKTYWACJA', NULL, 1),
(11, 4, 'PIEKIELNA PIĄTKA', 'Wykonaj 3 obwody bez przerwy', 2),
(12, 4, 'KORPUS', 'Obwód wykonujesz 3 razy bez przerwy', 3),

-- TRENING 5 (Saturday)
(13, 5, 'Rozgrzewka - MOBILNOŚĆ + AKTYWACJA', NULL, 1),
(14, 5, 'PIEKIELNA PIĄTKA', 'Wykonaj 3 obwody bez przerwy', 2),
(15, 5, 'KORPUS', 'Obwód wykonujesz 3 razy bez przerwy', 3);

-- Insert exercises for Rozgrzewka (same for all workouts)
INSERT INTO exercises (id, section_id, name, sets, reps, duration, video_url, notes, is_completed, rest_time, order_index) VALUES
-- TRENING 1 Rozgrzewka (Monday)
(1, 1, 'Rotacja obręczy barkowej w klęku podpartym', 1, '15 na stronę', NULL, 'https://youtu.be/-ESJy63bIqg', '- pozycja wyjściowa to klęk podparty\n- kolce biodrowe w pozycji neutralnej\n- dopinamy brzuch bez podwijania miednicy (zrób wydech, żebra mają puść w kierunku miednicy, okolice pępka podciągasz do kręgosłupa)', false, 60, 1),
(2, 1, 'Rotacja odcinka piersiowego w niskim wykroku (w podporze)', 1, '15 na stronę', NULL, 'https://youtu.be/gfmhmUVFmr8', 'Stopę i przeciwną dłoń ustaw w jednej linii. Wykonaj rotację.', false, 60, 2),
(3, 1, 'Rotacja odcinka piersiowego w głębokim przysiadzie', 1, '15 na stronę', NULL, 'https://youtu.be/SxQtcbxIyJw', 'PIlnujemy aby biodro pozostało nieruchomo, inicjacja ruchu jest w odcinku piersiowym, staw skokowy nie może zapadać się do środka.', false, 60, 3),
(4, 1, 'Odwodzenie ręki z gumą oporową', 2, '15 na stronę', NULL, NULL, '- łopatkę staramy się trzymać neutralnie (najlepiej aby "spychać" do depresji i dół łopatki przyklejać do klatki piersiowej)\n- Podczas ruchu łokieć nie zmienia pozycji, odwodzisz tylko przedramie. Początkowo zakres może być stosunkowo mały.', false, 60, 4),
(5, 1, 'Lift offs na brzuchu', 2, '10', NULL, 'https://youtu.be/HAab81BRiyU', '- pozycja wyjściowa na brzuchu (pięści na podłodzę blisko sylwetki na wysokości klatki piersiowej)\n- czoło leży na podłodzę\n- pośladki napięte\n- brzuch napięty\n- wykonaj wdech, następnie unieś pięści stricte w górę (łokieć w sufit), wyprostuj ramię w tył. Przytrzymaj 2-3 sekundy wróć do pozycji wyjściowej\n- każde powtórzenie jest poprzedzone ściągnięciem łopatek do depresji i lekkiej retrakcji (tą pozycję trzymamy cały czas)', false, 60, 5),
(6, 1, 'Sekwencja ruchowa WTO', 2, '10', NULL, 'https://youtu.be/rnFu2R2Qxq4', '- pozycja wyjściowa na brzuchu\n- czoło leży na podłodzę\n- pośladki napięte\n- brzuch napięty\n- Dłonie zakładasz na potylicę, ściągasz łopatki do depresji i lekkiej retrakcji. Unieś łokcie w górę (motylek), utrzymując pozycję łopatek\n- wracasz do pozycji wyjściowej w tej samej traektorii', false, 60, 6),

-- TRENING 2 Rozgrzewka (Tuesday)
(7, 4, 'Rotacja obręczy barkowej w klęku podpartym', 1, '15 na stronę', NULL, 'https://youtu.be/-ESJy63bIqg', '- pozycja wyjściowa to klęk podparty\n- kolce biodrowe w pozycji neutralnej\n- dopinamy brzuch bez podwijania miednicy (zrób wydech, żebra mają puść w kierunku miednicy, okolice pępka podciągasz do kręgosłupa)', false, 60, 1),
(8, 4, 'Rotacja odcinka piersiowego w niskim wykroku (w podporze)', 1, '15 na stronę', NULL, 'https://youtu.be/gfmhmUVFmr8', 'Stopę i przeciwną dłoń ustaw w jednej linii. Wykonaj rotację.', false, 60, 2),
(9, 4, 'Rotacja odcinka piersiowego w głębokim przysiadzie', 1, '15 na stronę', NULL, 'https://youtu.be/SxQtcbxIyJw', 'PIlnujemy aby biodro pozostało nieruchomo, inicjacja ruchu jest w odcinku piersiowym, staw skokowy nie może zapadać się do środka.', false, 60, 3),

-- TRENING 3 Rozgrzewka (Thursday)
(10, 7, 'Rotacja obręczy barkowej w klęku podpartym', 1, '15 na stronę', NULL, 'https://youtu.be/-ESJy63bIqg', '- pozycja wyjściowa to klęk podparty\n- kolce biodrowe w pozycji neutralnej\n- dopinamy brzuch bez podwijania miednicy (zrób wydech, żebra mają puść w kierunku miednicy, okolice pępka podciągasz do kręgosłupa)', false, 60, 1),
(11, 7, 'Rotacja odcinka piersiowego w niskim wykroku (w podporze)', 1, '15 na stronę', NULL, 'https://youtu.be/gfmhmUVFmr8', 'Stopę i przeciwną dłoń ustaw w jednej linii. Wykonaj rotację.', false, 60, 2),
(12, 7, 'Rotacja odcinka piersiowego w głębokim przysiadzie', 1, '15 na stronę', NULL, 'https://youtu.be/SxQtcbxIyJw', 'PIlnujemy aby biodro pozostało nieruchomo, inicjacja ruchu jest w odcinku piersiowym, staw skokowy nie może zapadać się do środka.', false, 60, 3),

-- TRENING 4 Rozgrzewka (Friday)
(13, 10, 'Rotacja obręczy barkowej w klęku podpartym', 1, '15 na stronę', NULL, 'https://youtu.be/-ESJy63bIqg', '- pozycja wyjściowa to klęk podparty\n- kolce biodrowe w pozycji neutralnej\n- dopinamy brzuch bez podwijania miednicy (zrób wydech, żebra mają puść w kierunku miednicy, okolice pępka podciągasz do kręgosłupa)', false, 60, 1),
(14, 10, 'Rotacja odcinka piersiowego w niskim wykroku (w podporze)', 1, '15 na stronę', NULL, 'https://youtu.be/gfmhmUVFmr8', 'Stopę i przeciwną dłoń ustaw w jednej linii. Wykonaj rotację.', false, 60, 2),
(15, 10, 'Rotacja odcinka piersiowego w głębokim przysiadzie', 1, '15 na stronę', NULL, 'https://youtu.be/SxQtcbxIyJw', 'PIlnujemy aby biodro pozostało nieruchomo, inicjacja ruchu jest w odcinku piersiowym, staw skokowy nie może zapadać się do środka.', false, 60, 3),

-- TRENING 5 Rozgrzewka (Saturday)
(16, 13, 'Rotacja obręczy barkowej w klęku podpartym', 1, '15 na stronę', NULL, 'https://youtu.be/-ESJy63bIqg', '- pozycja wyjściowa to klęk podparty\n- kolce biodrowe w pozycji neutralnej\n- dopinamy brzuch bez podwijania miednicy (zrób wydech, żebra mają puść w kierunku miednicy, okolice pępka podciągasz do kręgosłupa)', false, 60, 1),
(17, 13, 'Rotacja odcinka piersiowego w niskim wykroku (w podporze)', 1, '15 na stronę', NULL, 'https://youtu.be/gfmhmUVFmr8', 'Stopę i przeciwną dłoń ustaw w jednej linii. Wykonaj rotację.', false, 60, 2),
(18, 13, 'Rotacja odcinka piersiowego w głębokim przysiadzie', 1, '15 na stronę', NULL, 'https://youtu.be/SxQtcbxIyJw', 'PIlnujemy aby biodro pozostało nieruchomo, inicjacja ruchu jest w odcinku piersiowym, staw skokowy nie może zapadać się do środka.', false, 60, 3);

-- Insert exercises for PIEKIELNA PIĄTKA (same for all workouts)
INSERT INTO exercises (id, section_id, name, sets, reps, duration, video_url, notes, is_completed, rest_time, order_index) VALUES
-- TRENING 1 PIEKIELNA PIĄTKA (Monday)
(19, 2, 'Górski bieg', NULL, NULL, '10 sekund', NULL, NULL, false, 30, 1),
(20, 2, 'Padnij powstań', NULL, '5', NULL, NULL, NULL, false, 30, 2),
(21, 2, 'Pompki klasyczne', NULL, '3', NULL, NULL, NULL, false, 30, 3),
(22, 2, 'Krzesełko ściana', NULL, NULL, '30 sekund', NULL, NULL, false, 30, 4),
(23, 2, 'Reverse plank', NULL, NULL, '20 sekund', NULL, NULL, false, 30, 5),

-- TRENING 2 PIEKIELNA PIĄTKA (Tuesday)
(24, 5, 'Górski bieg', NULL, NULL, '10 sekund', NULL, NULL, false, 30, 1),
(25, 5, 'Padnij powstań', NULL, '5', NULL, NULL, NULL, false, 30, 2),
(26, 5, 'Pompki klasyczne', NULL, '3', NULL, NULL, NULL, false, 30, 3),
(27, 5, 'Krzesełko ściana', NULL, NULL, '30 sekund', NULL, NULL, false, 30, 4),
(28, 5, 'Reverse plank', NULL, NULL, '20 sekund', NULL, NULL, false, 30, 5),

-- TRENING 3 PIEKIELNA PIĄTKA (Thursday)
(29, 8, 'Górski bieg', NULL, NULL, '10 sekund', NULL, NULL, false, 30, 1),
(30, 8, 'Padnij powstań', NULL, '5', NULL, NULL, NULL, false, 30, 2),
(31, 8, 'Pompki klasyczne', NULL, '3', NULL, NULL, NULL, false, 30, 3),
(32, 8, 'Krzesełko ściana', NULL, NULL, '30 sekund', NULL, NULL, false, 30, 4),
(33, 8, 'Reverse plank', NULL, NULL, '20 sekund', NULL, NULL, false, 30, 5),

-- TRENING 4 PIEKIELNA PIĄTKA (Friday)
(34, 11, 'Górski bieg', NULL, NULL, '10 sekund', NULL, NULL, false, 30, 1),
(35, 11, 'Padnij powstań', NULL, '5', NULL, NULL, NULL, false, 30, 2),
(36, 11, 'Pompki klasyczne', NULL, '3', NULL, NULL, NULL, false, 30, 3),
(37, 11, 'Krzesełko ściana', NULL, NULL, '30 sekund', NULL, NULL, false, 30, 4),
(38, 11, 'Reverse plank', NULL, NULL, '20 sekund', NULL, NULL, false, 30, 5),

-- TRENING 5 PIEKIELNA PIĄTKA (Saturday)
(39, 14, 'Górski bieg', NULL, NULL, '10 sekund', NULL, NULL, false, 30, 1),
(40, 14, 'Padnij powstań', NULL, '5', NULL, NULL, NULL, false, 30, 2),
(41, 14, 'Pompki klasyczne', NULL, '3', NULL, NULL, NULL, false, 30, 3),
(42, 14, 'Krzesełko ściana', NULL, NULL, '30 sekund', NULL, NULL, false, 30, 4),
(43, 14, 'Reverse plank', NULL, NULL, '20 sekund', NULL, NULL, false, 30, 5);

-- Insert exercises for KORPUS (same for all workouts)
INSERT INTO exercises (id, section_id, name, sets, reps, duration, video_url, notes, is_completed, rest_time, order_index) VALUES
-- TRENING 1 KORPUS (Monday)
(44, 3, 'Martwy Robak', NULL, '15/15', NULL, 'https://youtu.be/vbYYoyNUBGQ', '- kolce biodrowe ustawione neutralnie\n- w tej pozycji dopinamy brzuch bez podwijania miednicy\n- na wydechu dopnij skosy, mostek obniż, okolice pępka przyciągamy do kręgosłupa', false, 60, 1),
(45, 3, 'Plank Bokiem na przedramionach', NULL, NULL, NULL, 'https://youtu.be/oWnRr2h51KE', NULL, false, 60, 2),
(46, 3, 'Pająk', NULL, '15/15', NULL, 'https://youtu.be/ERntBaJR30Y', 'Unosisz tylko dłonie na przemian\n- Pozycja w klęku podpartym\n- Barki na wysokości dłoni\n- Biodra na wysokości kolan\n- Kolce biodrowe neutralnie\n- dopnij brzuch bez podwijania miednicy', false, 60, 3),
(47, 3, 'Antyrotacja w wykroku', NULL, '15/15', NULL, 'https://youtu.be/ZTeYkUwbshM', 'Guma z oporem 14kg', false, 60, 4),
(48, 3, 'Hollow body nogi na podłodze', NULL, NULL, NULL, 'https://youtu.be/CyRzQiURBE4', 'Na wydechu napnij skosy, mostek obniż, dół brzucha przyciągasz do kręgosłupa. Brzuch w tej pozycji ma być płaski.', false, 60, 5),

-- TRENING 2 KORPUS (Tuesday)
(49, 6, 'Martwy Robak', NULL, '15/15', NULL, 'https://youtu.be/vbYYoyNUBGQ', '- kolce biodrowe ustawione neutralnie\n- w tej pozycji dopinamy brzuch bez podwijania miednicy\n- na wydechu dopnij skosy, mostek obniż, okolice pępka przyciągamy do kręgosłupa', false, 60, 1),
(50, 6, 'Plank Bokiem na przedramionach', NULL, NULL, NULL, 'https://youtu.be/oWnRr2h51KE', NULL, false, 60, 2),
(51, 6, 'Pająk', NULL, '15/15', NULL, 'https://youtu.be/ERntBaJR30Y', 'Unosisz tylko dłonie na przemian\n- Pozycja w klęku podpartym\n- Barki na wysokości dłoni\n- Biodra na wysokości kolan\n- Kolce biodrowe neutralnie\n- dopnij brzuch bez podwijania miednicy', false, 60, 3),
(52, 6, 'Antyrotacja w wykroku', NULL, '15/15', NULL, 'https://youtu.be/ZTeYkUwbshM', 'Guma z oporem 14kg', false, 60, 4),
(53, 6, 'Hollow body nogi na podłodze', NULL, NULL, NULL, 'https://youtu.be/CyRzQiURBE4', 'Na wydechu napnij skosy, mostek obniż, dół brzucha przyciągasz do kręgosłupa. Brzuch w tej pozycji ma być płaski.', false, 60, 5),

-- TRENING 3 KORPUS (Thursday)
(54, 9, 'Martwy Robak', NULL, '15/15', NULL, 'https://youtu.be/vbYYoyNUBGQ', '- kolce biodrowe ustawione neutralnie\n- w tej pozycji dopinamy brzuch bez podwijania miednicy\n- na wydechu dopnij skosy, mostek obniż, okolice pępka przyciągamy do kręgosłupa', false, 60, 1),
(55, 9, 'Plank Bokiem na przedramionach', NULL, NULL, NULL, 'https://youtu.be/oWnRr2h51KE', NULL, false, 60, 2),
(56, 9, 'Pająk', NULL, '15/15', NULL, 'https://youtu.be/ERntBaJR30Y', 'Unosisz tylko dłonie na przemian\n- Pozycja w klęku podpartym\n- Barki na wysokości dłoni\n- Biodra na wysokości kolan\n- Kolce biodrowe neutralnie\n- dopnij brzuch bez podwijania miednicy', false, 60, 3),
(57, 9, 'Antyrotacja w wykroku', NULL, '15/15', NULL, 'https://youtu.be/ZTeYkUwbshM', 'Guma z oporem 14kg', false, 60, 4),
(58, 9, 'Hollow body nogi na podłodze', NULL, NULL, NULL, 'https://youtu.be/CyRzQiURBE4', 'Na wydechu napnij skosy, mostek obniż, dół brzucha przyciągasz do kręgosłupa. Brzuch w tej pozycji ma być płaski.', false, 60, 5),

-- TRENING 4 KORPUS (Friday)
(59, 12, 'Martwy Robak', NULL, '15/15', NULL, 'https://youtu.be/vbYYoyNUBGQ', '- kolce biodrowe ustawione neutralnie\n- w tej pozycji dopinamy brzuch bez podwijania miednicy\n- na wydechu dopnij skosy, mostek obniż, okolice pępka przyciągamy do kręgosłupa', false, 60, 1),
(60, 12, 'Plank Bokiem na przedramionach', NULL, NULL, NULL, 'https://youtu.be/oWnRr2h51KE', NULL, false, 60, 2),
(61, 12, 'Pająk', NULL, '15/15', NULL, 'https://youtu.be/ERntBaJR30Y', 'Unosisz tylko dłonie na przemian\n- Pozycja w klęku podpartym\n- Barki na wysokości dłoni\n- Biodra na wysokości kolan\n- Kolce biodrowe neutralnie\n- dopnij brzuch bez podwijania miednicy', false, 60, 3),
(62, 12, 'Antyrotacja w wykroku', NULL, '15/15', NULL, 'https://youtu.be/ZTeYkUwbshM', 'Guma z oporem 14kg', false, 60, 4),
(63, 12, 'Hollow body nogi na podłodze', NULL, NULL, NULL, 'https://youtu.be/CyRzQiURBE4', 'Na wydechu napnij skosy, mostek obniż, dół brzucha przyciągasz do kręgosłupa. Brzuch w tej pozycji ma być płaski.', false, 60, 5),

-- TRENING 5 KORPUS (Saturday)
(64, 15, 'Martwy Robak', NULL, '15/15', NULL, 'https://youtu.be/vbYYoyNUBGQ', '- kolce biodrowe ustawione neutralnie\n- w tej pozycji dopinamy brzuch bez podwijania miednicy\n- na wydechu dopnij skosy, mostek obniż, okolice pępka przyciągamy do kręgosłupa', false, 60, 1),
(65, 15, 'Plank Bokiem na przedramionach', NULL, NULL, NULL, 'https://youtu.be/oWnRr2h51KE', NULL, false, 60, 2),
(66, 15, 'Pająk', NULL, '15/15', NULL, 'https://youtu.be/ERntBaJR30Y', 'Unosisz tylko dłonie na przemian\n- Pozycja w klęku podpartym\n- Barki na wysokości dłoni\n- Biodra na wysokości kolan\n- Kolce biodrowe neutralnie\n- dopnij brzuch bez podwijania miednicy', false, 60, 3),
(67, 15, 'Antyrotacja w wykroku', NULL, '15/15', NULL, 'https://youtu.be/ZTeYkUwbshM', 'Guma z oporem 14kg', false, 60, 4),
(68, 15, 'Hollow body nogi na podłodze', NULL, NULL, NULL, 'https://youtu.be/CyRzQiURBE4', 'Na wydechu napnij skosy, mostek obniż, dół brzucha przyciągasz do kręgosłupa. Brzuch w tej pozycji ma być płaski.', false, 60, 5);

-- TRENING 2 Główny (Tuesday)
INSERT INTO exercises (id, section_id, name, sets, reps, weight, video_url, notes, is_completed, rest_time, order_index) VALUES
(69, 5, 'Przysiad ze sztangą', 4, '8', 60, 'https://youtu.be/1oed-UmAxFs', 'Stopy na szerokość bioder, kolana w linii palców stóp, biodra cofają się do tyłu, klatka piersiowa uniesiona, łopatki ściągnięte, głowa przedłuża kręgosłup.', false, 120, 1),
(70, 5, 'Wiosłowanie sztangą', 4, '10', 40, 'https://youtu.be/G8l_8chR5BE', 'Biodra cofają się do tyłu, plecy proste, łopatki ściągnięte, głowa przedłuża kręgosłup.', false, 120, 2),
(71, 5, 'Wyciskanie sztangi na ławce płaskiej', 4, '8', 40, 'https://youtu.be/rT7DgCr-3pg', 'Łopatki ściągnięte, stopy na podłodze, pośladki na ławce, głowa na ławce.', false, 120, 3),
(72, 5, 'Martwy ciąg', 4, '8', 60, 'https://youtu.be/op9kVnSso6Q', 'Stopy na szerokość bioder, kolana w linii palców stóp, biodra cofają się do tyłu, plecy proste, łopatki ściągnięte, głowa przedłuża kręgosłup.', false, 120, 4);

-- TRENING 3 Główny (Thursday)
INSERT INTO exercises (id, section_id, name, sets, reps, weight, video_url, notes, is_completed, rest_time, order_index) VALUES
(73, 8, 'Przysiad bułgarski', 4, '10 na stronę', 20, 'https://youtu.be/2C-uNgKwPLE', 'Kolano w linii palców stopy, biodra cofają się do tyłu, klatka piersiowa uniesiona, łopatki ściągnięte, głowa przedłuża kręgosłup.', false, 120, 1),
(74, 8, 'Wiosłowanie hantlami', 4, '12', 15, 'https://youtu.be/roCP6wCXPqo', 'Biodra cofają się do tyłu, plecy proste, łopatki ściągnięte, głowa przedłuża kręgosłup.', false, 120, 2),
(75, 8, 'Wyciskanie hantli na ławce skośnej', 4, '10', 15, 'https://youtu.be/8iPEnn-ltC8', 'Łopatki ściągnięte, stopy na podłodze, pośladki na ławce, głowa na ławce.', false, 120, 3),
(76, 8, 'Martwy ciąg rumuński', 4, '10', 40, 'https://youtu.be/2SHsk9AzdjA', 'Stopy na szerokość bioder, kolana lekko ugięte, biodra cofają się do tyłu, plecy proste, łopatki ściągnięte, głowa przedłuża kręgosłup.', false, 120, 4);

-- TRENING 4 Główny (Friday)
INSERT INTO exercises (id, section_id, name, sets, reps, weight, video_url, notes, is_completed, rest_time, order_index) VALUES
(77, 11, 'Przysiad ze sztangą z przodu', 4, '8', 40, 'https://youtu.be/m4ytaCJZpl0', 'Stopy na szerokość bioder, kolana w linii palców stóp, biodra cofają się do tyłu, klatka piersiowa uniesiona, łopatki ściągnięte, głowa przedłuża kręgosłup.', false, 120, 1),
(78, 11, 'Podciąganie na drążku', 4, '8', NULL, 'https://youtu.be/eGo4IYlbE5g', 'Łopatki ściągnięte, nogi wyprostowane, głowa przedłuża kręgosłup.', false, 120, 2),
(79, 11, 'Wyciskanie żołnierskie', 4, '8', 30, 'https://youtu.be/2yjwXTZQDDI', 'Stopy na szerokość bioder, klatka piersiowa uniesiona, łopatki ściągnięte, głowa przedłuża kręgosłup.', false, 120, 3),
(80, 11, 'Martwy ciąg', 4, '8', 70, 'https://youtu.be/op9kVnSso6Q', 'Stopy na szerokość bioder, kolana w linii palców stóp, biodra cofają się do tyłu, plecy proste, łopatki ściągnięte, głowa przedłuża kręgosłup.', false, 120, 4);

-- TRENING 5 Główny (Saturday)
INSERT INTO exercises (id, section_id, name, sets, reps, weight, video_url, notes, is_completed, rest_time, order_index) VALUES
(81, 14, 'Przysiad ze sztangą', 4, '8', 65, 'https://youtu.be/1oed-UmAxFs', 'Stopy na szerokość bioder, kolana w linii palców stóp, biodra cofają się do tyłu, klatka piersiowa uniesiona, łopatki ściągnięte, głowa przedłuża kręgosłup.', false, 120, 1),
(82, 14, 'Wiosłowanie sztangą', 4, '10', 45, 'https://youtu.be/G8l_8chR5BE', 'Biodra cofają się do tyłu, plecy proste, łopatki ściągnięte, głowa przedłuża kręgosłup.', false, 120, 2),
(83, 14, 'Wyciskanie sztangi na ławce płaskiej', 4, '8', 45, 'https://youtu.be/rT7DgCr-3pg', 'Łopatki ściągnięte, stopy na podłodze, pośladki na ławce, głowa na ławce.', false, 120, 3),
(84, 14, 'Martwy ciąg', 4, '8', 75, 'https://youtu.be/op9kVnSso6Q', 'Stopy na szerokość bioder, kolana w linii palców stóp, biodra cofają się do tyłu, plecy proste, łopatki ściągnięte, głowa przedłuża kręgosłup.', false, 120, 4);

-- Insert sections for BACK & BICEPS (Workout ID: 6)
INSERT INTO workout_sections (id, workout_id, title, description, order_index) VALUES
(40, 6, 'Rozgrzewka - MOBILNOŚĆ + AKTYWACJA', NULL, 1),
(41, 6, 'Część główna', NULL, 2);

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

-- Insert sections for CHEST & TRICEPS (Workout ID: 7)
INSERT INTO workout_sections (id, workout_id, title, description, order_index) VALUES
(42, 7, 'Rozgrzewka - MOBILNOŚĆ + AKTYWACJA', NULL, 1),
(43, 7, 'Część główna', NULL, 2);

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

-- Insert sections for LEGS (Workout ID: 8)
INSERT INTO workout_sections (id, workout_id, title, description, order_index) VALUES
(44, 8, 'Rozgrzewka - MOBILNOŚĆ + AKTYWACJA', NULL, 1),
(45, 8, 'Część główna', NULL, 2);

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

-- Insert sections for SHOULDERS & ABS (Workout ID: 9)
INSERT INTO workout_sections (id, workout_id, title, description, order_index) VALUES
(46, 9, 'Rozgrzewka - MOBILNOŚĆ + AKTYWACJA', NULL, 1),
(47, 9, 'Część główna', NULL, 2);

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