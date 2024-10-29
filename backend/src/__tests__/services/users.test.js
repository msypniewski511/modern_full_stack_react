import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { describe, expect, test, beforeEach, jest } from '@jest/globals'
import { User } from '../../db/models/user.js'
import { createUser, loginUser } from '../../services/users.js'

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createUser', () => {
    test('should hash the password and save the user', async () => {
      const mockUser = { username: 'testuser', password: 'plainpassword' }
      const hashedPassword = 'hashedpassword'

      // Explicitly mock bcrypt.hash to ensure it's a mock function
      bcrypt.hash = jest.fn().mockResolvedValue(hashedPassword)

      User.prototype.save = jest.fn().mockResolvedValue({
        _id: 'mockUserId',
        username: mockUser.username,
        password: hashedPassword,
      })

      const createdUser = await createUser(mockUser)

      // Check if bcrypt.hash was called with the correct arguments
      expect(bcrypt.hash).toHaveBeenCalledWith(mockUser.password, 10)

      // Check if the user was saved with the hashed password
      expect(User.prototype.save).toHaveBeenCalled()
      expect(createdUser).toMatchObject({
        _id: 'mockUserId',
        username: mockUser.username,
        password: hashedPassword,
      })
    })
  })

  describe('loginUser', () => {
    test('should throw an error if username is not found', async () => {
      // Explicitly mock User.findOne as a jest function
      User.findOne = jest.fn().mockResolvedValue(null)

      await expect(
        loginUser({ username: 'unknown', password: 'password' }),
      ).rejects.toThrow('invalid username!')

      expect(User.findOne).toHaveBeenCalledWith({ username: 'unknown' })
    })

    test('should throw an error if password is incorrect', async () => {
      const mockUser = { username: 'testuser', password: 'hashedpassword' }

      User.findOne.mockResolvedValue(mockUser)
      bcrypt.compare = jest.fn().mockResolvedValue(false) // Explicitly mock bcrypt.compare

      await expect(
        loginUser({ username: 'testuser', password: 'wrongpassword' }),
      ).rejects.toThrow('invalid password!')

      expect(bcrypt.compare).toHaveBeenCalledWith(
        'wrongpassword',
        mockUser.password,
      )
    })

    test('should return a token if username and password are correct', async () => {
      const mockUser = {
        _id: 'mockUserId',
        username: 'testuser',
        password: 'hashedpassword',
      }
      const mockToken = 'mockJwtToken'

      User.findOne.mockResolvedValue(mockUser)
      bcrypt.compare.mockResolvedValue(true)
      jwt.sign = jest.fn().mockReturnValue(mockToken) // Explicitly mock jwt.sign

      const token = await loginUser({
        username: 'testuser',
        password: 'correctpassword',
      })

      expect(bcrypt.compare).toHaveBeenCalledWith(
        'correctpassword',
        mockUser.password,
      )
      expect(jwt.sign).toHaveBeenCalledWith(
        { sub: mockUser._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' },
      )
      expect(token).toBe(mockToken)
    })
  })
})
