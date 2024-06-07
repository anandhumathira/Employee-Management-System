const mysql = require('mysql');

function createConnection() {
  const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'registration',
  });

  db.connect((err) => {
    if (err) {
      console.error('Unable to connect to MySQL:', err);
    } else {
      console.log('Connected to MySQL');
    }
  });

  return db;
}

module.exports = createConnection;