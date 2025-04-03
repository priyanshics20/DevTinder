const express = require('express');
const connectDB  = require('./config/database')

const app = express();  //instance of class express

app.post('/signup', (req, res) => {
    
})

//best way to connect and start server is first to connect with database then start running server
connectDB()
    .then(() => {
    console.log("successfully connected to databse devTinder")
    app.listen(7777, () => {
        console.log("Server is listening to Port 7777")
    })
}).catch((err) => {
    console.log(err);
})
    

