'use strict'

// Libas
const { ObjectId } = require('mongoDB')
// Database
const connectDb = require('./db')
// Handle Errors
const errorHandler = require('./errorHandler')

module.exports = {
  getCourses: async () => {
    try {
      const db = await connectDb()
      return await db.db('graphql').collection('courses').find().toArray()
    } catch (error) {
      errorHandler(error)
    }
  },
  getCourse: async (_, { id }) => {
    try {
      const db = await connectDb()
      return await db.db('graphql').collection('courses').findOne({ _id: ObjectId(id) })
    } catch (error) {
      errorHandler(error)
    }
  },
  getPeople: async () => {
    try {
      const db = await connectDb()
      return await db.db('graphql').collection('students').find().toArray()
    } catch (error) {
      errorHandler(error)
    }
  },
  getPerson: async (_, { id }) => {
    try {
      const db = await connectDb()
      return await db.db('graphql').collection('students').findOne({ _id: ObjectId(id) })
    } catch (error) {
      errorHandler(error)
    }
  },
  searchItems: async (_, { keyword }) => {
    try {
      const db = await connectDb()
      const courses = await db.db('graphql').collection('courses').find({ $text: { $search: keyword } }).toArray()
      const people = await db.db('graphql').collection('students').find({ $text: { $search: keyword } }).toArray()
      return [...courses, ...people]
    } catch (error) {
      errorHandler(error)
    }
  }
}
