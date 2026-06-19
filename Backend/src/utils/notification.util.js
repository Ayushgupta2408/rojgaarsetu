import { Notification } from "../models/index.js"

// Create a new notification
const createNotification = async (userId, userType, message, type = "system", referenceId = null) => {
  try {
    const notification = new Notification({
      userId,
      userType,
      message,
      type,
      referenceId,
    })

    await notification.save()
    return { success: true, notification }
  } catch (error) {
    console.error("Error creating notification:", error)
    return { success: false, error }
  }
}

// Get unread notifications count for a user
const getUnreadCount = async (userId) => {
  try {
    const count = await Notification.countDocuments({ userId, isRead: false })
    return { success: true, count }
  } catch (error) {
    console.error("Error getting unread notifications count:", error)
    return { success: false, error }
  }
}

// Mark notification as read
const markAsRead = async (notificationId) => {
  try {
    const notification = await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true })

    if (!notification) {
      return { success: false, message: "Notification not found" }
    }

    return { success: true, notification }
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return { success: false, error }
  }
}

// Mark all notifications as read for a user
const markAllAsRead = async (userId) => {
  try {
    await Notification.updateMany({ userId, isRead: false }, { isRead: true })

    return { success: true }
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    return { success: false, error }
  }
}

export { createNotification, getUnreadCount, markAsRead, markAllAsRead }

