const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app=express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extneded:true}));

//What to send user when website pulls up
app.get("/",function(req,res){
  res.sendFile(__dirname + "/signup.html");
});

//Pull data from html
app.post("/",function(req,res){
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

//Mail chimp format
  var data = {
    members: [
      {
        email_address:email,
        status: "subscribed",
        merge_fields:{
          FNAME:firstName,
          LNAME:lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);
  const url = "https://us20.api.mailchimp.com/3.0/lists/b2cfbe0eb3";
  const options = {
    method: "POST",
    auth: "adam:22728c072ac58655fa163bea76d74c26-us20"
  }

  const request = https.request(url, options, function(response){
    if(response.statusCode===200){
        res.sendFile(__dirname+"/success.html");

    }else{
        res.sendFile(__dirname+"/failiure.html");

    }

    response.on("data",function(data){
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();

});

app.post("/failiure",function(){
  res.redirect("/");
});

//Server port
app.listen(process.env.PORT || 3000,function(){
  console.log("Server running")
});


//API Key
//22728c072ac58655fa163bea76d74c26-us20
//List ID
//b2cfbe0eb3
