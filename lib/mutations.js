'use strict'

// Libs
const { ObjectId } = require('mongoDB')
// Database
const connectDb = require('./db')
// Handle Errors
const errorHandler = require('./errorHandler')

module.exports = {
  createCourse: async (_, { input }) => {
    try {
      const defaults = {
        teacher: '',
        topic: ''
      }
      const newCourse = { ...defaults, ...input }

      const db = await connectDb()

      const course = await db.db('graphql').collection('courses').insertOne(newCourse)

      return { ...newCourse, _id: course.insertedId }
    } catch (error) {
      console.error(error)
      return error
    }
  },
  editCourse: async (_, { _id, input }) => {
    try {
      const db = await connectDb()

      await db.db('graphql').collection('courses').updateOne(
        { _id: ObjectId(_id) }, { $set: input }
      )

      return await db.db('graphql').collection('courses').findOne({ _id: ObjectId(_id) })
    } catch (error) {
      errorHandler(error)
    }
  },
  deleteCourse: async (_, { _id }) => {
    try {
      const db = await connectDb()

      const info = await db.db('graphql').collection('courses').deleteOne({ _id: ObjectId(_id) })

      return info.deletedCount ? 'Delete success' : 'Delete failure'
    } catch (error) {
      errorHandler(error)
    }
  },
  createPerson: async (_, { input }) => {
    try {
      const db = await connectDb()

      const student = await db.db('graphql').collection('students').insertOne(input)

      return { ...input, _id: student.insertedId }
    } catch (error) {
      errorHandler(error)
    }
  },
  editPerson: async (_, { _id, input }) => {
    try {
      const db = await connectDb()

      await db.db('graphql').collection('students').updateOne(
        { _id: ObjectId(_id) }, { $set: input }
      )

      return await db.db('graphql').collection('students').findOne({ _id: ObjectId(_id) })
    } catch (error) {
      errorHandler(error)
    }
  },
  deletePerson: async (_, { _id }) => {
    try {
      const db = await connectDb()

      const info = await db.db('graphql').collection('students').deleteOne({ _id: ObjectId(_id) })

      return info.deletedCount ? 'Delete success' : 'Delete failure'
    } catch (error) {
      errorHandler(error)
    }
  },
  addPeople: async (_, { courseId, personId }) => {
    try {
      const db = await connectDb()

      const person = await db.db('graphql').collection('students').findOne({ _id: ObjectId(personId) })
      const course = await db.db('graphql').collection('courses').findOne({ _id: ObjectId(courseId) })

      if (!course || !person) throw new Error('The person or course could not be found')

      await db.db('graphql').collection('courses').updateOne(
        { _id: ObjectId(courseId) }, { $addToSet: { people: ObjectId(personId) } })

      return course
    } catch (error) {
      errorHandler(error)
    }
  }
}
