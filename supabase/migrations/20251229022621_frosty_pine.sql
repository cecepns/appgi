-- APPGI Company Profile Database Structure

CREATE DATABASE IF NOT EXISTS apgi_db;
USE apgi_db;

-- Admin table for authentication
CREATE TABLE admin (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Organization profile information
CREATE TABLE profile_organisasi (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama_organisasi VARCHAR(200) NOT NULL DEFAULT 'APPGI (Asosiasi Perusahaan Pemboran Minyak, Gas, dan Panas Bumi Indonesia)',
  tagline TEXT,
  deskripsi_singkat TEXT,
  deskripsi_lengkap TEXT,
  tahun_berdiri DATE DEFAULT '2014-10-10',
  bidang_usaha TEXT DEFAULT 'Pemboran Minyak, Gas, dan Panas Bumi',
  logo_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Vision and Mission
CREATE TABLE visi_misi (
  id INT PRIMARY KEY AUTO_INCREMENT,
  visi TEXT NOT NULL DEFAULT 'Menjadi wadah organisasi untuk menciptakan para profesional yang berkualitas dan terpercaya',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Mission items (dynamic list)
CREATE TABLE misi (
  id INT PRIMARY KEY AUTO_INCREMENT,
  visi_misi_id INT,
  urutan INT NOT NULL,
  teks_misi TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (visi_misi_id) REFERENCES visi_misi(id) ON DELETE CASCADE
);

-- Organization structure
CREATE TABLE struktur_organisasi (
  id INT PRIMARY KEY AUTO_INCREMENT,
  periode VARCHAR(20) DEFAULT '2024 - 2029',
  deskripsi TEXT,
  gambar_bagan VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Contact information
CREATE TABLE kontak (
  id INT PRIMARY KEY AUTO_INCREMENT,
  alamat TEXT DEFAULT 'Jl. Gandaria III No. 5, Jakarta Selatan',
  email VARCHAR(100),
  telepon VARCHAR(20),
  whatsapp VARCHAR(20),
  google_maps_url TEXT DEFAULT 'https://maps.app.goo.gl/Xo6Wf8hbzD5cb52p9',
  google_maps_embed TEXT,
  jam_operasional TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Website general information
CREATE TABLE website_info (
  id INT PRIMARY KEY AUTO_INCREMENT,
  site_title VARCHAR(200) DEFAULT 'APPGI - Asosiasi Perusahaan Pemboran Minyak, Gas, dan Panas Bumi Indonesia',
  site_description TEXT DEFAULT 'Website resmi APPGI - Asosiasi Perusahaan Pemboran Minyak, Gas, dan Panas Bumi Indonesia',
  favicon_url VARCHAR(255),
  hero_banner_url VARCHAR(255),
  footer_copyright TEXT DEFAULT 'Copyright © 2024 APPGI. All rights reserved.',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default data
INSERT INTO admin (username, password, email) VALUES 
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@apgi.or.id');

INSERT INTO profile_organisasi (nama_organisasi, tagline, deskripsi_singkat, deskripsi_lengkap, bidang_usaha) VALUES 
('APPGI (Asosiasi Perusahaan Pemboran Minyak, Gas, dan Panas Bumi Indonesia)', 
'Membangun Profesionalitas dalam Industri Pemboran Indonesia',
'APPGI adalah organisasi profesional yang bergerak dalam bidang minyak dan gas bumi minyak, gas, dan panas bumi di Indonesia.',
'Asosiasi Perusahaan Pemboran Minyak, Gas, dan Panas Bumi Indonesia (APPGI) didirikan pada tanggal 10 Oktober 2014. APPGI merupakan wadah bagi para profesional dan perusahaan yang bergerak di bidang minyak dan gas bumi minyak, gas, dan panas bumi untuk meningkatkan kualitas dan profesionalitas industri minyak dan gas bumi di Indonesia.',
'Pemboran Minyak, Gas, dan Panas Bumi');

INSERT INTO visi_misi (visi) VALUES 
('Menjadi wadah organisasi untuk menciptakan para profesional yang berkualitas dan terpercaya');

INSERT INTO misi (visi_misi_id, urutan, teks_misi) VALUES 
(1, 1, 'Meningkatkan profesionalitas anggota dalam bidang minyak dan gas bumi minyak, gas, dan panas bumi'),
(1, 2, 'Membangun jaringan kerjasama yang kuat antar anggota dan stakeholder industri'),
(1, 3, 'Mengembangkan standar teknis dan keselamatan kerja dalam industri minyak dan gas bumi'),
(1, 4, 'Menyediakan platform pertukaran knowledge dan teknologi terkini'),
(1, 5, 'Mendukung pengembangan sumber daya manusia Indonesia di bidang minyak dan gas bumi');

INSERT INTO struktur_organisasi (periode, deskripsi, is_active) VALUES 
('2024 - 2029', 'Struktur organisasi APPGI periode 2024-2029 yang terdiri dari berbagai divisi dan departemen untuk menjalankan visi dan misi organisasi.', TRUE);

INSERT INTO kontak (alamat, email, telepon, whatsapp, google_maps_embed, jam_operasional) VALUES 
('Jl. Gandaria III No. 5, Jakarta Selatan 12140', 
'info@apgi.or.id', 
'+62 21 7395 8899', 
'+62 812 3456 7890',
'<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.7420000000003!2d106.79167!3d-6.2583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTUnMzAuMCJTIDEwNsKwNDcnMzAuMCJF!5e0!3m2!1sen!2sid!4v1623456789012!5m2!1sen!2sid" width="100%" height="300" style="border:0;" allowfullscreen="" loading="lazy"></iframe>',
'Senin - Jumat: 08:00 - 17:00 WIB');

INSERT INTO website_info (site_title, site_description, footer_copyright) VALUES 
('APPGI - Asosiasi Perusahaan Pemboran Minyak, Gas, dan Panas Bumi Indonesia',
'Website resmi APPGI - Asosiasi Perusahaan Pemboran Minyak, Gas, dan Panas Bumi Indonesia. Membangun profesionalitas dalam industri minyak dan gas bumi Indonesia.',
'Copyright © 2024 APPGI. All rights reserved.');