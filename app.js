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

// new dogs form 
app.get("/dogs/new", function(req,res){
    res.render("form.ejs");
});

// fetch single dog
app.get("/dogs/:id", function(req, res){
    let user_id = req.params.id;
    if(!user_id){
        res.status(400).send({error: true, message: "Please provide the Dog ID"});
 
    }
    dbConn.query('SELECT * FROM dogs where id=?', user_id, function(err, results, fields){
        if(err){
            throw err;
        }
        res.send({error: false , data: results[0] ,message: 'Specific Dog List '});
    });
 });

//add new user (create)
app.post("/dogs", function(req,res){
    const { id, name  }= req.body;
    if(!name){
        res.status(400).send({ error: true, message: "Please provide the dog name" });

             }
     dbConn.query(`INSERT INTO dogs (id, name) values ('${id}' , '${name}')`, function(err, results, field){
         if(err){
             throw err;
         }
         else{
             res.send({ error: false , data: results, message: "Added a new dog successfully"});
         }
     }
)});

//UPDATE USER
app.put("/dogs", function(req,res){
    var user = {
        id: req.body.id,
        name: req.body.name
    };
    if(!user){
       res.status(400).send({ error: true, message: "Dog Name or Dog ID is missing"});

    }
    dbConn.query("UPDATE dogs SET name= ? WHERE id= ?", [user.name, user.id], function(err, results,fields){
        if(err){
            throw err;
        }
        return res.send({error: false, data: results, message: "Dog has been updated succesfully"});
    });
});

//Delete User
app.delete("/dogs", function (req, res) {
    let user_id = req.body.id;
    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user_id' });
    }
    dbConn.query('DELETE FROM dogs WHERE id = ?', [user_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Dog has been deleted successfully.' });
    });
});

 // set port
 app.listen(3000, function () {
    console.log('Node app is running on port 3000');
});

module.exports = app;