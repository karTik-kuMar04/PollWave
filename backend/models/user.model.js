import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema = new mongoose.Schema({
    fullName: { type: String , required: true , trim: true },
    email: { type: String , required: true , unique: true , lowercase: true , trim: true },
    password: { type: String , required: true },
    role: { type: String , enum: ['host', 'participant'] , default: 'participant' },
    refreshToken: { type: String }
}, {timestamps: true})



// hash password beforr save
userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

// compare Password
userSchema.methods.isPasswordCorrect = function(plain) {
    return bcrypt.compare(plain, this.password);
}


// Access token method
userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        { _id: this._id , email: this.email , role: this.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};


// Refresh Token method
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    )
}


export const User = mongoose.model("User", userSchema);