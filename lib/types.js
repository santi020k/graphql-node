'use strict'

// Libs
const { ObjectId } = require('mongoDB')
// Database
const connectDb = require('./db')
// Handle Errors
const errorHandler = require('./errorHandler')

module.exports = {
  Course: {
    people: async ({ people }) => {
      try {
        const db = await connectDb()
        const ids = people ? people.map(id => ObjectId(id)) : []
        return ids.length > 0
          ? await db.db('graphql').collection('students').find(
              { _id: { $in: ids } }
            ).toArray()
          : []
      } catch (error) {
        errorHandler(error)
      }
    }
  },
  Person: {
    __resolveType: (person, context, info) => {
      if (person.phone) {
        return 'Monitor'
      } else {
        return 'Student'
      }
    }
  },
  GlobalSearch: {
    __resolveType: (item, context, info) => {
      if (item.title) {
        return 'Course'
      }

      if (item.phone) {
        return 'Monitor'
      }

      return 'Student'
    }
  }
}
