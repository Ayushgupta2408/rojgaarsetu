// Middleware to validate request body fields
const validateFields = (requiredFields) => {
    return (req, res, next) => {
      const missingFields = requiredFields.filter((field) => !req.body[field])
  
      if (missingFields.length > 0) {
        return res.status(400).json({
          message: "Missing required fields",
          missingFields,
        })
      }
  
      next()
    }
  }
  
  // Middleware to validate numeric fields
  const validateNumeric = (fields) => {
    return (req, res, next) => {
      const invalidFields = []
  
      for (const [field, options] of Object.entries(fields)) {
        const value = req.body[field]
  
        // Skip if field is not present
        if (value === undefined) continue
  
        // Check if value is a number
        if (isNaN(value)) {
          invalidFields.push(`${field} must be a number`)
          continue
        }
  
        // Check minimum value if specified
        if (options.min !== undefined && value < options.min) {
          invalidFields.push(`${field} must be at least ${options.min}`)
        }
  
        // Check maximum value if specified
        if (options.max !== undefined && value > options.max) {
          invalidFields.push(`${field} must be at most ${options.max}`)
        }
      }
  
      if (invalidFields.length > 0) {
        return res.status(400).json({
          message: "Invalid field values",
          errors: invalidFields,
        })
      }
  
      next()
    }
  }
  
  export { validateFields, validateNumeric }
  