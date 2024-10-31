import mongoose from 'mongoose'

export function initDatabase() {
  const DATABASE_URL = process.env.DATABASE_URL
  mongoose.connection.on('open', () => {
    const environment = process.env.NODE_ENV || 'development'

    environment != 'test' && console.log(`Current environment: ${environment}`)
    environment != 'test' &&
      console.info('successfully connected to database:', DATABASE_URL)
  })
  const connection = mongoose.connect(DATABASE_URL)
  return connection
}
