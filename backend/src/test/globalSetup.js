import { MongoMemoryServer } from 'mongodb-memory-server'

export default async function globalSetup() {
  const instance = await MongoMemoryServer.create({
    binary: {
      version: '6.0.4',
    },
  })
  global.__MONGOINSTANCE = instance
  process.env.DATABASE_URL = instance.getUri()
  process.env.JWT_SECRET = 'your_generated_secret_key'
}
