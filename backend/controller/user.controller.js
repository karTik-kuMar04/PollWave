import { User } from "../models/user.model.js"
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponce.js";

const safeUser  = (userDoc) => {
    const { password , refreshToken ,  __v , ...out} = userDoc.toObject();
    return out;
};


// User Registration
const register = async(res, req, next) => {
    try {
        const { fullName, email, password, role} = req.body;
        // check if user send all info's
        if (![fullName, email, password].every(Boolean)) {
            throw new apiError(400, "All feilds are required")
        }

        const exists = await User.findOne({ $or: [email] });
        // check user provided credentials are exists or not
        if (exists) {
            throw new apiError(409, "User already exists")
        }


        const user = await User.create({ email, password, fullName, role});

        if (!user) {
            throw new apiError(500, 'something went wrong while registering user')
        }

        return res
        .status(200)
        .json( new apiResponse(201, {user:safeUser(user)}, "User Registered Succesfully"))
    } catch (error) {
        next(error)
    }
}


// User Login
const login = async(req, res, next) => {
    try {
        const { email, password } = req.body
        // check if user filledd all field or not
        if (!email || !password) {
            throw new apiError(400,'login credintails are required');
        }

        const user = await User.findOne({ $or: [{email}] })
        // check if user is in database or not
        if (!user) {
            throw new apiError(400, 'User not Found')
        }


        // check password is correct or not
        const valid = await user.isPasswordCorrect(password);
        // give responce if password not correct
        if (!valid) {
            throw new apiError(401, "Invalid Credentials")
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });


        // set cookies (httpOnly)
        const options = {
            httpOnly: true,
            secure: true
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new apiResponse(
                    200,
                    {
                        user: safeUser(user),
                        accessToken,
                        refreshToken
                    },
                    "User logged in successfully"
                )
            );

        } catch (error) {
            next(error)
        }
}


const getMe = async (req, res, next) => {
    try {
        //  this assumes you implemented auth middleware to set req.user
        const user = await User.findById( req.user._id ).select("-password -refreshToken");
        res.json({
            user
        });
    } catch (error) {
        next(error)
    }
}

export {
    register,
    login,
    getMe
}