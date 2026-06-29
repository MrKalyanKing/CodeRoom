import express from "express";
import connectDB from "./Config/db.js";


const app=express();
const port=4600 ||  process.env.PORT;

app.get("/",(req,res)=>{
    res.send("Hello World");
})
connectDB()
app.listen(()=>{
    console.log(`Server is listening to the port number ${port}`)
})