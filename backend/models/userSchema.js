import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    fullname:{
        type:String,
        require: [true,"Name Required!"],
    },
    email:{
        type:String,
        require: [true,"email Required!"],
    },
    phone:{
        type:String,
        require: [true,"Phone Number Required!"],
    },
    aboutMe:{
        type:String,
        require: [true,"About Me Field Is Required!"],
    },
    password:{
        type:String,
        require: [true,"Password Is Required!"],
        minLength: [8, "Password must contain at least 8 Characters"],
        select:false,
    },
    avatar:{
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true, 
        }
    },
    resume:{
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true, 
        }
    },
    portfolioURL:{
        type: String,
        required:[true, "Portfolio URL Is Requried!"],
    },
    githubURL:String,
    instagramURL:String,
    linkedInURL:String,
    resetPasswordToken:String,
    resetPasswordExpire: Date,
});

//FOR HASHING PASSWORD

userSchema.pre("save" , async function (next){
    if (!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password,10);
})

//FOR COMPARING PASSWORD WITH HASHED PASSWORD
userSchema.methods.comparePassword =async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password);
};

//GENERATING JSON WEB TOKEN
userSchema.methods.generateJsonWebToken =function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET_KEY,{
        expiresIn: process.env.JWT_EXPIRES
    });
};

userSchema.methods.getResetPasswordToken = function () {
    const resetToken =crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

    this.resetPasswordExpire =Date.now()+15 * 60 * 1000;
    return resetToken;
};

export const User =mongoose.model("User", userSchema)