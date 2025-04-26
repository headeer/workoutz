-- Insert sections for TRENING 2
INSERT INTO workout_sections (id, workout_id, title, description, order_index) VALUES
(5, 2, 'Rozgrzewka - MOBILNOŚĆ + AKTYWACJA', NULL, 1),
(6, 2, 'PIEKIELNA PIĄTKA', 'Wykonaj 3 obwody bez przerwy', 2),
(7, 2, 'Część główna', NULL, 3),
(8, 2, 'AMRAP 20', 'As Many Rounds As Possible w 20 minut', 4),
(9, 2, 'KORPUS', 'Obwód wykonujesz 3 razy bez przerwy', 5);

-- Insert exercises for TRENING 2 - Część główna
INSERT INTO exercises (section_id, name, sets, duration, rest_time, is_completed, order_index) VALUES
(7, 'Trzymanie Straddle Planche z gumą oporową na biodrach', 7, '10 sekund', 90, false, 1),
(7, 'Tuck planche na paraletkach', 7, '10 sekund', 90, false, 2);

INSERT INTO exercises (section_id, name, sets, reps, rest_time, is_completed, order_index) VALUES
(7, 'Press tuck planche na skrzyniach', 5, '5', 90, false, 3),
(7, 'Planche Lean ze zmianą nóg', 5, '12', 120, false, 4);

INSERT INTO exercises (section_id, name, sets, duration, rest_time, is_completed, order_index) VALUES
(7, 'Planche Lean', 5, '20 sekund', 120, false, 5);

INSERT INTO exercises (section_id, name, sets, description, rest_time, notes, is_completed, order_index) VALUES
(7, 'Unoszenie prostych nóg w tył w leżeniu brzuchem na skrzyni', 5, '20 wznosów + izometria w spięciu 30 sekund', 120, '- Wysoka Skrzynia\n- Kolca biodrowe na krawędzi skrzyni\n- Brzuch napięty\n- Ruch wykonujesz z pośladka, nie możesz odczuwac nadmiernie odcinka lędźwiowego', false, 6);

-- Insert exercises for TRENING 2 - AMRAP 20
INSERT INTO exercises (section_id, name, reps, is_completed, order_index) VALUES
(8, 'Nachwyt', '3', false, 1),
(8, 'BurPee box jump', '10', false, 2),
(8, 'Dipy', '5', false, 3),
(8, 'Przeskoki w miejscu', '10 na nogę', false, 4),
(8, 'Podwójna Skakanka', '20', false, 5),
(8, 'Scyzoryk', '10', false, 6);

-- Insert sections for TRENING 3
INSERT INTO workout_sections (id, workout_id, title, description, order_index) VALUES
(10, 3, 'Rozgrzewka - MOBILNOŚĆ + AKTYWACJA', NULL, 1),
(11, 3, 'PIEKIELNA PIĄTKA', 'Wykonaj 3 obwody bez przerwy', 2),
(12, 3, 'Część główna', NULL, 3),
(13, 3, 'KORPUS', 'Obwód wykonujesz 3 razy bez przerwy', 4);

-- Insert exercises for TRENING 3 - Część główna
INSERT INTO exercises (section_id, name, sets, reps, weight, rest_time, is_completed, order_index) VALUES
(12, 'Podciągania Nachwytem', 5, '5', '+8kg', 180, false, 1),
(12, 'Dipy', 5, '5', '+12kg', 180, false, 2),
(12, 'Podciągania Podchwyt', 5, '5', '+8kg', 180, false, 3),
(12, 'Pompki Klasyczne', 5, '8', '+15kg', 180, false, 4);

INSERT INTO exercises (section_id, name, sets, duration, weight, rest_time, is_completed, order_index) VALUES
(12, 'Izometria w górnej fazie', 5, '30 sekund', '+5kg', 90, false, 5);

-- Insert sections for TRENING 4
INSERT INTO workout_sections (id, workout_id, title, description, order_index) VALUES
(14, 4, 'Rozgrzewka - MOBILNOŚĆ + AKTYWACJA', NULL, 1),
(15, 4, 'PIEKIELNA PIĄTKA', 'Wykonaj 3 obwody bez przerwy', 2),
(16, 4, 'Część główna', NULL, 3),
(17, 4, 'EMOM', NULL, 4),
(18, 4, 'KORPUS', 'Obwód wykonujesz 3 razy bez przerwy', 5);

-- Insert exercises for TRENING 4 - EMOM
INSERT INTO exercises (section_id, name, duration, description, is_completed, order_index) VALUES
(17, 'EMOM 15 minut NACHWYT', '15 minut', 'Wykonaj 3 na minutę', false, 1),
(17, 'EMOM 10 minut DIPY', '10 minut', 'Wykonaj 6 na minutę', false, 2),
(17, 'EMOM 15 minut PODCHWYT', '15 minut', 'Wykonaj 3 na minutę', false, 3),
(17, 'EMOM 10 minut POMPKI + SCYZORYKI', '10 minut', 'Wykonaj 8 pompek + 5 scyzoryków na minutę', false, 4);

-- Insert sections for TRENING 5
INSERT INTO workout_sections (id, workout_id, title, description, order_index) VALUES
(19, 5, 'Rozgrzewka - MOBILNOŚĆ + AKTYWACJA', NULL, 1),
(20, 5, 'PIEKIELNA PIĄTKA', 'Wykonaj 3 obwody bez przerwy', 2),
(21, 5, 'Część główna', NULL, 3),
(22, 5, 'KORPUS', 'Obwód wykonujesz 3 razy bez przerwy', 4);

-- Insert exercises for TRENING 5 - Część główna
INSERT INTO exercises (section_id, name, sets, reps, weight, rest_time, notes, is_completed, order_index) VALUES
(21, 'Pistolety z asekuracją', 5, '10', '+5kg', 90, 'Druga noga idzie do tyłu jak do niskiego wykroku.', false, 1),
(21, 'Rumuński Martwy na 1 nodze', 3, '20 na nogę', '+5kg do ręki', 90, 'Jeżeli po ćwiczeniu odczuwasz odcinek lędżwiowy to oznacza, że była zła technika. Trzymaj brzuch, wykonuj ruch z biodra (hip hinge)', false, 2),
(21, 'Split squat', 3, '15', '+8kg do ręki', 90, NULL, false, 3),
(21, 'Przyciąganie pięt leżąc na plecach', 4, '12', NULL, 90, 'Pod pięty połóż ręcznik.', false, 4),
(21, 'Hip thrust na 1 nogę', 4, '15 na nogę', NULL, 90, 'Połóż się na ławcę odcinkiem piersiowym.', false, 5),
(21, 'Cossack squat', 3, '15 na nogę', '+12kg', 90, NULL, false, 6),
(21, 'Odwodzenie nogi stojąc (z mini power band)', 3, '15 na nogę', NULL, 90, 'Ćwiczenie wykonuje się w pozycji Hip hinge', false, 7);

INSERT INTO exercises (section_id, name, sets, duration, is_completed, order_index) VALUES
(21, 'Krzesełko', 3, '80 sekund', false, 8); 