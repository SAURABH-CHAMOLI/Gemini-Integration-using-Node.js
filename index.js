const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const express=require('express');
const app=express();

const port=8080;

let path=require('path');
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));
app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({extended:true}))
const methodOverride=require("method-override");
app.use(methodOverride("_method"));

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});


async function generate(prompt) {
    try {
        const result = await model.generateContent(prompt)
        return result.response.text();
    }
    catch(err) {
        console.log(err);
    }
    
}

let prompt='';
app.get('/',(req,res)=>{
    res.render('home.ejs',{prompt})
})

app.get('/generate',async(req,res)=>{
   let {prompt}=req.query;
    console.log(prompt)

    let result= await generate(prompt);
    
    res.render('home.ejs',{prompt,result})
})

app.listen(port,(req,res)=>{
    console.log(`Server is listening to port:${port}`)
})




