import { MongoMemoryServer } from 'mongodb-memory-server'

export default async function globalSetup() {
  const instance = await MongoMemoryServer.create({
    binary: {
      version: '6.0.4',
    },
  })
  global.__MONGOINSTANCE = instance
  process.env.DATABASE_URL = instance.getUri()
  process.env.JWT_SECRET =
    'd1c41b5c66b9f1e7419f1104ae922a142ffd234c9a17f4b8887f04472dde48489ba051bf5ac00c848bdcec76673dc1e259614f257d39715de2846069727f7cff'
}
