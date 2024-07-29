const mongoose = require('mongoose')
const {mongoDB_URI} = require("../constants")

async function connectWithDB(){

    const connectionResponse = await mongoose.connect(mongoDB_URI)
   
}

module.exports = { connectWithDB }