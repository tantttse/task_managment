const User = require("../models/user.model");
const ForgotPass = require("../models/forgotPass.model");
const md5 = require("md5");
const generateHelper = require("../../../helpers/generate");
const sendMailHelper = require("../../../helpers/sendMails");
const { deleted } = require("./task.controller");

module.exports.create = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const existEmail = await User.findOne({
      email: email,
      deleted: false,
    });

    if (existEmail) {
      return res.json({
        code: 400,
        message: "Email already exists",
      });
    }

    const hashedPassword = md5(password); // Hash the password before saving
    const newUser = new User({
      fullName: fullName,
      email: email,
      password: hashedPassword,
      // `token`, `deleted`, `deleteAt` are automatically handled
    });

    const savedUser = await newUser.save();
    const token = savedUser.token;
    res.cookie("token", token);
    res.json({
      code: 200,
      message: "User created successfully",
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existedEmail = await User.findOne({
      email: email,
      deleted: false,
    });

    if (!existedEmail) {
      return res.json({
        code: 400,
        message: "No email found",
      });
    }

    const hashedPassword = md5(password); // Hash the password for comparison

    if (hashedPassword !== existedEmail.password) {
      return res.json({
        code: 400,
        message: "Incorrect password",
      });
    }

    const token = existedEmail.token;
    res.cookie("token", token);
    res.json({
      code: 200,
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

module.exports.forgotPassword = async (req, res) => {
  const email = req.body.email;

  try {
    const existedEmail = await User.findOne({
      email: email,
      deleted: false
    });

    if (!existedEmail) {
      return res.status(400).json({
        code: 400,
        message: `${email} doesn't exist`
      });
    }

    const otp = generateHelper.generateRandomNumber(8);
    const timeExpired = 5; // Expiration time in minutes

    // Save OTP to the database
    const objectForgetPassword = {
      email: email,
      otp: otp,
      expiredAt: Date.now() + timeExpired * 60 * 1000 // Calculate expiration time correctly
    };

    const forgotPassword = new ForgotPass(objectForgetPassword);
    await forgotPassword.save();

    // Send OTP to the customer's email
    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    const html = `Mã OTP để lấy lại mật khẩu của bạn là <b>${otp}</b> (Sử dụng trong ${timeExpired} phút). Vui lòng không chia sẻ mã này với bất kỳ ai.`;

    // Ensure `sendMailHelper` returns a promise and handle it
    sendMailHelper.sendMail(forgotPassword.email, subject, html);

    res.json({
      code: 200,
      message: "OTP generated and sent",
      email: email
      // Optionally include otp for testing, but do not include it in production
    });
  } catch (error) {
    console.error("Error processing forgot password request:", error);  // Log the error for debugging
    res.status(500).json({ 
      message: "Error processing forgot password request", 
      error: error.message || "Unknown error" // Provide more information about the error
    });
  }
};

module.exports.otpConfirmation = async (req,res) => {
  const {email,otp}=req.body;

  const result = await ForgotPass.findOne({ email: email, otp: otp });


  if(!result){
    res.json({
      code: 400,
      message: "invalid otp",
    });
    return;
  }

  const user = await User.findOne({
    email:email
  })
  
  const token=user.token;
  res.cookie("token", token);
  res.json({
    code: 200,
    message: "Success validate",
    token:token
  });
  
}

module.exports.reset = async (req,res) => {
  const { token, password } = req.body;
  const hashedPassword = md5(password)
  // console.log(req.cookies.token)
  try {
    // Find user with the provided token
    const user = await User.findOne({
      token: token,
      deleted: false,
    });

    if (!user) {
      return res.status(400).json({
        code: 400,
        message: "No user found",
      });
    }

    if(user.password===hashedPassword){
      return res.status(400).json({
        code: 400,
        message: "Please enter new password !!",
      });
    }

    // Hash the new password
    

    // Update the user's password
    await User.updateOne(
      { token: token },
      { $set: { password: hashedPassword } }
    );

    res.status(200).json({
      code: 200,
      message: "Reset success",
      password: hashedPassword,
    });

  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Server error",
      error: error.message,
    });
  }
  res.json({
    code: 200,
    message: "Reset success",
    password: hashedPassword,
  });
}

module.exports.details = async (req, res) => {
  try {
    // Retrieve token from cookies
    

    // Respond with user details
    res.json({
      code: 200,
      message: "User found",
      info: req.user
    });

  } catch (error) {
    // Handle any errors that occurred during the async operation
    res.status(500).json({
      code: 500,
      message: "Error retrieving user details",
      error: error.message || "Unknown error",
    });
  }
}

module.exports.list = async (req, res) => {
  try {
    const users = await User.find({ deleted: false }).select("_id fullName email");
    res.json({
      code: 200,
      message: "Users found",
      users: users
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "An error occurred",
      error: error.message
    });
  }
}
