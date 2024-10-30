import { createUser, loginUser } from '../services/users.js'

export function userRoutes(app) {
  app.post('/api/v1/user/signup', async (req, res) => {
    try {
      const user = await createUser(req.body)
      return res.status(201).json({ username: user.username })
    } catch (err) {
      console.error(err)
      // Check for specific error messages to respond accordingly
      if (err.code === 11000) {
        // Duplicate key error, usually for unique fields like username
        return res.status(400).json({
          error: 'Username already exists.',
        })
      }
      return res.status(400).json({
        error: 'Failed to create the user. Please check your input.',
      })
    }
  })
  app.post('/api/v1/user/login', async (req, res) => {
    try {
      const token = await loginUser(req.body)
      return res.status(200).send({ token })
    } catch (err) {
      console.error(err)
      // Adjust the status code and message based on the type of error
      return res.status(401).json({
        error: 'Login failed. Please check your username and password.',
      })
    }
  })
}
