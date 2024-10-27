import fs, { appendFileSync } from 'fs';

//how to read data

//const data = fs.readFileSync('./demo.txt','utf-8');
//console.log(data);
 //fs.readFile('./demo.txt','utf-8',(err, data)=>{
   //if(err) throw err;

   //console.log(data);
//});


//fs.writeFileSync('./demo.txt',"Hello world");
//console.log("data written to a file");


try {
 fs.appendFileSync('./demo.txt', '\n data to append');
  console.log('The "data to append" was appended to file!');
} catch (err) {
  // Handle the error
}

