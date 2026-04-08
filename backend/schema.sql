CREATE DATABASE IF NOT EXISTS dental_clinic;
USE dental_clinic;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('patient', 'doctor', 'clinic') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS treatments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) UNIQUE NOT NULL,
  rate DECIMAL(10,2) NULL,
  active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO treatments (name, rate, active) VALUES
('Dental Exams and Cleaning', NULL, 1),
('Dental Filings', NULL, 1),
('Root Canal', NULL, 1),
('Crowns and Bridges', NULL, 1),
('Dentures', NULL, 1),
('Dental Implants', NULL, 1),
('Scaning', NULL, 1),
('Teeth Whitening', NULL, 1),
('Dental Veeners', NULL, 1),
('Braces and Aligners', NULL, 1),
('Tooth Extraction', NULL, 1),
('Periodontal Treatment', NULL, 1);

CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  clinic_id INT NOT NULL,
  treatment_id INT NOT NULL,
  treatment_rate DECIMAL(10,2) NULL,
  appointment_time DATETIME NOT NULL,
  reason TEXT,
  patient_notes TEXT,
  status VARCHAR(50) DEFAULT 'scheduled',
  virtual_requested TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users(id),
  FOREIGN KEY (doctor_id) REFERENCES users(id),
  FOREIGN KEY (clinic_id) REFERENCES users(id),
  FOREIGN KEY (treatment_id) REFERENCES treatments(id)
);

CREATE TABLE IF NOT EXISTS prescriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  appointment_id INT NOT NULL,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  medication_name VARCHAR(150) NOT NULL,
  dosage VARCHAR(150) NOT NULL,
  instructions TEXT,
  issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id),
  FOREIGN KEY (patient_id) REFERENCES users(id),
  FOREIGN KEY (doctor_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  revoked_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_token_hash (token_hash),
  INDEX idx_refresh_user (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
