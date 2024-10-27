import express, { json } from "express";
import bodyParser from "body-parser";
import users from "./MOCK_DATA.json" assert { type : "json"};
import fs from 'fs';
import path from 'path';
import { rateLimit } from "express-rate-limit";
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.port || 7000;
const __dirname = path.resolve('./');

//Dummy Key
const validAPIKey = process.env.API_Key;

//Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


function checkApiKey(req, res, next) {
  // const apiKey = req.query.appid; //Query Params

const apiKey = req.headers.appid;

  if (!apiKey) {
    return res.status(401).json({ error: "API key is missing" });
  }

  if (apiKey !== validAPIKey) {
    return res.status(401).json({ error: "Unauthorized Access" });
  }
  next();
}

//Limiter
const limiter = rateLimit({
  windowMs: 15*60*1000,
  limit: 100,
})
app.use(limiter)

//routes
app.get('/api/users' , (req,res)=>{
  const {gender, job_title,page=1, limit=10 } = req.query;
  


  const targetUser = users.filter((user)=>{
    if(gender && job_title){
      return gender === user.gender && job_title === user.job_title;
    }else if(gender) {
      return gender === user.gender;
    }else if (job_title){
      return job_title === user.job_title;
    }else{
      return true;
    }
  });
 
  //pagination
  const startIndex = (page-1)*limit;
  const endIndex = page*limit;
  const paginatedUser = targetUser.splice(startIndex, endIndex);


  res.json({
    page:Number(page),
    limit: Number(limit),
    totalResult: targetUser.length,
    totalPages: Math.ceil(targetUser.length/limit),
    data:paginatedUser
  })
});


app.get('/users' , (req,res)=>{
  
 const html = ` <ul>
   
   ${users.map((user)=> `<li>${user.first_name}</li>`).join("")}

  </ul>`;
  res.send(html);
});



app.get('/api/users/:id' , (req,res)=>{
  const id = Number(req.params.id);
 
  const founduser = users.find((user)=> user.id === id);

  if(!founduser){
    return res.status(404).json({message:"user with id not found"});
  }

 
  res.json(founduser)
})

app.post("/api/users", (req, res) => {
  const newData = req.body;

  if (
    !newData.first_name ||
    !newData.last_name ||
    !newData.gender ||
    !newData.email ||
    !newData.job_title
  ) 
    {
     return res.status(400).json({ error: "More fields are required" });
  }
  newData.id = users.length + 1;
 
  

  users.push(newData);

  //write updated users array to  file

  console.log(__dirname+'/MOCK_DATA.json' );
  fs.writeFile(__dirname+'/MOCK_DATA.json', JSON.stringify(users),(err,data)=>{
  
    if(err){
      console.log(err);
      return res.status(500).json({ message: "Failed to write to file" });
    }
    res.json({ "status":'sucess',"id":users.length });
  })

 
});

app.put("/api/users/:id", (req,res)=>{

  const id = Number(req.params.id); //4
  const data = req.body; //name - Sita //gender - Female
  if (
    !data.first_name ||
    !data.last_name ||
    !data.gender ||
    !data.email ||
    !data.job_title
  ) 
    {
     return res.status(400).json({ error: "More fields are required" });
  }

  



  const userIndex = users.findIndex(user => user.id === id); //3 index

  if (userIndex === -1 || userIndex > users.length) {
    res.status(404).json({ error: "User not found" });
  }

  

  //Update

  const updatedUser = { ...users[userIndex], ...data }; //spread operator {//existing,userInput}

  users[userIndex] = updatedUser;
  //Mockdata[3] = {}

  try{
    fs.writeFileSync(path.join(__dirname,'MOCK_DATA.json'),JSON.stringify(users))
    return res.json({ status: 'succes', user: updatedUser});
  }catch (err){
    console.error(err);
    return res.status(500).json({ error: 'failed to update user'});
  }


});

app.patch("/api/users/:id", (req, res) => {
  const id = Number(req.params.id); //4
  const data = req.body; //name - Sita //gender - Female



  const userIndex = users.findIndex(user => user.id === id); //3 index

  if (userIndex === -1 || userIndex > users.length) {
    res.status(404).json({ error: "User not found" });
  }

  if (!userIndex) res.status(404).json({ error: "Invalid id" });

  //Update

  const updatedUser = { ...users[userIndex], ...data }; //spread operator {//existing,userInput}

  users[userIndex] = updatedUser;
  //Mockdata[3] = {}

  try{
    fs.writeFileSync(path.join(__dirname,'MOCK_DATA.json'),JSON.stringify(users))
    return res.json({ status: 'succes', user: updatedUser});
  }catch (err){
    console.error(err);
    return res.status(500).json({ error: 'failed to update user'});
  }

});


app.delete("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!id) return res.statusCode(500);

  const userIndex = users.findIndex(user => user.id === id);

  if (userIndex === -1 || userIndex > users.length) {
    res.status(404).json({ error: "User not found" });
  }

  users.splice(userIndex, 1);

  //Decrement ids of users following the deleted user
  for (let i = userIndex; i < users.length; i++){
    users[i].id -= 1;  
  }


  try{
  fs.writeFileSync("./MOCK_DATA.json", JSON.stringify(users));
  return res.json({status: 'sucess'});
  }catch (err){
    console.error(err);
    return res.status(500).json({ error: 'failed to delete user'})
  }
  });
  





app.listen(PORT, ()=>{
  console.log( `server running on port ${PORT}`)
})




