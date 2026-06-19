import nodemailer from "nodemailer"
import User from "../models/user.model.js"

// Create Nodemailer transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })
}

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Save OTP to user document
const saveOTP = async (userId, otp) => {
  try {
    // OTP expires in 10 minutes
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10)

    await User.findByIdAndUpdate(userId, {
      otp: {
        code: otp,
        expiresAt,
      },
    })

    return true
  } catch (error) {
    console.error("Error saving OTP:", error)
    return false
  }
}

// Send OTP via Email
const sendOTPByEmail = async (email, otp) => {
  try {
    const transporter = createTransporter()

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: "Your Verification Code for Gig Worker App",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333; text-align: center;">Verification Code</h2>
          <p style="font-size: 16px; color: #555;">Your verification code for Gig Worker App is:</p>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="font-size: 14px; color: #777;">This code will expire in 10 minutes.</p>
          <p style="font-size: 14px; color: #777;">If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    }

    // Send email
    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error("Error sending OTP email:", error)
    return false
  }
}

// Verify OTP
const verifyOTP = async ({ userId, email, otpToVerify }) => {
  try {
    let user;

    // Step 1: Get user by ID or email
    if (userId) {
      user = await User.findById(userId);
    } else if (email) {
      user = await User.findOne({ email });
    }

    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Step 2: Check if OTP exists
    if (!user.otp || !user.otp.code) {
      return { success: false, message: "No OTP found for this user" };
    }

    // Step 3: Check expiration
    if (new Date() > new Date(user.otp.expiresAt)) {
      return { success: false, message: "OTP has expired" };
    }

    // Step 4: Validate OTP
    if (user.otp.code !== otpToVerify) {
      return { success: false, message: "Invalid OTP" };
    }

    // Step 5: Mark as verified and clear OTP
    user.otpVerified = true;
    user.otp = undefined;
    await user.save();

    return { success: true, message: "OTP verified successfully" };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { success: false, message: "Server error" };
  }
};

// Generate and send OTP
const generateAndSendOTP = async ({ userId, email }) => {
  try {
    let user;

    // Get user by ID or email
    if (userId) {
      user = await User.findById(userId);
    } else if (email) {
      user = await User.findOne({ email });
    } else {
      return { success: false, message: "User ID or Email is required" };
    }

    if (!user) {
      return { success: false, message: "User not found" };
    }

    const otp = generateOTP();
    const saved = await saveOTP(user._id, otp);

    if (!saved) {
      return { success: false, message: "Failed to save OTP" };
    }

    const sent = await sendOTPByEmail(user.email, otp);

    if (!sent) {
      return { success: false, message: "Failed to send OTP email" };
    }

    return { success: true, message: "OTP sent successfully to your email" };
  } catch (error) {
    console.error("Error generating and sending OTP:", error);
    return { success: false, message: "Server error" };
  }
};

export { generateOTP, saveOTP, sendOTPByEmail, verifyOTP, generateAndSendOTP }
