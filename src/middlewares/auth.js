const jwt = require("jsonwebtoken");
const User = require('../models/user')

const userAuth = async (req, res, next) => {
    try {
        // get the token from cookies
        const token = req.cookies.token;
        if (!token) {
            throw new Error("User not logged in")
        }

        // verify the token 
        const decodedToken = jwt.verify(token, "PriyanshiSecretKey");
    
        // find the user 
        const { _id } = decodedToken;
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User Not found")
        } else {
            req.user = user;
            next();
        }
    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }
}

module.exports = { userAuth };