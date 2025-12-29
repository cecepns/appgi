/* eslint-env node */
/* global require, __dirname */
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'apgi_jwt_secret_key_2024';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if not exists
const uploadsDir = path.join(__dirname, 'uploads-apgi');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files
app.use('/uploads', express.static(uploadsDir));

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'apgi_db'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Helper function to safely delete old image files
const deleteOldImage = (imageUrl) => {
  if (!imageUrl) return;
  
  // Convert URL path to file system path
  // If imageUrl starts with /uploads/, remove it and use the filename directly
  let filePath;
  if (imageUrl.startsWith('/uploads/')) {
    const filename = imageUrl.replace('/uploads/', '');
    filePath = path.join(uploadsDir, filename);
  } else {
    filePath = path.join(uploadsDir, path.basename(imageUrl));
  }

  // Check if file exists and delete it
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error deleting old image file: ${filePath}`, err);
      } else {
        console.log(`Successfully deleted old image file: ${filePath}`);
      }
    });
  }
};

// JWT middleware for admin authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// ===== PUBLIC API ROUTES =====

// Get profile organisasi
app.get('/api/profile', (req, res) => {
  const query = 'SELECT * FROM profile_organisasi LIMIT 1';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results[0] || {});
  });
});

// Get visi misi
app.get('/api/visi-misi', (req, res) => {
  // First, get the visi_misi data
  const visiQuery = 'SELECT * FROM visi_misi LIMIT 1';
  
  db.query(visiQuery, (err, visiResults) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (visiResults.length === 0) {
      return res.json({});
    }
    
    const visiMisi = visiResults[0];
    const visiMisiId = visiMisi.id;
    
    // Then, get the misi list
    const misiQuery = 'SELECT id, urutan, teks_misi FROM misi WHERE visi_misi_id = ? AND is_active = 1 ORDER BY urutan';
    
    db.query(misiQuery, [visiMisiId], (err, misiResults) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      // Combine the results
      const result = {
        ...visiMisi,
        misi_list: misiResults || []
      };
      
      res.json(result);
    });
  });
});

// Get struktur organisasi
app.get('/api/struktur', (req, res) => {
  const query = 'SELECT * FROM struktur_organisasi WHERE is_active = 1 LIMIT 1';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results[0] || {});
  });
});

// Get kontak
app.get('/api/kontak', (req, res) => {
  const query = 'SELECT * FROM kontak LIMIT 1';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results[0] || {});
  });
});

// Get website info
app.get('/api/website-info', (req, res) => {
  const query = 'SELECT * FROM website_info LIMIT 1';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results[0] || {});
  });
});

// ===== ADMIN AUTHENTICATION =====

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const query = 'SELECT * FROM admin WHERE username = ?';
  db.query(query, [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const admin = results[0];
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email
      }
    });
  });
});

// Verify admin token
app.get('/api/admin/verify', authenticateToken, (req, res) => {
  res.json({ message: 'Token valid', user: req.user });
});

// ===== ADMIN CRUD ROUTES =====

// Update profile organisasi
app.put('/api/admin/profile', authenticateToken, upload.single('logo'), (req, res) => {
  const { nama_organisasi, tagline, deskripsi_singkat, deskripsi_lengkap, bidang_usaha } = req.body;
  let logo_url = req.body.logo_url;
  let oldLogoUrl = null;

  // Fetch old logo URL before updating
  const selectQuery = 'SELECT logo_url FROM profile_organisasi WHERE id = 1';
  db.query(selectQuery, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      oldLogoUrl = results[0].logo_url;
    }

    if (req.file) {
      logo_url = `/uploads/${req.file.filename}`;
    }

    const updateQuery = `
      UPDATE profile_organisasi 
      SET nama_organisasi = ?, tagline = ?, deskripsi_singkat = ?, 
          deskripsi_lengkap = ?, bidang_usaha = ?, logo_url = ?, updated_at = NOW()
      WHERE id = 1
    `;

    db.query(updateQuery, [nama_organisasi, tagline, deskripsi_singkat, deskripsi_lengkap, bidang_usaha, logo_url], (err) => {
      if (err) {
        // If update fails, delete the newly uploaded file
        if (req.file) {
          const newFilePath = path.join(uploadsDir, req.file.filename);
          if (fs.existsSync(newFilePath)) {
            fs.unlinkSync(newFilePath);
          }
        }
        return res.status(500).json({ error: err.message });
      }

      // Delete old logo file if a new one was uploaded and it's different
      if (req.file && oldLogoUrl && oldLogoUrl !== logo_url) {
        deleteOldImage(oldLogoUrl);
      }

      res.json({ message: 'Profile updated successfully' });
    });
  });
});

// Update visi misi
app.put('/api/admin/visi-misi', authenticateToken, (req, res) => {
  const { visi, misi_list } = req.body;

  // Start transaction
  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Update visi
    const updateVisiQuery = 'UPDATE visi_misi SET visi = ?, updated_at = NOW() WHERE id = 1';
    db.query(updateVisiQuery, [visi], (err) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ error: err.message });
        });
      }

      // Delete existing misi
      const deleteMisiQuery = 'DELETE FROM misi WHERE visi_misi_id = 1';
      db.query(deleteMisiQuery, (err) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ error: err.message });
          });
        }

        // Insert new misi
        if (misi_list && misi_list.length > 0) {
          const misiValues = misi_list.map((misi, index) => [1, index + 1, misi.teks_misi]);
          const insertMisiQuery = 'INSERT INTO misi (visi_misi_id, urutan, teks_misi) VALUES ?';
          
          db.query(insertMisiQuery, [misiValues], (err) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json({ error: err.message });
              });
            }

            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  res.status(500).json({ error: err.message });
                });
              }
              res.json({ message: 'Visi Misi updated successfully' });
            });
          });
        } else {
          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json({ error: err.message });
              });
            }
            res.json({ message: 'Visi Misi updated successfully' });
          });
        }
      });
    });
  });
});

// Update struktur organisasi
app.put('/api/admin/struktur', authenticateToken, upload.single('gambar_bagan'), (req, res) => {
  const { periode, deskripsi } = req.body;
  let gambar_bagan = req.body.gambar_bagan;
  let oldGambarBagan = null;

  // Fetch old gambar_bagan URL before updating
  const selectQuery = 'SELECT gambar_bagan FROM struktur_organisasi WHERE id = 1';
  db.query(selectQuery, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      oldGambarBagan = results[0].gambar_bagan;
    }

    if (req.file) {
      gambar_bagan = `/uploads/${req.file.filename}`;
    }

    const updateQuery = `
      UPDATE struktur_organisasi 
      SET periode = ?, deskripsi = ?, gambar_bagan = ?, updated_at = NOW()
      WHERE id = 1
    `;

    db.query(updateQuery, [periode, deskripsi, gambar_bagan], (err) => {
      if (err) {
        // If update fails, delete the newly uploaded file
        if (req.file) {
          const newFilePath = path.join(uploadsDir, req.file.filename);
          if (fs.existsSync(newFilePath)) {
            fs.unlinkSync(newFilePath);
          }
        }
        return res.status(500).json({ error: err.message });
      }

      // Delete old gambar_bagan file if a new one was uploaded and it's different
      if (req.file && oldGambarBagan && oldGambarBagan !== gambar_bagan) {
        deleteOldImage(oldGambarBagan);
      }

      res.json({ message: 'Struktur organisasi updated successfully' });
    });
  });
});

// Update kontak
app.put('/api/admin/kontak', authenticateToken, (req, res) => {
  const { alamat, email, telepon, whatsapp, google_maps_url, google_maps_embed, jam_operasional } = req.body;

  const query = `
    UPDATE kontak 
    SET alamat = ?, email = ?, telepon = ?, whatsapp = ?, 
        google_maps_url = ?, google_maps_embed = ?, jam_operasional = ?, updated_at = NOW()
    WHERE id = 1
  `;

  db.query(query, [alamat, email, telepon, whatsapp, google_maps_url, google_maps_embed, jam_operasional], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Kontak updated successfully' });
  });
});

// Update website info
app.put('/api/admin/website-info', authenticateToken, upload.fields([
  { name: 'favicon', maxCount: 1 },
  { name: 'hero_banner', maxCount: 1 }
]), (req, res) => {
  const { site_title, site_description, footer_copyright } = req.body;
  let favicon_url = req.body.favicon_url;
  let hero_banner_url = req.body.hero_banner_url;
  let oldFaviconUrl = null;
  let oldHeroBannerUrl = null;

  // Fetch old image URLs before updating
  const selectQuery = 'SELECT favicon_url, hero_banner_url FROM website_info WHERE id = 1';
  db.query(selectQuery, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      oldFaviconUrl = results[0].favicon_url;
      oldHeroBannerUrl = results[0].hero_banner_url;
    }

    if (req.files) {
      if (req.files.favicon) {
        favicon_url = `/uploads/${req.files.favicon[0].filename}`;
      }
      if (req.files.hero_banner) {
        hero_banner_url = `/uploads/${req.files.hero_banner[0].filename}`;
      }
    }

    const updateQuery = `
      UPDATE website_info 
      SET site_title = ?, site_description = ?, favicon_url = ?, 
          hero_banner_url = ?, footer_copyright = ?, updated_at = NOW()
      WHERE id = 1
    `;

    db.query(updateQuery, [site_title, site_description, favicon_url, hero_banner_url, footer_copyright], (err) => {
      if (err) {
        // If update fails, delete the newly uploaded files
        if (req.files) {
          if (req.files.favicon) {
            const newFilePath = path.join(uploadsDir, req.files.favicon[0].filename);
            if (fs.existsSync(newFilePath)) {
              fs.unlinkSync(newFilePath);
            }
          }
          if (req.files.hero_banner) {
            const newFilePath = path.join(uploadsDir, req.files.hero_banner[0].filename);
            if (fs.existsSync(newFilePath)) {
              fs.unlinkSync(newFilePath);
            }
          }
        }
        return res.status(500).json({ error: err.message });
      }

      // Delete old favicon file if a new one was uploaded and it's different
      if (req.files && req.files.favicon && oldFaviconUrl && oldFaviconUrl !== favicon_url) {
        deleteOldImage(oldFaviconUrl);
      }

      // Delete old hero_banner file if a new one was uploaded and it's different
      if (req.files && req.files.hero_banner && oldHeroBannerUrl && oldHeroBannerUrl !== hero_banner_url) {
        deleteOldImage(oldHeroBannerUrl);
      }

      res.json({ message: 'Website info updated successfully' });
    });
  });
});

// ===== ERROR HANDLING =====
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, _next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Maximum 5MB allowed.' });
    }
  }
  res.status(500).json({ error: error.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`APPGI Backend server running on port ${PORT}`);
});