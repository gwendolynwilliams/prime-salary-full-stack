var express = require('express');
var router = express.Router();
var pg = require('pg');
var path = require('path');

var connectionString = '';
if(process.env.DATABASE_URL != undefined) {
    connectionString = process.env.DATABASE_URL + 'ssl';
} else {
    connectionString = 'postgres://localhost:5432/Gwen';
}

router.get('/', function(req, res) {

    var results = [];

    pg.connect(connectionString, function(err, client, done) {
        var query = client.query('SELECT * FROM employees WHERE active = TRUE');

        //Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        //close connection
        query.on('end', function() {
            done();
            console.log(results);
            return res.json(results);
        });

        if(err) {
            console.log(err);
        }

    });
});

router.post('', function(req, res) {
    var addPerson = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        emp_id: req.body.emp_id,
        job_title: req.body.job_title,
        annual_salary: req.body.annual_salary
    };
    pg.connect(connectionString, function(err, client, done) {
        client.query('INSERT INTO employees (first_name, last_name, emp_id, job_title, annual_salary, active) VALUES ($1, $2, $3, $4, $5, $6);',
            [addPerson.first_name, addPerson.last_name, addPerson.emp_id, addPerson.job_title, addPerson.annual_salary, true],
            function(err, result) {
                done();
                if(err) {
                    console.log('Error inserting data: ', err);
                    res.send(false);
                } else {
                    res.send(addPerson);
                }
            });
    });
});

router.get('/getSalary', function(req, res) {

    var results = [];


    pg.connect(connectionString, function(err, client, done) {
        var query = client.query('SELECT SUM (annual_salary) from employees WHERE active = TRUE;');

        //Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        //close connection
        query.on('end', function() {
            done();
            console.log('Salary results: ', results[0].sum);
            return res.json(results[0].sum);
        });

        if(err) {
            console.log(err);
        }

    });
});

router.post('/updateActive', function(req, res) {

    var results = [];

    var empId = req.body.id;

    pg.connect(connectionString, function(err, client, done) {
        var query = client.query('UPDATE employees SET active = FALSE WHERE ID = ' + empId + ';');
        console.log(query);

        //Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        //close connection
        query.on('end', function() {
            done();
            console.log('updateActive results: ', results);
            return res.json(results);
        });

        if(err) {
            console.log(err);
        }

    });
});

module.exports = router;