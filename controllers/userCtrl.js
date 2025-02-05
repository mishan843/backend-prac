const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const bcrypt = require('bcryptjs')


const createUser = asyncHandler(async(req, res) => {
    const { firstName, middleName, lastName, password, email, phoneNumber, gender, profilePhoto} = req.body;

   try {
    if(!firstName || !middleName || !lastName || !password || !email || !phoneNumber || !gender || !profilePhoto){
        res.status(404).json({code: 404, success: false, message: "Missing field required"})
    }

    let user = await User.findOne({ email: req.body.email })
    if (user) {
        return res.status(400).send({code: 400, success: false, message: 'User already exists. Please sign in'})
    } else {
        try {
            const user = new User({
                firstName: req.body.firstName,
                middleName: req.body.middleName,
                lastName: req.body.lastName,
                phoneNumber: req.body.phoneNumber,
                gender: req.body.gender,
                profilePhoto: req.body.profilePhoto,
                email: req.body.email,
                password: password
            })
            await user.save()
            let options = {
                maxAge: 20 * 60 * 1000, // would expire in 20minutes
                httpOnly: true, // The cookie is only accessible by the web server
                secure: true,
                sameSite: "None",
            };
            const token = user.generateAccessJWT(); // generate session token for user
            res.cookie("SessionID", token, options);
            return res.status(201).json({code:201, success: true,user, token})
        } catch (err) {
            return res.status(400).json({code:400, success: false, message: err.message })
        }
    }

   } catch (error) {
    console.log({error, "message": error.message});
   }
})

const loginUser = asyncHandler(async(req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email }).select("+password");
        if (!user)
            return res.status(401).json({
                status: "failed",
                data: [],
                message:
                    "Invalid email or password. Please try again with the correct credentials.",
            });
        const isPasswordValid = await bcrypt.compare(
            `${req.body.password}`,
            user.password
        );
        if (!isPasswordValid)
            return res.status(401).json({
                status: "failed",
                data: [],
                message:
                    "Invalid email or password. Please try again with the correct credentials.",
            });
        // return user info except password
        const { password, ...user_data } = user._doc;
        let options = {
            maxAge: 20 * 60 * 1000, // would expire in 20minutes
            httpOnly: true, // The cookie is only accessible by the web server
            secure: true,
            sameSite: "None",
        };
        const token = user.generateAccessJWT(); // generate session token for user
        res.cookie("SessionID", token, options);
        res.status(200).json({
            status: "success",
            data: user_data,
            token: token,
            message: "You have successfully logged in.",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            error: err.message,
            message: "Internal Server Error",
        });
    }
})

const getUserDetail = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ code: 404, success: false, message: "User not found" });
        }

        res.status(200).json({ code: 200, success: true, message: "User data fetched successfully", user });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ status: "error", code: 500, message: "Internal Server Error", error: error.message });
    }
});

const getUsers = asyncHandler(async (req, res) => {
    try {
        let { page, limit } = req.query;

        page = parseInt(page) || 1; 
        limit = parseInt(limit) || 10; 

        const skip = (page - 1) * limit; 

        const totalUsers = await User.countDocuments();

        const allUsers = await User.find().skip(skip).limit(limit);

        res.status(200).json({
            code: 200,
            success: true,
            message: "Users fetched successfully",
            totalUsers, 
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            allUsers
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            code: 500,
            message: "Internal Server Error",
            error: error.message
        });
    }
});


const updateUser = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params;
        const updatedData = req.body;

        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ code: 404, success: false, message: "User not found" });
        }

        res.status(200).json({ code: 200, success: true, message: "User updated successfully", updatedUser });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ status: "error", code: 500, message: "Internal Server Error", error: error.message });
    }
});

const deleteUser = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params;
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ code: 404, success: false, message: "User not found" });
        }

        res.status(200).json({ code: 200, success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ status: "error", code: 500, message: "Internal Server Error", error: error.message });
    }
});


module.exports ={createUser, loginUser, updateUser, getUserDetail, getUsers, deleteUser}