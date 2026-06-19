import { User, Worker, Contractor, Owner } from "../models/index.js"
import { generateAndSendOTP, verifyOTP } from "../utils/otp.util.js"

// Register a new user
const register = async (req, res) => {
  try {
    const { name, email, phone, password, userType } = req.body

    // Validate required fields
    if (!name || !email || !phone || !password || !userType) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields: {
          name: !name,
          email: !email,
          phone: !phone,
          password: !password,
          userType: !userType,
        },
      })
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address" })
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" })
    }

    // Validate user type
    const validUserTypes = ["Worker", "Contractor", "Owner"]
    if (!validUserTypes.includes(userType)) {
      return res.status(400).json({ message: "User type must be Worker, Contractor, or Owner" })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" })
    }

    // Create profile based on user type
    let profile

    if (userType === "Worker") {
      profile = new Worker({ name, email, phone })
    } else if (userType === "Contractor") {
      profile = new Contractor({ name, email, phone })
    } else if (userType === "Owner") {
      profile = new Owner({ name, email, phone })
    } else {
      return res.status(400).json({ message: "Invalid user type" })
    }

    // Save profile
    await profile.save()

    // Create user
    const user = new User({
      name,
      email,
      phone,
      password,
      userType,
      profileId: profile._id,
    })

    // Save user
    await user.save()

    // Generate and send OTP
    const otpResult = await generateAndSendOTP({ userId: user._id });

    if (!otpResult.success) {
      return res.status(500).json({ message: otpResult.message })
    }

    // Generate token
    const token = user.generateAuthToken()

    // Return user data and token
    res.status(201).json({
      message: "User registered successfully. Please verify your account with the OTP sent to your email.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        profileId: user.profileId,
        otpVerified: user.otpVerified,
      },
      token,
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "User not exist, register first to login" })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong Password" })
    }

    // Generate token
    const token = user.generateAuthToken()

    // Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // false in dev
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // lax in dev
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    // Return user data and token
    res.json({
      message: "Logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        profileId: user.profileId,
        otpVerified: user.otpVerified,
      },
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Logout user
const logout = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie("token")

    res.json({ message: "Logged out successfully" })
  } catch (error) {
    console.error("Logout error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Verify OTP
const verifyUserOTP = async (req, res) => {
  try {
    const { userId, email, otp } = req.body;

    if ((!userId && !email) || !otp) {
      return res.status(400).json({ message: "User ID or Email and OTP are required" });
    }

    const result = await verifyOTP({ userId, email, otpToVerify: otp });

    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    // Get user using userId or email
    const user = userId 
      ? await User.findById(userId)
      : await User.findOne({ email });

    if (user) {
      // Update profile's otpVerified status based on user type
      if (user.userType === "Worker") {
        await Worker.findByIdAndUpdate(user.profileId, { otpVerified: true });
      } else if (user.userType === "Contractor") {
        await Contractor.findByIdAndUpdate(user.profileId, { otpVerified: true });
      } else if (user.userType === "Owner") {
        await Owner.findByIdAndUpdate(user.profileId, { otpVerified: true });
      }
    }

    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Resend OTP
const resendOTP = async (req, res) => {
  try {
    let { userId, email } = req.body;

    if (!userId && !email) {
      return res.status(400).json({ message: "userId or email is required" });
    }

    let user;

    if (!userId && email) {
      user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found with provided email" });
      }
      userId = user._id; // fallback to use userId after fetching by email
    }

    const otpResult = await generateAndSendOTP({ userId, email });

    if (!otpResult.success) {
      return res.status(500).json({ message: otpResult.message });
    }

    return res.status(200).json({ message: otpResult.message });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Get profile data based on user type
    let profile

    if (user.userType === "Worker") {
      profile = await Worker.findById(user.profileId)
    } else if (user.userType === "Contractor") {
      profile = await Contractor.findById(user.profileId)
    } else if (user.userType === "Owner") {
      profile = await Owner.findById(user.profileId)
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        profileId: user.profileId,
        otpVerified: user.otpVerified,
      },
      profile,
    })
  } catch (error) {
    console.error("Get current user error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export { register, login, logout, verifyUserOTP, resendOTP, getCurrentUser }
