

// Node modules required

const express =require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require("https");

const app =express();

// Using public folder additionally for storing css,js and images files
app.use(express.static("public"));

// Using bodyParser module to fetch value from html page
app.use(bodyParser.urlencoded({extended: true}));

// Setting up external server as well as local
app.listen( process.env.PORT || 3000,function(){
  console.log("Server has started at port number 3000");
});

// Setting up routes
app.get("/",function(req,res){
   res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){
      const FirstName = req.body.FirstName;
      const LastName = req.body.LastName;
      const Email_id = req.body.Email_id;

     // data to be sent to mailchimp url
      const data = {
        members:[{
          email_address: Email_id,
          status:"subscribed",
          merge_fields :{
            FNAME :FirstName,
            LNAME : LastName
          }
        }]
       }

      // Converting javascript object data into json for easy transfer
      const jsonData = JSON.stringify(data);

      // Setting up path to for api access
      const url= "https://us{YOUR LAST TWO DIGIT OF API KEY }.api.mailchimp.com/3.0/lists/{YOUR LIST ID}";
      const options = {
        method: "post",
        auth: 'kartiksaurya:// { YOUR API KEY }'
       }
       const request = https.request(url,options,function(response){
         if (response.statusCode ==200)
            res.sendFile(__dirname+"/success.html");
         else
            res.sendFile(__dirname+"/failure.html");

         response.on("data",function(data){
           console.log(JSON.parse(data));
         });
       });
       request.write(jsonData);
       request.end();

})
app.post("/failure",function(req,res){
  res.redirect("/");
})
