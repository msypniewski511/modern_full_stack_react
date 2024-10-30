// test/helper.js

import { User } from '../db/models/user.js'

export async function createTestUser() {
  const user = new User({ username: 'Daniel Bugl', password: 'password' })
  await user.save()
  return user._id
}
