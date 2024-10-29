import mongoose from 'mongoose'
import { describe, expect, test } from '@jest/globals'
import { createUser } from '../services/users'
import { User } from '../db/models/user.js'

describe('creating users', () => {
  test('with all parameters should succed', async () => {
    const user = {
      username: 'Maciej Sypniewski',
      password: 'password',
    }
    const createdUser = await createUser(user)
    expect(createdUser._id).toBeInstanceOf(mongoose.Types.ObjectId)
    const foundUser = await User.findById(createdUser._id)
    expect(foundUser.createdAt).toBeInstanceOf(Date)
    expect(foundUser.updatedAt).toBeInstanceOf(Date)
  })
  test('without username should fail', async () => {
    const user = {
      username: '',
      password: 'password',
    }
    try {
      await createUser(user)
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(err.message).toContain('`username` is required')
    }
  })
  test('with duplicate username should fail', async () => {
    const user1 = {
      username: 'UniqueUsername',
      password: 'password1',
    }
    const user2 = {
      username: 'UniqueUsername', // Same username as user1
      password: 'password2',
    }

    // Create the first user
    await createUser(user1)

    try {
      // Attempt to create a second user with the same username
      await createUser(user2)
    } catch (err) {
      expect(err.code).toBe(11000)
      expect(err.message).toContain('duplicate key error')
    }
  })
})
