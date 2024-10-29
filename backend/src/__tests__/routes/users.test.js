import request from 'supertest'
import express from 'express'
import { describe, it, expect } from '@jest/globals'
import { userRoutes } from '../../routes/users.js'

// Create a new Express application
const app = express()
app.use(express.json())
userRoutes(app)

describe('User Routes', () => {
  describe('POST /api/v1/user/signup', () => {
    it('should create a new user and return the username', async () => {
      const mockUser = { username: 'testuser', password: 'password' }

      const response = await request(app)
        .post('/api/v1/user/signup')
        .send(mockUser)

      expect(response.status).toBe(201)
      expect(response.body).toEqual({ username: 'testuser' })
    })

    it('should return 400 if the username already exists', async () => {
      const mockUser = { username: 'testuser', password: 'password' }

      // Create the first user
      await request(app).post('/api/v1/user/signup').send(mockUser)

      // Try to create the same user again
      const response = await request(app)
        .post('/api/v1/user/signup')
        .send(mockUser)

      expect(response.status).toBe(400)
      expect(response.body).toEqual({
        error: 'Username already exists.',
      })
    })

    it('should return 400 for general errors', async () => {
      const mockUser = { username: 'testuser', password: 'short' } // Assuming your validation checks for password length

      const response = await request(app)
        .post('/api/v1/user/signup')
        .send(mockUser)

      expect(response.status).toBe(400)
      expect(response.body).toEqual({
        error: 'Username already exists.',
      })
    })
  })

  describe('POST /api/v1/user/login', () => {
    it('should return a token on successful login', async () => {
      const mockUser = { username: 'testuser', password: 'password' }

      // First, create the user
      await request(app).post('/api/v1/user/signup').send(mockUser)

      const response = await request(app)
        .post('/api/v1/user/login')
        .send({ username: 'testuser', password: 'password' })
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('token')
    })

    it('should return 401 for invalid username or password', async () => {
      const mockUser = { username: 'testuser', password: 'password' }

      // First, create the user
      await request(app).post('/api/v1/user/signup').send(mockUser)

      const response = await request(app)
        .post('/api/v1/user/login')
        .send({ username: 'testuser', password: 'wrongpassword' })

      expect(response.status).toBe(401)
      expect(response.body).toEqual({
        error: 'Login failed. Please check your username and password.',
      })
    })
  })
})