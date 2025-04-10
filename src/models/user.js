const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { default: isURL } = require('validator/lib/isURL');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: [4, "First name must be at least 4 characters"],
        maxLength: [50, "First name cannot exceed 50 characters"],
        match: [/^[a-zA-Z]+$/, "First name can only contain letters"], // No numbers or special chars
        trim: true,
    },
    lastName: {
        type: String,
        minLength: 4,
        maxLength: 50,
        match: [/^[a-zA-Z]+$/, "First name can only contain letters"],
        trim: true,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
        minLength: [6, "Password must be at least 6 characters"],
        maxLength: [128, "Password cannot exceed 128 characters"],
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Enter a strong password" + value)
            }
        },
    },
    age: {
        type: Number,
        min: [18, "Age must be atleast 18"],
        max: 100,
        validate: {
            validator: Number.isInteger,
            message: "Age must be a number",
        }
    },
    about: {
        type: String,
        default: "This is a default about of the user!",
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
    },
    skills : {
        type: [String],
        validate: [
            {
                validator: function (arr) {
                    return arr.length <= 10;
                },
                message: "You can add upto only 10 skills",
            },
            {
                validator: function (arr) {
                    return arr.every(skill => typeof skill === "string" && skill.trim() !== "")
                },
                message: "Skills can not be empty",
            }
        ],
    },
    photoURL: {
        type: String,
        default: "https://geographyandyou.com/images/user-profile.png",
        validate: {
            validator: function (url) {
                return validator.isURL(url) 
            },
            message: "URL must be valid"
        }
    }
    
},
    {
        timestamps: true,
    }
);

// good way to define jwt as it is more close to schema 
// can not make anonymous funcition as they take this keyword differnetly
userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "PriyanshiSecretKey", { expiresIn: "1h" })
    
    return token;
}

userSchema.methods.validatePassword = async function (userInputPassword)
{
    const user = this;
    const isPasswordValid = await bcrypt.compare(userInputPassword, user.password);
    return isPasswordValid;
}

// creating model
const User = mongoose.model('User', userSchema);

module.exports = User;