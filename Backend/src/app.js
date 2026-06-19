import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"
import http from "http"
import helmet from "helmet"
import connectDB from "./db/index.js"

dotenv.config({ path: "./.env" })

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const server = http.createServer(app)

const allowedOrigins = (process.env.FRONTEND_URLS || "https://rojgaarsetu.netlify.app")
  .split(",")

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}

app.use(cors(corsOptions))
app.use(helmet())
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use("/temp", express.static(path.join(__dirname, "temp")))

const port = process.env.PORT || 3000

import authRoutes from "./routes/auth.routes.js"
import profileRoutes from "./routes/profile.routes.js"
import workerRoutes from "./routes/worker.routes.js"
import contractorRoutes from "./routes/contractor.routes.js"
import ownerRoutes from "./routes/owner.routes.js"
import notificationRoutes from "./routes/notification.routes.js"
import pdfRoutes from "./routes/pdf.routes.js"
import recommendationRoutes from "./routes/recommendation.routes.js"
import jobRoutes from "./routes/job.routes.js"
import vehicleRoutes from "./routes/vehicle.routes.js"

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/profile", profileRoutes)
app.use("/api/v1/worker", workerRoutes)
app.use("/api/v1/contractor", contractorRoutes)
app.use("/api/v1/owner", ownerRoutes)
app.use("/api/v1/notifications", notificationRoutes)
app.use("/api/v1/pdf", pdfRoutes)
app.use("/api/v1/recommendations", recommendationRoutes)
app.use("/api/v1/jobs", jobRoutes)
app.use("/api/v1/vehicles", vehicleRoutes)

app.get("/", (req, res) => {
  res.json({ message: "Gig Worker API is running" })
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  })
})

connectDB()
  .then(() => {
    server.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`)
    })
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err)
  })

export default app
