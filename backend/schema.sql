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

CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  clinic_id INT NOT NULL,
  appointment_time DATETIME NOT NULL,
  reason TEXT,
  patient_notes TEXT,
  status VARCHAR(50) DEFAULT 'scheduled',
  virtual_requested TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users(id),
  FOREIGN KEY (doctor_id) REFERENCES users(id),
  FOREIGN KEY (clinic_id) REFERENCES users(id)
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
