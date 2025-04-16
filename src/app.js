const express = require('express');
const connectDB = require('./config/database')
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const connectionRequestRouter = require('./routes/request');
const userRouter = require('./routes/user')
const { swaggerUi, swaggerSpec} = require('../swagger')
const app = express();  //instance of class express


app.use(express.json());
app.use(cookieParser());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRequestRouter);
app.use("/", userRouter);

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