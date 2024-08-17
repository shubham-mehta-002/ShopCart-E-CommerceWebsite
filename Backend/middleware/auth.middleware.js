const jwt = require('jsonwebtoken');
const { generateAccessAndRefreshTokens } = require('../controllers/auth.controller');
const User = require('../models/user.model');
const { ApiError} =  require("../utils/ApiError")

const verifyJWT = async (req, res, next) => {
    try {
        const { accessToken , refreshToken , loggedInUserInfo} = req.cookies;
        if((!refreshToken)){
            return next(new ApiError(401, "Unauthorized"))
        }
        if (accessToken && loggedInUserInfo) {
            jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async(error, decoded) => {
                if (error) {
                    return next(new ApiError(401, "Something went wrong"))
                } else {
                    const { userId } = decoded;
                    const fetchedUser = await User.findById(userId).select("refreshToken")
                    if(fetchedUser.refreshToken !== refreshToken ){
                        return new ApiError(401, "Unauthorized")
                    }
                    req.body.user = { id: userId };
                    next();
                }
            });
        } else {
            return renewTokens(req, res, next); // Pass next to renewTokens
        }
    } catch (error) {
        console.log({error})
        return res.status(500).json({ success: false, message: "Something went wrong!" });
    }
};



const verifyAdminJWT = async (req, res, next) => {
    try {
        const { accessToken , refreshToken ,loggedInUserInfo} = req.cookies;
        if((!refreshToken)){
            return next(new ApiError(401, "Unauthorized"))
        }
        if (accessToken && loggedInUserInfo) {
            jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async(error, decoded) => {
                if (error) {
                    return next(new ApiError(401, "Something went wrong"))
                } else {
                    const { userId ,role} = decoded;
                    if(role!=="admin"){
                        return next(new ApiError(401, "Unauthorized"))
                    }
                    const fetchedUser = await User.findById(userId).select("refreshToken")
                    if(fetchedUser.refreshToken !== refreshToken ){
                        return new ApiError(401, "Unauthorized")
                    }
                    req.body.user = { id: userId };
                    next();
                }
            });
        } else {
            return renewTokens(req, res, next); // Pass next to renewTokens
        }
    } catch (error) {
        console.log({error})
        return res.status(500).json({ success: false, message: "Something went wrong!" });
    }
};

const renewTokens = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(401).json({ success: false, message: "Unauthorizedd" });
        } else {
            const { userId } = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(userId);
            const user = await User.findById(userId);

            if (!newAccessToken || !newRefreshToken) {
                return res.status(500).json({ success: false, message: "Something went wrong!!" });
            }
            user.refreshToken = newRefreshToken;
            await user.save({ validateBeforeSave: false });
            res.cookie("accessToken", newAccessToken, { maxAge: 600000, secure: true, httpOnly: true });
            res.cookie("refreshToken", newRefreshToken, { maxAge: 1200000, secure: true, httpOnly: true });
            res.cookie("loggedInUserInfo",JSON.stringify({userId ,role:user.role}),{ maxAge: 1200000, secure: true, httpOnly:false})
            // Set the user ID in the request body to continue to the next middleware
            req.body.user = { id: userId };
            next();
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { verifyJWT , verifyAdminJWT };
