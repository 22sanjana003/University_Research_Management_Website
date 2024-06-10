const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'admin',
  password: 'admin',
  database: 'research_management'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

// Specify the route for serving data
app.get('/research', (req, res) => {

   const department = req.query.department;
  const status = req.query.status;

  const sql = 'SELECT R_Name,Investigator,Fund_agency,Year,Fund from research where DNo=? and Status=?';
  db.query(sql,[department, status],(err, result) => {
    if (err) {
      throw err;
    }
    res.json(result);
  });
});

app.get('/awardees', (req, res) => {

  const department = req.query.department;
  const category = req.query.category;
  const year=req.query.year;

  const sql = 'SELECT A_Name,Title,Pub_details from awardees where DNo=? and category=? and year=?';
  db.query(sql,[department,category,year],(err, result) => {
    if (err) {
      throw err;
    }
    res.json(result);
  });
});

app.post('/login', (req, res) => {
    const {username,projectid,password} = req.body;
    const sql = `SELECT * FROM login WHERE username = '${username}' AND projectid = '${projectid}' AND password = '${password}' `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error querying database: ', err);
            res.status(500).send('Internal server error');
        } 
        else {
            if (results.length > 0) 
            {
                // Redirect to a new page on successful login
                res.redirect(`/user-profile.html?projectid=${projectid}`);
            } 
            else 
            {
               res.status(401).send('Invalid credentials');
            }
        }
    });
});

app.get('/user-profile/:projectid', (req, res) => {
  const projectid = req.params.projectid;

  const sql = 'SELECT department,title,description,students from profile where project_id=?';
  db.query(sql, [projectid], (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length>0) {
      const {department,title,description,students} = result[0];
      
    
      const profileData = {
        department,
        title,
        description,
        students
      };
      
      res.json(profileData);
    } else {
      res.status(404).send('Profile not found');
    }
  });
});

app.put('/user-profile/:projectid', (req, res) => {
    const projectid = req.params.projectid;
    const { department, title, description, students } = req.body;
    const sql = 'UPDATE profile SET department = ?, title = ?, description = ?, students = ? WHERE project_id = ?';
    db.query(sql, [department, title, description, students, projectid], (err, result) => {
        if (err) {
            console.error('Error updating profile:', err);
            res.status(500).send('Internal server error');
        } else {
            res.json({ message: 'Profile updated successfully' });
        }
    });
});

// Serve front.html when accessing the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'front.html'));
});

app.use(express.static(__dirname));
app.listen(port,() => {
  console.log(`Server running on port ${port}`);
});