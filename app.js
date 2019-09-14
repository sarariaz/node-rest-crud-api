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
// new dogs form route
app.get("/dogs/new", function(req,res){
    res.render("form.ejs");
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


 // set port
 app.listen(3000, function () {
    console.log('Node app is running on port 3000');
});