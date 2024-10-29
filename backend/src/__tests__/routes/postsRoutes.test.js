// src/__tests__/routes/postsRoutes.test.js

import request from 'supertest'
import { describe, it, expect } from '@jest/globals'
import express from 'express'
import { postsRoutes } from '../../routes/posts.js'
import { createPost } from '../../services/posts.js'

// Initialize express app and apply routes
const app = express()
app.use(express.json())
postsRoutes(app)

describe('Posts Routes', () => {
  // Set up sample data to use in tests
  let samplePost = {
    title: 'Sample Post',
    content: 'Test Content',
    author: '6720ea18eb823b80f1084c87',
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
      const post = await createPost(samplePost) // Create a post first
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
      const response = await request(app).post('/api/v1/posts').send(samplePost)
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('title', samplePost.title)
      createdPostId = response.body._id // Save created post ID
    })

    it('should return 500 for invalid post data', async () => {
      const response = await request(app).post('/api/v1/posts').send({})
      expect(response.status).toBe(500)
    })
  })

  // PATCH /api/v1/posts/:id
  describe('PATCH /api/v1/posts/:id', () => {
    it('should update an existing post', async () => {
      const updatedData = { title: 'Updated Title' }
      const response = await request(app)
        .patch(`/api/v1/posts/${createdPostId}`)
        .send(updatedData)
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('title', 'Updated Title')
    })

    it('should return 500 if there is an error updating', async () => {
      const response = await request(app)
        .patch('/api/v1/posts/unknownId')
        .send({ title: 'Another Title' })
      expect(response.status).toBe(500)
    })
  })

  // DELETE /api/v1/posts/:id
  describe('DELETE /api/v1/posts/:id', () => {
    it('should delete a post by id', async () => {
      const response = await request(app).delete(
        `/api/v1/posts/${createdPostId}`,
      )
      expect(response.status).toBe(204)
    })

    it('should return 404 if post is not found for deletion', async () => {
      const response = await request(app).delete(
        `/api/v1/posts/000000000000000000000000`,
      )
      expect(response.status).toBe(404)
    })
  })
})
