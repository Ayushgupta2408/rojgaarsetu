import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email address"],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  userType: {
    type: String,
    enum: {
      values: ["Worker", "Contractor", "Owner"],
      message: "User type must be Worker, Contractor, or Owner",
    },
    required: [true, "User type is required"],
  },
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "userType",
  },
  otpVerified: { type: Boolean, default: false },
  otp: {
    code: { type: String },
    expiresAt: { type: Date },
  },
  createdAt: { type: Date, default: Date.now },
})

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next()
  }

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

// Generate JWT token
UserSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      id: this._id,
      userType: this.userType,
      profileId: this.profileId,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  )
}

const User = mongoose.model("User", UserSchema)

export default User
