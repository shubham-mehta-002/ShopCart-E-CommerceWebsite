const mongoDB_URI = `mongodb+srv://shubhammehta212:${process.env.MONGO_DB_PASSWORD}@cluster0.nwyjwzv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const BASE_URL = "http://localhost:5173"


module.exports = {
    mongoDB_URI,
    BASE_URL
}

