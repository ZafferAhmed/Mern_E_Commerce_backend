const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const JWT = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.json({
        success: false,
        message: "Account with this email exists. Please try log in.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      user: {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Some Error occured while regestering",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.json({
        success: false,
        message:
          "User not found. Create an account to continue or Check your email once.",
      });
    }
    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch) {
      return res.json({
        success: false,
        message: "Incorrect Password! Please try again.",
      });
    }

    const token = JWT.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName
      },
      "CLIENT_SECRET_KEY",
      { expiresIn: "60m" }
    );

    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Logged in Successfully",
      user: {
        _id: checkUser._id,
        email: checkUser.email,
        role: checkUser.role,
        userName: checkUser.userName,
      },
      token,
    });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({
      success: false,
      message: "Some Error occured while logging in",
    });
  }
};

const logOut = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out Successfully",
  });
};

const authMiddleware = (req, res, next) => {
  let token = req.cookies.token;
  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      token = parts[1];
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized Access - No token provided",
    });
  }

  try {
    const decoded = JWT.verify(token, "CLIENT_SECRET_KEY");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized Access - Invalid or expired token",
    });
  }
};

module.exports = { registerUser, loginUser, logOut, authMiddleware };
