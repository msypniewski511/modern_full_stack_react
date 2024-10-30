// src/__tests__/routes/postsRoutes.test.js

import request from 'supertest'
import express from 'express'
import { describe, it, expect, beforeAll, afterEach, jest } from '@jest/globals'
import { userRoutes } from '../../routes/users.js'
import { postsRoutes } from '../../routes/posts.js'
import { createPost } from '../../services/posts.js'

// Initialize express app and apply routes
const app = express()
app.use(express.json())
userRoutes(app)
postsRoutes(app)

describe('Posts Routes', () => {
  let token

  beforeAll(async () => {
    async function generateToken() {
      const mockUser = { username: 'testuser', password: 'password' }
      // First, create the user
      await request(app).post('/api/v1/user/signup').send(mockUser)

      const response = await request(app)
        .post('/api/v1/user/login')
        .send({ username: 'testuser', password: 'password' })

      return await response.body.token
    }

    token = await generateToken()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  // Set up sample data to use in tests
  let samplePost = {
    title: 'Sample Post',
    content: 'Test Content',
  }
  let createdPostId

  // GET /api/v1/posts
  describe('GET /api/v1/posts', () => {
    it('should return a list of all posts', async () => {
      const response = await request(app).get('/api/v1/posts')
      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Array)
    })

    it('should return 400 if both author and tag query parameters are provided', async () => {
      const response = await request(app).get(
        '/api/v1/posts?author=John&tag=tech',
      )
      expect(response.status).toBe(400)
      expect(response.body).toEqual({
        error: 'query by either author or tag, not both',
      })
    })
  })

  // GET /api/v1/posts/:id
  describe('GET /api/v1/posts/:id', () => {
    it('should return a post by id', async () => {
      const post = await createPost('6720ea18eb823b80f1084c87', samplePost) // Create a post first
      const response = await request(app).get(`/api/v1/posts/${post._id}`)
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('title', samplePost.title)
      createdPostId = post._id // Save the post ID for later tests
    })

    it('should return 404 if post is not found', async () => {
      const response = await request(app).get(
        '/api/v1/posts/000000000000000000000000',
      )
      expect(response.status).toBe(404)
    })
  })

  // POST /api/v1/posts
  describe('POST /api/v1/posts', () => {
    it('should create a new post', async () => {
      const response = await request(app)
        .post('/api/v1/posts')
        .set('Authorization', `Bearer ${token}`) // Set the token in the Authorization header
        .send(samplePost)
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('title', samplePost.title)
      createdPostId = response.body._id // Save created post ID
    })

    it('should return 500 for invalid post data', async () => {
      const response = await request(app)
        .post('/api/v1/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({})
      expect(response.status).toBe(500)
    })
  })

  // PATCH /api/v1/posts/:id
  describe('PATCH /api/v1/posts/:id', () => {
    it('should update an existing post', async () => {
      const updatedData = { title: 'Updated Title' }
      const response = await request(app)
        .patch(`/api/v1/posts/${createdPostId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData)
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('title', 'Updated Title')
    })

    it('should return 500 if there is an error updating', async () => {
      const response = await request(app)
        .patch('/api/v1/posts/unknownId')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Another Title' })
      expect(response.status).toBe(500)
    })
  })

  // DELETE /api/v1/posts/:id
  describe('DELETE /api/v1/posts/:id', () => {
    it('should delete a post by id', async () => {
      const response = await request(app)
        .delete(`/api/v1/posts/${createdPostId}`)
        .set('Authorization', `Bearer ${token}`)
      expect(response.status).toBe(204)
    })

    it('should return 404 if post is not found for deletion', async () => {
      const response = await request(app)
        .delete(`/api/v1/posts/000000000000000000000000`)
        .set('Authorization', `Bearer ${token}`)
      expect(response.status).toBe(404)
    })
  })
})
