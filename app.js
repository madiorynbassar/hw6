var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('view engine', 'ejs');
app.set('Views', path.join(__dirname, 'Views'));

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "user_data"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

app.listen(3000);



app.get('/users', function(req, res) {
    con.query("select * from user_info", function(error, result) {
        res.render('index', { params: result });
    });
});

app.get('/user/add', function(req, res) {
    res.render('add');
});

app.post('/user/add', urlencodedParser, function(req, res) {
    con.query("insert into user_info(username,surname,email) values(?,?,?)", [req.body.user_name, req.body.user_surname, req.body.user_email], function(error, result) {
        if (error) {
            res.send(error);
        } else {
            res.status(200);
            res.send("User " + req.body.user_name + " " + req.body.user_surname + " successfully added!");
        }
    });
});

app.get('/user/:id', function(req, res) {
    con.query("select * from user_info where id=?", [req.params.id], function(error, result) {
        res.render('user', { user: result });
    });
});

app.get('/user/edit/:id', function(req, res) {
    con.query("select * from user_info where id=?", [req.params.id], function(error, result) {
        res.render('edit', { edit: result });
    });
});

app.post('/user/edit/:id', urlencodedParser, function(req, res) {
    con.query("update user_info SET username = ?,surname = ?, email = ? where id = ?", [req.body.update_name, req.body.update_surname, req.body.update_email, req.params.id], function(error, result) {
        if (error) {
            res.status(404);
            res.send(error);
        }
        res.status(200);
        res.send("User with id: " + req.params.id + " successfully updated!");
    });
});


app.get('/user/delete/:id', function(req, res) {
    con.query("delete from user_info where id=?", [req.params.id], function(error, result) {
        if (error) {
            res.status(404);
            res.send();
        } else {
            res.status(200);
            res.send("User with id: " + req.params.id + " successfully deleted");
        }
    });
});