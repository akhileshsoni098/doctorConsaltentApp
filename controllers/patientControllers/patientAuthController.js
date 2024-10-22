const patientAuthModel = require("../../models/patientModels/patientAuthModel");
const bcrypt = require("bcrypt");
const validation = require("../../validations/validation.js");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const otpModel = require("../../models/patientModels/otpModel.js");
const { sendMail } = require("../../sendMail.js");



///// can optimise more ..........     according to requirement


/////////////////////////////////// Register and Send OTP ///////////////////////////////////////////////

exports.register = async function (req, res) {
  try {
    const userData = req.body;

    let { name, email, password, fcmToken } = userData;

    if (Object.keys(userData).length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide required fields" });
    }

    if (!name) {
      return res
        .status(400)
        .send({ status: false, message: "Name is mandatory" });
    }

    if (typeof name != "string") {
      return res
        .status(400)
        .send({ status: false, message: "Name should be a string" });
    }

    name = userData.name = name.trim();

    if (name == "") {
      return res
        .status(400)
        .send({ status: false, message: "Please enter a valid name" });
    }

    if (!validation.validateName(name)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide a valid name" });
    }

    if (!email) {
      return res
        .status(400)
        .send({ status: false, message: "Email is mandatory" });
    }

    if (typeof email != "string") {
      return res
        .status(400)
        .send({ status: false, message: "Email should be a string" });
    }

    email = userData.email = email.trim().toLowerCase();

    if (email == "") {
      return res
        .status(400)
        .send({ status: false, message: "Please enter a valid email" });
    }

    if (!validation.validateEmail(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide a valid email" });
    }

    if (!password) {
      return res
        .status(400)
        .send({ status: false, message: "Password is mandatory" });
    }

    if (typeof password != "string") {
      return res
        .status(400)
        .send({ status: false, message: "Password should be a string" });
    }

    password = userData.password = password.trim();

    if (password == "") {
      return res
        .status(400)
        .send({ status: false, message: "Please provide a valid password" });
    }

    const userExist = await patientAuthModel.findOne({ email: email });

    if (userExist) {
      return res
        .status(400)
        .send({ status: false, message: "Email already exists" });
    }

    // Generate OTP and store in the database
    let otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    await otpModel.deleteMany({ email: email });

    const createOtp = await otpModel.create({ email, otp });
    console.log(createOtp);

    // Send verification email with OTP
    const mailOptions = {
      from: process.env.email,
      to: email,
      subject: "Docter Consultant App Verification Code!",
      html: `
        <p>Hello ${name},</p>
        <p>Your OTP verification code is: <strong>${otp}</strong>.</p>
        <p>Thank you for registering.</p>
      `,
    };

    await sendMail(mailOptions);

    return res
      .status(200)
      .send({ status: true, message: "Verification code sent successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ status: false, message: error.message });
  }
};

/////////// Verify OTP and Register ////////////

exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const storedOTP = await otpModel.findOne({ email: email, otp: otp });

    if (!storedOTP) {
      return res.status(400).json({ status: false, message: "Invalid OTP" });
    }

    const userData = req.body;

    const { name, password, fcmToken } = userData;

    if (typeof password !== "string" || !password.trim()) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid password" });
    }

    const hashing = bcrypt.hashSync(password, 10);

    userData.password = hashing;

    const userCreated = await patientAuthModel.create(userData);

    userCreated.isEmailVerified = true;

    await userCreated.save();

    await otpModel.deleteMany({ email });

    const token = jwt.sign(
      { email: userCreated.email, _id: userCreated._id },
      process.env.JWT_SECRET_KEY
    );

    return res.status(200).json({
      status: true,
      message: "Email verified successfully",
      data: userCreated,
      token: token,
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};

//////////// Resend OTP ///////////

exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const updatedOTP = await otpModel.findOneAndUpdate(
      { email: email },
      { otp: otp },
      { new: true }
    );

    if (!updatedOTP) {
      await otpModel.create({ email: email, otp: otp });
    }

    const mailOptions = {
      from: process.env.email,
      to: email,
      subject: "New OTP Verification Code Sent From Docter Consultant App",
      text: `Your new OTP verification code is: ${otp}`,
    };

    await sendMail(mailOptions);

    return res
      .status(200)
      .json({ status: true, message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

//////////// Login User ///////////

exports.loginUser = async function (req, res) {
  try {
    let data = req.body;
    let { email, password } = data;

    if (Object.keys(data).length == 0)
      return res
        .status(400)
        .send({ status: false, message: "Please send data" });

    if (!email)
      return res
        .status(400)
        .send({ status: false, message: "Please enter Email" });

    email = data.email = email.trim();

    if (email == "")
      return res
        .status(400)
        .send({ status: false, message: "Please enter Email value" });

    if (!validation.validateEmail(email))
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid Email" });

    if (!password)
      return res
        .status(400)
        .send({ status: false, message: "Please enter password" });

    password = data.password = password.trim();

    let isUserExist = await patientAuthModel.findOne({ email: email });

    if (!isUserExist)
      return res
        .status(404)
        .send({ status: false, message: "No user found with given Email" });

    if (!isUserExist.isEmailVerified) {
      return res
        .status(400)
        .send({
          status: false,
          message: "Email is not verified. Please verify your email",
        });
    }

    let passwordCompare = await bcrypt.compare(password, isUserExist.password);

    if (!passwordCompare)
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid password" });

    let token = jwt.sign(
      {
        _id: isUserExist._id,
        role: isUserExist.role,
        email: isUserExist.email,
      },
      process.env.JWT_SECRET_KEY
    );

    if (isUserExist.fcmToken && data.fcmToken) {
      await patientAuthModel.findByIdAndUpdate(
        isUserExist._id,
        { fcmToken: data.fcmToken },
        { new: true }
      );
    }

    return res
      .status(200)
      .send({ status: true, message: "User login successful", data: token });
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

/////////// Forgot Password ///////////

exports.forgetpassword = async function (req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .send({ status: false, message: "Email is mandatory" });
    }

    const user = await patientAuthModel.findOne({ email: email });

    if (!user) {
      return res
        .status(404)
        .send({ status: false, message: "No user found with given Email" });
    }

    let otp = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });

    const otpInstance = await otpModel.findOneAndUpdate(
      { email },
      { otp },
      { new: true }
    );

    if (!otpInstance) {
      await otpModel.create({ email, otp });
    }

    const mailOptions = {
      from: process.env.email,
      to: email,
      subject: "Forgot Password OTP",
      text: `Your OTP for resetting the password is: ${otp}`,
    };

    await sendMail(mailOptions);

    return res
      .status(200)
      .send({ status: true, message: "OTP sent to email successfully" });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

////// Reset Password //////////

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const existingOTP = await otpModel.findOne({ email, otp });

    if (!existingOTP) {
      return res.status(400).send({ status: false, message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await patientAuthModel.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(400)
        .send({ status: false, message: "Failed to update password" });
    }

    await otpModel.deleteMany({ email });

    return res
      .status(200)
      .send({ status: true, message: "Password updated successfully" });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

///////////////// user should be authenticated   //////////////////
// testing remains
exports.changePassword = async (req, res) => {
  try {
  // need to write 
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

/////////////////////////////// logIn with google //////////////////////////////////////

//        .....   Docter Consultant   .....   according to the requirement 
