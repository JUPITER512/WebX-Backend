import { v4 as uuidv4 } from "uuid"; // Assuming uuidv5 was meant to be uuidv4

import { Asynchandler } from "../Utils/AsyncHandler.js";
import { User } from "../Models/User.models.js";
import { Otp } from "../Models/Otp.models.js";
import { uploadCloudinary } from "../Utils/Cloudinary.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { forgetEmail, main } from "../Utils/Nodemailer.js";
const generateAccessAndRefreshTokens = async (res, userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    res.status(400).json({
      message: "Something Went Wrong While Generating Access And Refresh Token",
    });
  }
};
const generateRandomToken = async (userId) => {
  const confirmationToken = uuidv4();
  const user = await User.findById(userId);
  user.confrimToken = confirmationToken;
  user.isConfrimed = false;
  user.save({ validateBeforeSave: false });
  return confirmationToken;
};

const generateOtp = () => {
  const buffer = crypto.randomBytes(3); // Generate 3 random bytes
  const otp = parseInt(buffer.toString("hex"), 16).toString().substr(0, 6); // Convert to hex, then to an integer, and finally to a string
  return otp;
};
const signUpWithGoogle = () => Asynchandler(async (req, res) => {});
export const SignIn = Asynchandler(async (req, res) => {
  const { userName, email, password } = req.body;

  if (!(userName && email && password)) {
    res.status(400).json({
      message: "All Fields Are Required",
    });
  }
  const user = await User.findOne({
    $and: [{ email }, { userName }],
  });
  if (!user) {
    res.status(409).json({
      message: "User Does Not Exists",
    });
  }
  if (user.isConfirmed==false){
    res.status(400).json({
      message: "Email is not confrimed yet",
    });
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    res.status(404).json({
      message: "Invalid Credentials",
    });
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    res,
    user._id,
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      message: "Success",
      data: {
        refreshToken,
        accessToken,
        user: loggedInUser,
      },
    });
});
export const SignUp = Asynchandler(async (req, res) => {
  try {
    const { firstName, lastName, email, userName, password } = req.body;
    if (
      [firstName, lastName, email, userName, password].some((item) => {
        return item.trim() == "";
      })
    ) {
      res.status(400).json({
        message: "All Fields Are Required",
      });
    }
    const existedUser = await User.findOne({
      $or: [{ userName }, { email }],
    });
    if (existedUser) {
      res.status(400).json({
        message: "User with Email/UserName Already Exists",
      });
    }
    const imagePath = req.file?.path;
    if (!imagePath) {
      res.status(400).json({
        message: "Image required",
      });
    }
    const imageCloudinary = await uploadCloudinary(imagePath);
    const newUser = new User({
      firstName,
      lastName,
      email,
      userName,
      password,
      profilePicture: imageCloudinary.url,
    });
    await newUser.save()
    const createdUser = await User.findById(newUser._id)
      .select("-password -refreshToken")
      .lean();
    const confrimationtoken = await generateRandomToken(createdUser._id);
    newUser.confirmToken = confrimationtoken;
    await newUser.save();
    if (!createdUser) {
      res.status(400).json({
        message: "Error Occur While Creating User",
      });
    }

    res.status(200).json({
      message: "User Created Successfully",
      email: "Check Your Email Inbox to Activate Account",
    });
    await main(createdUser.email, confrimationtoken);
  } catch (error) {
    console.log(error);
  }
});
export const Logout = Asynchandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    res.status(400).json({
      message: "User Not Exists",
    });
  }
  const userResponse = await User.findByIdAndUpdate(
    userId,
    {
      $unset: {
        refreshToken: null,
      },
    },
    {
      new: true,
    },
  );
  console.log(userResponse);
  const options = {
    httpOnly: true,
    secure: true,
  };
  res
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .status(200)
    .json({
      message: "User Logout Successfully",
    });
});
export const refreshAccessToken = Asynchandler(async (req, res) => {
  const incomingRefreshToken = req.body.refreshToken;
  if (!incomingRefreshToken) {
    res.status(400).json({
      message: "Unauthorized Request",
    });
  }
  const decodedInfo = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET,
  );
  const user = await User.findById(decodedInfo?._id);
  if (!user.refreshToken) {
    res.status(400).json({
      message: "User Already Logout",
    });
  }
  if (incomingRefreshToken != user?.refreshToken) {
    res.status(400).json({
      message: "Refresh Token Is Expired or Used",
    });
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    res,
    decodedInfo?._id,
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  res.cookie("accessToken", accessToken, options);
  res.cookie("refreshToken", refreshToken, options);

  return res.status(200).json({
    message: "New Tokens Generated",
    refreshToken: refreshToken,
    accessToken: accessToken,
  });
});
export const verifyEmail = Asynchandler(async (req, res) => {
  const token = req.query.token;
  console.log(token)
  if (!token) {
    res.status(400).json({
      message: "No Confrimation Token",
    });
  }
  const user = await User.findOneAndUpdate(
    { confirmToken: token },
    {
      $unset: { confirmToken: 1 },
      $set: { isConfirmed: true },
    },
    { new: true }
  );

  console.log(user)
  if (user) {
    try {
      res.send("Email confirmed successfully!");
    } catch (error) {}
  } else {
    res.status(404).send("Invalid or expired token");
  }
});

export const forgetPasswordEmailVerification = Asynchandler(
  async (req, res) => {
    const { email } = req.body;
    if (!email) {
      res.status(404).json({
        message: "Please Provide the email",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({
        message: "User Not Found",
      });
    }
    const otp = generateOtp();
    const otpExpire = Date.now() + 3600000;
    await Otp.create({
      userId: user._id,
      otp,
      otpExpire,
    });
    res.status(200).json({
      message: "Please Check Email For Otp",
    });
    await forgetEmail(email, otp, "1 hour");
  },
);
export const verifyOtp = Asynchandler(async (req, res) => {
  const { otp, email } = req.body;
  if (!otp || !email) {
    res.status(404).json({
      message: "No Email or otp Code",
    });
  }
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404).json({
      message: "User Not Found",
    });
  }

  const otpFromSchema = await Otp.findOne({ userId: user._id });
  if (otpFromSchema.otpExpire < Date.now()) {
    return res.status(400).json({
      message: "OTP Expired",
    });
  }
  if (otpFromSchema.otp !== otp) {
    return res.status(400).json({
      message: "Invalid OTP",
    });
  }
  if (otpFromSchema.otp == otp) {
    await Otp.findByIdAndDelete(otpFromSchema._id);
    res.status(200).json({
      message: "Otp Verified",
      userId: user._id,
    });
  }
});
export const changePassowrd = Asynchandler(async (req, res) => {
  const { userId, newPassword } = req.body;
  if (!userId || !newPassword) {
    res.status(400).json({
      message: "No Userid or New Password",
    });
  }
  const user = await User.findById(userId);
  if (!user) {
    res.status(400).json({
      message: "User not found",
    });
  }
  user.password = newPassword;
  user.save({ validateBeforeSave: false });
  res.status(200).json({
    message: "Password Set/Changed Successfully",
  });
});

export const changeInformation=Asynchandler(async(req,res)=>{
  const {firstName,lastName,email,userName}=req.body;
  const user=req.user
  user.firstName=firstName
  user.lastName=lastName
  user.email=email
  user.userName=userName
  user.save({validateBeforeSave:false})
  res.status(200).json({
    message:"Success Info Changed Successfully",
  })

})

export const changeProfilePicture=Asynchandler(async(req,res)=>{
  console.log(req.user)
  res.status(200).json({message:"ok",data:req.user})
})