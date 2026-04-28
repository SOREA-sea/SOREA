-- clean
DROP DATABASE IF EXISTS Hello_Helli;

CREATE DATABASE If NOT EXISTS Hello_Helli;
USE Hello_Helli;


-- Table ambassadors
CREATE TABLE ambassadors (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  mot_de_passe TEXT NOT NULL,
  telephone VARCHAR(20),
  photo_profil_url VARCHAR(255),
  photo_profil_blob LONGBLOB,
  photo_carte_id_url VARCHAR(255),
  photo_carte_id_blob LONGBLOB,
  description TEXT,
  charte VARCHAR(255),
  reservations BOOLEAN DEFAULT FALSE,
  role VARCHAR(50),
  deuxfa_secret VARCHAR(255),
  deuxfa_enabled BOOLEAN DEFAULT FALSE
);

-- Table talents
CREATE TABLE talents (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  mot_de_passe TEXT NOT NULL,
  telephone VARCHAR(20),
  photo_profil_url VARCHAR(255),
  photo_profil_blob LONGBLOB,
  banniere_url VARCHAR(255),
  banniere_blob LONGBLOB,
  video_intro_url VARCHAR(255),
  video_intro_blob LONGBLOB,
  description TEXT,
  charte VARCHAR(255),
  reseaux TEXT,
  photo_carte_id_url VARCHAR(255),
  photo_carte_id_blob LONGBLOB,
  ok_reservations BOOLEAN DEFAULT FALSE,
  domaine VARCHAR(100),
  casier_judiciaire BOOLEAN DEFAULT FALSE,
  casier_judiciaire_url VARCHAR(255),
  numero_siret VARCHAR(20),
  rib_url VARCHAR(255),
  photo_portrait_url VARCHAR(255),
  assurance_url VARCHAR(255),
  kbis_url VARCHAR(255),
  diplomes_url JSON,
  portfolio_url VARCHAR(255),
  accord_rgpd BOOLEAN DEFAULT FALSE,
  role VARCHAR(50),
  deuxfa_secret VARCHAR(255),
  deuxfa_enabled BOOLEAN DEFAULT FALSE,
  note DECIMAL(2,1),
  lieu INT,
  CONSTRAINT chk_talents_note CHECK (note BETWEEN 0 AND 5)
);

-- Table workshops
CREATE TABLE workshops (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(255) NOT NULL,
  description TEXT,
  date DATE,
  lieu VARCHAR(255),
  duree TIME,
  nom_talent VARCHAR(100),
  image JSON,
  prix DECIMAL(10,2),
  nombre_participants_min INT DEFAULT 0,
  nombre_participants_max INT DEFAULT 0,
  domaine VARCHAR(100),
  talent_id INT UNSIGNED NOT NULL,
  note DECIMAL(2,1),
  CONSTRAINT chk_workshops_note CHECK (note BETWEEN 0 AND 5),
  FOREIGN KEY (talent_id) REFERENCES talents(id) ON DELETE CASCADE
);

-- Table participants
CREATE TABLE participants (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100),
  email VARCHAR(100),
  telephone VARCHAR(20),
  workshop_id INT UNSIGNED NOT NULL,
  ambassador_id INT UNSIGNED NOT NULL,
  FOREIGN KEY (workshop_id) REFERENCES workshops(id),
  FOREIGN KEY (ambassador_id) REFERENCES ambassadors(id)
);

-- Table video_likes
CREATE TABLE video_likes (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  ambassador_id INT UNSIGNED NOT NULL,
  talent_id INT UNSIGNED NOT NULL,
  participant_id INT UNSIGNED NOT NULL,
  video_url TEXT,
  date_like TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ambassador_id) REFERENCES ambassadors(id) ON DELETE CASCADE,
  FOREIGN KEY (talent_id) REFERENCES talents(id) ON DELETE CASCADE,
  FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE
);

-- Table video_saves
CREATE TABLE video_saves (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  participant_id INT UNSIGNED NOT NULL,
  ambassador_id INT UNSIGNED NOT NULL,
  talent_id INT UNSIGNED NOT NULL,
  video_url TEXT NOT NULL,
  date_sauvegarde TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ambassador_id) REFERENCES ambassadors(id) ON DELETE CASCADE,
  FOREIGN KEY (talent_id) REFERENCES talents(id) ON DELETE CASCADE,
  FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE
);

-- Table video_comments
CREATE TABLE video_comments (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  ambassador_id INT UNSIGNED NOT NULL,
  talent_id INT UNSIGNED NOT NULL,
  participant_id INT UNSIGNED NOT NULL,
  video_url TEXT,
  contenu TEXT NOT NULL,
  date_commentaire TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE,
  FOREIGN KEY (ambassador_id) REFERENCES ambassadors(id) ON DELETE CASCADE,
  FOREIGN KEY (talent_id) REFERENCES talents(id) ON DELETE CASCADE
);

-- Table talent_favorites
CREATE TABLE talent_favorites (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  ambassador_id INT UNSIGNED NOT NULL,
  talent_id INT UNSIGNED NOT NULL,
  participant_id INT UNSIGNED NOT NULL,
  date_favori TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ambassador_id) REFERENCES ambassadors(id) ON DELETE CASCADE,
  FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE,
  FOREIGN KEY (talent_id) REFERENCES talents(id) ON DELETE CASCADE
);

-- Table workshop_likes
CREATE TABLE workshop_likes (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  ambassador_id INT UNSIGNED NOT NULL,
  talent_id INT UNSIGNED NOT NULL,
  participant_id INT UNSIGNED NOT NULL,
  workshop_id INT UNSIGNED NOT NULL,
  date_like TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ambassador_id) REFERENCES ambassadors(id) ON DELETE CASCADE,
  FOREIGN KEY (talent_id) REFERENCES talents(id) ON DELETE CASCADE,
  FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE,
  FOREIGN KEY (workshop_id) REFERENCES workshops(id) ON DELETE CASCADE
);

-- Table workshop_favorites
CREATE TABLE workshop_favorites (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  ambassador_id INT UNSIGNED NOT NULL,
  talent_id INT UNSIGNED NOT NULL,
  participant_id INT UNSIGNED NOT NULL,
  workshop_id INT UNSIGNED NOT NULL,
  date_favori TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ambassador_id) REFERENCES ambassadors(id) ON DELETE CASCADE,
  FOREIGN KEY (talent_id) REFERENCES talents(id) ON DELETE CASCADE,
  FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE,
  FOREIGN KEY (workshop_id) REFERENCES workshops(id) ON DELETE CASCADE
);

-- Table workshops_comments
CREATE TABLE workshops_comments (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  workshop_id INT UNSIGNED NOT NULL,
  participant_id INT UNSIGNED,
  ambassador_id INT UNSIGNED,
  note DECIMAL(2,1) CHECK (note >= 0 AND note <= 5),
  contenu TEXT NOT NULL,
  date_commentaire TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  image_url VARCHAR(255),
  FOREIGN KEY (workshop_id) REFERENCES workshops(id) ON DELETE CASCADE,

  FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE,
  FOREIGN KEY (ambassador_id) REFERENCES ambassadors(id) ON DELETE CASCADE,
  CHECK (
    (participant_id IS NOT NULL AND ambassador_id IS NULL) OR
    (participant_id IS NULL AND ambassador_id IS NOT NULL)
  )
);

-- Table contacts
CREATE TABLE contacts (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  objets_mail VARCHAR(255),
  numero_tel VARCHAR(20),
  message TEXT,
  date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table payements
CREATE TABLE payments (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  ambassador_id INT UNSIGNED NOT NULL,
  talent_id INT UNSIGNED NOT NULL,
  participant_id INT UNSIGNED NOT NULL,
  montant NUMERIC(10, 2) NOT NULL,
  montant_tva NUMERIC(10, 2) DEFAULT 0.00,
  total_ttc NUMERIC(10, 2) GENERATED ALWAYS AS (montant + montant_tva) STORED,
  moyen_paiement VARCHAR(50),
  statut_paiement VARCHAR(50),
  date_paiement TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
  transaction_id VARCHAR(255),
  plateforme VARCHAR(50),
  url_facture_pdf TEXT,
  -- remboursement_possible BOOLEAN GENERATED ALWAYS AS (TIMESTAMPDIFF(HOUR, date_paiement, NOW()) < 48) VIRTUAL,
  FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE,
  FOREIGN KEY (ambassador_id) REFERENCES ambassadors(id) ON DELETE CASCADE,
  FOREIGN KEY (talent_id) REFERENCES talents(id) ON DELETE CASCADE
);

-- Table remboursement
CREATE TABLE refunds (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  payment_id INT UNSIGNED NOT NULL,
  montant_rembourse NUMERIC(10,2) NOT NULL,
  date_remboursement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  raison TEXT,
  FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE
);

-- Table commentaires site
CREATE TABLE site_comments (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  contenu TEXT NOT NULL,
  date_commentaire TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  participant_id INT UNSIGNED NOT NULL,
  ambassador_id INT UNSIGNED NOT NULL,
  talent_id INT UNSIGNED NOT NULL,
  FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE,
  FOREIGN KEY (ambassador_id) REFERENCES ambassadors(id) ON DELETE CASCADE,
  FOREIGN KEY (talent_id) REFERENCES talents(id) ON DELETE CASCADE
);

-- Table commentaires ateliers
CREATE TABLE post_comments (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  contenu TEXT NOT NULL,
  date_commentaire TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  participant_id INT UNSIGNED NOT NULL,
  ambassador_id INT UNSIGNED NOT NULL,
  talent_id INT UNSIGNED NOT NULL,
  FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE,
  FOREIGN KEY (ambassador_id) REFERENCES ambassadors(id) ON DELETE CASCADE,
  FOREIGN KEY (talent_id) REFERENCES talents(id) ON DELETE CASCADE
  -- Ajoute FOREIGN KEY (post_id) REFERENCES posts(id) si tu as une table `posts`
);

CREATE TABLE workshops_ratings (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    workshop_id INT UNSIGNED NOT NULL,
    note DECIMAL(2,1),
    CONSTRAINT chk_workshops_ratings_note CHECK (note BETWEEN 0 AND 5),
    FOREIGN KEY (workshop_id) REFERENCES workshops(id)
);

CREATE TABLE talents_ratings (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    talent_id INT UNSIGNED NOT NULL,
    note DECIMAL(2,1),
    CONSTRAINT chk_talents_ratings_note CHECK (note BETWEEN 0 AND 5),
    FOREIGN KEY (talent_id) REFERENCES talents(id)
);

CREATE TABLE workshops_booking (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  workshop_id INT UNSIGNED NOT NULL,
  ambassador_id INT UNSIGNED NOT NULL,
  ambassador_name VARCHAR(100),
  ambassador_email VARCHAR(100),
  FOREIGN KEY (workshop_id) REFERENCES workshops(id),
  FOREIGN KEY (ambassador_id) REFERENCES ambassadors(id)
);

CREATE TABLE horaires (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  jour ENUM('Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'),
  heure_debut TIME,
  heure_fin TIME,
  workshop_id INT UNSIGNED NOT NULL,
  status BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (workshop_id) REFERENCES workshops(id) ON DELETE CASCADE
);

-- Messagerie

CREATE TABLE tchat (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user1_id INT UNSIGNED NOT NULL,
  user1_type ENUM('talent','ambassador') NOT NULL,
  user2_id INT UNSIGNED NOT NULL,
  user2_type ENUM('talent','ambassador') NOT NULL,
  workshop_id INT UNSIGNED NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user1_id, user1_type, user2_id, user2_type, workshop_id),
  FOREIGN KEY (workshop_id) REFERENCES workshops(id) ON DELETE CASCADE
);


CREATE TABLE messages (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  tchat_id INT UNSIGNED NOT NULL,
  sender_id INT UNSIGNED NOT NULL,
  sender_type ENUM('talent','ambassador') NOT NULL,
  content TEXT NOT NULL,
  send_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tchat_id) REFERENCES tchat(id) ON DELETE CASCADE
)
