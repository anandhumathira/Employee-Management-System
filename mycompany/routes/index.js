var express = require('express');
var router = express.Router();
const createConnection = require('../db');
const db = createConnection();
const session=require('express-session');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/head', function(req, res, next) {
  res.render('header', { title: 'Express' });
});

router.get('/com', function(req, res, next) {
  res.render('company', { title: 'Express' });
});
router.get('/emp', function(req, res, next) {
  res.render('employee', { title: 'Express' });
});

router.get('/comlog', function(req, res, next) {
  res.render('companylog', { title: 'Express' });
});
router.get('/emplog', function(req, res, next) {
  res.render('employeelog', { title: 'Express' });
});

router.get('/comhome', function(req, res, next) {
  res.render('companyhome', { title: 'Express' });
});
router.get('/emphome', function(req, res, next) {
  const userId=req.session.userId;
  const sql= "select * from employee where emp_id=?;"
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Error fetching user data:', err);
      res.send('Error fetching user data.');
    } else {
      res.render('employeehome', { emp: result[0] });
    }
  });
 
});


router.get('/pro/:id', function(req, res, next) {
  const userId=req.session.userId;
  const sql= "select * from employee where emp_id=?;"
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Error fetching user data:', err);
      res.send('Error fetching user data.');
    } else {
      res.render('profile', { emp: result[0] });
    }
  });
 
});

router.get('/attendet/:id', function(req, res, next) {
  const userId=req.session.userId;
  const sql= "select * from attendence where emp_id=?;"
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Error fetching user data:', err);
      res.send('Error fetching user data.');
    } else {
      res.render('attendencedetail', { emp: result[0] });
    }
  });
 
});

router.get('/sala/:id', function(req, res, next) {
  const userId=req.session.userId;
  const sql= "select * from salary where emp_id=?;"
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Error fetching user data:', err);
      res.send('Error fetching user data.');
    } else {
      res.render('salaryview2', { emp: result[0] });
    }
  });
 
});


// router.get('/pro', function(req, res, next) {
//   res.render('profile', { title: 'Express' });
// });

router.get('/emp', function(req, res, next) {
  res.render('employee', { title: 'Express' });
});


router.get('/salar/:id', (req, res) => {
  const userId = req.params.id;
  const sql = 'SELECT * FROM employee WHERE emp_id = ?';

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Error fetching user data:', err);
      res.send('Error fetching user data.');
    } else {
      res.render('salaryform', { user: result[0] });
    }
  });
});


router.get('/attend/:id', (req, res) => {
  const userId = req.params.id;
  const sql = 'SELECT * FROM employee WHERE emp_id = ?';

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Error fetching user data:', err);
      res.send('Error fetching user data.');
    } else {
      res.render('attendence', { user: result[0] });
    }
  });
});


router.post('/add', (req, res) => {
  const {name,district,city,contact,email,password} = req.body;

  const sql = 'INSERT INTO company (company_name,company_district,company_city,company_contact,company_email,company_password) VALUES (?, ? , ? , ?, ?, ?)';
  db.query(sql, [name,district,city,contact,email,password], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.send('Error inserting data.');
    } else {
      console.log('Data inserted successfully');
      res.redirect('/');
    }
  });
});

router.post('/emp', (req, res) => {
  const {name,designation,joinedDate,dob,contact,email,password} = req.body;

  const sql = 'INSERT INTO employee (name,designation,join_date,date_birth,contact_no,email,password) VALUES (?, ? , ? , ?, ?, ?,?)';
  db.query(sql, [name,designation,joinedDate,dob,contact,email,password], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.send('Error inserting data.');
    } else {
      console.log('Data inserted successfully');
      res.redirect('/');
    }
  });
});


router.post('/cologin', (req, res) => {
  const {email,password} = req.body;
  const sql = 'SELECT * FROM company WHERE company_email= ? AND company_password = ?';

  db.query(sql, [email,password], (err, results) => {
    if (err) {
      console.error('Error authenticating user:', err);
      res.send('Error authenticating user.');
    } else if (results.length > 0) {
      // Authentication successful, create a session
      req.session.userId = results[0].company_id;
      res.redirect('/comhome');
    } else {
      res.render('/comlog', { errorMessage: 'Invalid username or password' });
    }
  });
});


router.post('/emlogin', (req, res) => {
  const {email,password} = req.body;
  const sql = 'SELECT * FROM employee WHERE email= ? AND password = ?';

  db.query(sql, [email,password], (err, results) => {
    if (err) {
      console.error('Error authenticating user:', err);
      res.send('Error authenticating user.');
    } else
    {
      console.log('login result:',results)
      console.log("result length:",results.length)
    }
     if (results.length > 0) {
      // Authentication successful, create a session
      req.session.userId = results[0].emp_id;
      res.redirect('/emphome');
    } else {
      res.render('employeelog', { errorMessage: 'Invalid username or password' });
    }
  });
});


router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/');
  });
});
module.exports = router;


router.get('/empregister', function (req, res) {
  const sql = 'SELECT * FROM employee';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.send('Error fetching data.');
    } else {
      res.render('employeelist', { pdt: results });
    }
  });
});

router.get('/empre', function (req, res) {
  const sql = 'SELECT * FROM employee';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.send('Error fetching data.');
    } else {
      res.render('employeelist2', { pdt: results });
    }
  });
});

router.get('/delete/:id', (req, res) => {
  const userId = req.params.id;
  const sql = 'DELETE FROM employee WHERE emp_id = ?';

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      res.send('Error deleting user.');
    } else {
      console.log('User deleted successfully');
      res.redirect('/');
    }
  });
});

router.get('/edit/:id', (req, res) => {
  const userId = req.params.id;
  const sql = 'SELECT * FROM employee WHERE emp_id = ?';

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Error fetching user data:', err);
      res.send('Error fetching user data.');
    } else {
      res.render('edit', { user: result[0] });
    }
  });
});

router.post('/editdata', (req, res) => {
  const userId = req.body.hide;
  const {name,designation,joinedDate,dob,contact,email} = req.body;
  const sql = 'UPDATE employee SET name=?,designation=?,join_date=?,date_birth=?,contact_no=?,email=? WHERE emp_id = ?';

  db.query(sql, [name,designation,joinedDate,dob,contact,email,userId], (err, result) => {
    if (err) {
      console.error('Error updating user data:', err);
      res.send('Error updating user data.');
    } else {
      console.log('User data updated successfully');
      res.redirect('/empregister');
    }
  });
});


router.post('/atten', (req, res) => {
  const userId = req.body.hided;
  console.log(userId);
  const { attendence } = req.body;
  const currentDate = new Date(); // Correct variable name

  const sql = 'INSERT INTO attendence (emp_id, attendence,currentdate) VALUES (?, ?, ?)';
  db.query(sql, [userId, attendence, currentDate], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.send('Error inserting data.');
    } else {
      console.log('Data inserted successfully');
      res.redirect('/empre');
    }
  });
});

router.get('/attenview', function (req, res) {
  const sql =`
  SELECT employee.name, attendence.attendence, attendence.currentdate,attendence.at_id
  FROM employee
  JOIN attendence ON employee.emp_id = attendence.emp_id
`;

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.send('Error fetching data.');
    } else {
      res.render('attendenceview', { pdt: result });
    }
  });
});

router.get('/salary', function (req, res) {
  const sql = 'SELECT * FROM employee';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.send('Error fetching data.');
    } else {
      res.render('emplyeeview3', { pdt: results });
    }
  });
});


router.post('/sall', (req, res) => {
  const userId = req.body.hided;
  const {basic,da,hra,pf,ts} = req.body;

  const sql = 'INSERT INTO salary (emp_id,Basic_Salary,DA,HRA,PF,Total_Salary) VALUES (?, ? , ? , ?, ?, ?)';
  db.query(sql, [userId,basic,da,hra,pf,ts], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.send('Error inserting data.');
    } else {
      console.log('Data inserted successfully');
      res.redirect('/salary');
    }
  });
});

router.get('/salview', function (req, res) {
  const sql =`
  SELECT employee.name, salary.Total_Salary,salary.emp_id,salary.sal_id
  FROM employee
  JOIN salary ON employee.emp_id = salary.emp_id
`;

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.send('Error fetching data.');
    } else {
      res.render('salaryview', { pdt: result });
    }
  });
});


router.get('/sadelete/:id', (req, res) => {
  const userId = req.params.id;
  const sql = 'DELETE FROM salary WHERE sal_id= ?';

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      res.send('Error deleting user.');
    } else {
      console.log('User deleted successfully');
      res.redirect('/salview');
    }
  });
});


router.get('/atedit/:id', (req, res) => {
  const userId = req.params.id;
  const sql = 'SELECT * FROM attendence WHERE at_id = ?';

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Error fetching user data:', err);
      res.send('Error fetching user data.');
    } else {
      res.render('attenedit', { user: result[0] });
    }
  });
});

router.post('/editdate', (req, res) => {
  const userId = req.body.hided;
  const {attendence} = req.body;
  const sql = 'UPDATE attendence SET attendence=?  WHERE at_id = ?';

  db.query(sql, [attendence,userId], (err, result) => {
    if (err) {
      console.error('Error updating user data:', err);
      res.send('Error updating user data.');
    } else {
      console.log('User data updated successfully');
      res.redirect('/attenview');
    }
  });
});


router.get('/atdelete/:id', (req, res) => {
  const userId = req.params.id;
  const sql = 'DELETE FROM attendence WHERE at_id= ?';

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      res.send('Error deleting user.');
    } else {
      console.log('User deleted successfully');
      res.redirect('/attenview');
    }
  });
});


router.get('/saledit/:id', (req, res) => {
  const userId = req.params.id;
  const sql = 'SELECT * FROM salary WHERE sal_id = ?';

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Error fetching user data:', err);
      res.send('Error fetching user data.');
    } else {
      res.render('salaryedit', { user: result[0] });
    }
  });
});

router.post('/salledit', (req, res) => {
  const userId = req.body.hided;
  const {basic,da,hra,pf,ts} = req.body;
  const sql = 'UPDATE salary SET Basic_Salary=?,DA=?,HRA=?,PF=?,Total_Salary=?  WHERE sal_id = ?';

  db.query(sql, [basic,da,hra,pf,ts,userId], (err, result) => {
    if (err) {
      console.error('Error updating user data:', err);
      res.send('Error updating user data.');
    } else {
      console.log('User data updated successfully');
      res.redirect('/salview');
    }
  });
});
