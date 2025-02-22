const express = require('express');
const mongoose= require('mongoose');
const userModel =require("./schema")

const app = express();
const port = 3010;
//install dotenv and express nodemon for using continuation process saving
require('dotenv').config();
app.use(express.json())
//mongo connection 
mongoose.connect(process.env.moongo_url)
.then(()=>(
  console.log('Connected to database')
))
.catch((err)=>(
  console.log(err)
));



app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});
//step 2: testing the route with the endpoint of "/api/user"
app.post("/api/user",async(req,res)=>{
     
   try {
     const user = new userModel(req.body)
     await user.save()
     res.status(201).json({message:"created.."})
   } catch (error) {
     if(error.name=="ValidationError"){
        
       return res.status(400).json({message:error.message})

     }
     if(error.errorResponse.code==11000){
       return res.status(400).json({message:"email is already registered"})
     }
    
     res.status(500).json({message:"internel server error"});
    }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
