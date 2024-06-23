const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const app = express();
const port = 3000;

// Set up MySQL connection
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'csit128_project',
});

con.connect(err => {
  if (err) throw err;
  console.log('Connected to the database');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Serve HTML file
app.get('/add-recipe', (req, res) => {
  fs.readFile('public/addRecipePage.html', (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.write('Error loading the page');
      return res.end();
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(data);
    res.end();
  });
});

// Handle form submission
app.post('/add-recipe', upload.single('img'), (req, res) => {
  const { name, tags, cuisine, recipeBody } = req.body;
  const recipeImage = req.file ? req.file.filename : '';

  const sql = 'INSERT INTO recipes (recipe_name, recipe_content, recipe_image, recipe_tag1, recipe_tag2, recipe_user) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [name, recipeBody, recipeImage, tags, cuisine, 'user']; // Replace 'user' with actual user data if available

  con.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error adding recipe:', err.message);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.write('Error adding recipe');
      return res.end();
    }

    console.log('Recipe added:', result);
    fs.readFile('public/addRecipePage.html', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.write('Error loading the page');
        return res.end();
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(data);
      res.write('<script>document.getElementById("record_added").innerHTML = "The recipe has been added successfully";</script>');
      res.end();
    });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
