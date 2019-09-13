var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql= require('mysql');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// connection configurations
var dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mysql_database'
});
// connect to database
dbConn.connect(); 

//default route
app.get("/", function(req, res){
    res.send("Hello, Welcome");
});

// retrieve all dogs - index route
app.get("/dogs", function(req,res){
    dbConn.query('SELECT * FROM dogs', function(err, data, field){
        if(err){
            res.send(err);
        }
        else{
            res.send(data);
        }
    });
});
// new dogs route
app.get("/dogs/new", function(req,res){
    res.render("form.ejs");
})
 // set port
 app.listen(3000, function () {
    console.log('Node app is running on port 3000');
});