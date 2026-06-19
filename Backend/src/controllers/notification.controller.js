import { Notification } from "../models/index.js"
import { markAsRead, markAllAsRead } from "../utils/notification.util.js"

// Get notifications for current user
const getNotifications = async (req, res) => {
  try {
    const userId = req.userId

    // Get notifications with pagination
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit)

    const total = await Notification.countDocuments({ userId })
    const unreadCount = await Notification.countDocuments({ userId, isRead: false })

    res.json({
      notifications,
      unreadCount,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get notifications error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Mark notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.userId

    // Check if notification exists and belongs to this user
    const notification = await Notification.findOne({
      _id: id,
      userId,
    })

    if (!notification) {
      return res.status(404).json({ message: "Notification not found or unauthorized" })
    }

    const result = await markAsRead(id)

    if (!result.success) {
      return res.status(500).json({ message: "Failed to mark notification as read" })
    }

    res.json({ message: "Notification marked as read" })
  } catch (error) {
    console.error("Mark notification as read error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Mark all notifications as read
const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.userId

    const result = await markAllAsRead(userId)

    if (!result.success) {
      return res.status(500).json({ message: "Failed to mark all notifications as read" })
    }

    res.json({ message: "All notifications marked as read" })
  } catch (error) {
    console.error("Mark all notifications as read error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export { getNotifications, markNotificationAsRead, markAllNotificationsAsRead }

