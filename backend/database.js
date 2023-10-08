// const express=require('express');
const mongoose=require('mongoose');
const databaseurl='mongodb://localhost:27017/notes';

const connecToMongo=()=>{
    mongoose.connect(databaseurl)
    .then(()=>{
        console.log("connected");
    })
    .catch((err)=>{
        console.log(err)
    })
}

module.exports=connecToMongo;

