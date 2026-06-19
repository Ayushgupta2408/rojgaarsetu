import { socketIO } from "../app.js"
import { createNotification } from "./notification.util.js"

// Send real-time notification
const sendRealTimeNotification = async (userId, userType, message, type = "system", referenceId = null) => {
  try {
    // Create notification in database
    const notificationResult = await createNotification(userId, userType, message, type, referenceId)

    if (!notificationResult.success) {
      return { success: false, error: notificationResult.error }
    }

    // Emit notification to user's room
    socketIO.to(userId.toString()).emit("notification", {
      notification: notificationResult.notification,
    })

    return { success: true, notification: notificationResult.notification }
  } catch (error) {
    console.error("Send real-time notification error:", error)
    return { success: false, error }
  }
}

export { sendRealTimeNotification }

