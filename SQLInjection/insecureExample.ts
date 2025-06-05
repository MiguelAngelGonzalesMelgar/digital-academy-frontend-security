import express from 'express';
import mysql from 'mysql2';

const app = express();
app.use(express.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'testdb'
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // 🚨 Vulnerable to SQL Injection!
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  connection.query(query, (err, results) => {
    if (err) return res.status(500).send('Database error');
    if (results.length > 0) {
      res.send('Login successful!');
    } else {
      res.status(401).send('Invalid credentials');
    }
  });
});

app.listen(3000, () => console.log('Server running on port 3000'));


/**
 * {
  "username": "' OR 1=1 --",
  "password": "irrelevant"
}
 * 
 * SELECT * FROM users WHERE username = '' OR 1=1 --' AND password = 'irrelevant'
 * 
 * 
 * This query always returns true, potentially granting unauthorized access
 */