'use strict'

// Libs
const { MongoClient } = require('mongodb')
// Environments
const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST
} = process.env

const mongoUrl = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}?retryWrites=true&w=majority`

let connection

async function connectDB () {
  if (connection) return connection

  let client
  try {
    client = new MongoClient(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    connection = await client.connect()
  } catch (error) {
    console.error('Could not connect to db', mongoUrl, error)
    process.exit(1)
  }

  return connection
}

module.exports = connectDB
