import express from "express";
const app = express();

const PORT = 8080;

//Custom Middleware
function checkUserId(req, res, next) {
    //They can make changes to req and res object
    req.myName = 'Kishan';
    
  console.log("User Id Verfied");
  next(); //Mera kaam ho gya abhi you can go to next one
}

function bodyParser(req,res,next){
    const receivedData = data;
    req.body = receivedData;
}

function checkUserPassword(req, res, next) {
  const result = true; //Database check - true/false

  if (result) {
    next(); //Mera kaam ho gya abhi you can go to next one
  } else {
    //Req/res cycle band bhi kar sakte hai
    res.end("Invalid Crediential");
  }
}

app.use((req,res,next)=>{
    console.log(`${req.method} ${req.url}`);
    next();
    
})

app.use(checkUserId); //Jab bhi aapko middleware use karna hai so u use .use method
//Middleware reference middleware() / Express humare liye handle karke ki kab middleware
//app.use() - Middleware calling ka jo kaam is handled by app.use()
app.use(checkUserPassword);

//Route

app.get("/", (req, res) => {
    console.log(req.myName);
    
  res.send("SBI Home Page");
});

//Setup server

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
