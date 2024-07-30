const jwt = require('jsonwebtoken');
const { generateAccessAndRefreshTokens } = require('../controllers/auth.controller');
const User = require('../models/user.model');
const { ApiError} =  require("../utils/ApiError")

// TODO : Check if client refreshTk is same as that in backend , then only refresh otherwise return error

const verifyJWT = async (req, res, next) => {
    try {
        
        const { accessToken , refreshToken } = req.cookies;
        console.log({refreshToken, accessToken})
        if((!refreshToken)){
            return next(new ApiError(401, "Unauthorized"))
        }
        console.log("I am here");
        if (accessToken) {
            jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
                if (error) {
                    console.log({ error: error.message });
                    return renewTokens(req, res, next); // Pass next to renewTokens
                } else {
                    const { userId } = decoded;
                    console.log({userId})
                    console.log("All good");
                    console.log(req.body)
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
        const { accessToken , refreshToken } = req.cookies;
        console.log({refreshToken, accessToken})
        if((!refreshToken)){
            return next(new ApiError(401, "Unauthorized"))
        }
        console.log("I am here");
        if (accessToken) {
            jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
                if (error) {
                    console.log({ error: error.message });
                    return renewTokens(req, res, next); // Pass next to renewTokens
                } else {
                    const { userId ,role} = decoded;
                    if(role!=="admin"){
                        return next(new ApiError(401, "Unauthorized"))
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
