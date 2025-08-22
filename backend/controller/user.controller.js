import { User } from "../models/user.model.js"
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponce.js";

const safeUser  = (userDoc) => {
    const { password , refreshToken ,  __v , ...out} = userDoc.toObject();
    return out;
};


// User Registration
const register = async(req, res, next) => {
    try {
        const { fullName, email, password, role} = req.body;
        // check if user send all info's
        if (![fullName, email, password].every(Boolean)) {
            throw new apiError(400, "All feilds are required")
        }

        const exists = await User.findOne({ $or: [{ email }] });
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
    // req.user is already set by verifyJWT with a DB-fetched user
    // If verifyJWT already returns full user, you could just:
    // return res.json({ user: req.user });

    const user = await User.findById(req.user._id)
      .select("-password -refreshToken");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error("getMe error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const logout = async (req, res, next) => {
  try {
    // Overwrite cookie before clearing (extra safety)
    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0), // Expire immediately
      path: "/", // Clear from root
    });

    return res
      .status(200)
      .json(new apiResponse(200, null, "Logged out successfully"));
  } catch (error) {
    console.error("logout error:", error);
    return next(new apiError(500, "Logout failed"));
  }
};


const forgotPassword = async (req, res, next) => {
  try {
    const { email, fullName, newPassword } = req.body;

    if (!email || !fullName || !newPassword) {
      return next(new apiError("All fields are required", 400));
    }

    const user = await User.findOne({ email, fullName });
    if (!user) {
      return next(new apiError("User not found", 404));
    }

    // just assign — pre("save") hook will hash automatically
    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully. You can now log in.",
    });
  } catch (error) {
    next(error);
  }
};



export {
    register,
    login,
    getMe,
    logout,
    forgotPassword
}