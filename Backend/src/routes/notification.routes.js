import express from "express"
import { auth } from "../middleware/auth.middleware.js"
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../controllers/notification.controller.js"

const router = express.Router()

// All notification routes are protected
router.use(auth)

// Get notifications for current user
router.get("/", getNotifications)

// Mark notification as read
router.put("/:id/read", markNotificationAsRead)

// Mark all notifications as read
router.put("/read-all", markAllNotificationsAsRead)

export default router

