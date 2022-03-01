'use strict'

// Load Env
require('dotenv').config()
// Libs
const { makeExecutableSchema } = require('@graphql-tools/schema')
const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { readFileSync } = require('fs')
const { join } = require('path')
const cors = require('cors')
// Resolvers
const resolvers = require('./lib/resolvers')
// Server
const app = express()
const port = process.env.PORT || 3000
const isDev = process.env.NODE_ENV !== 'production'

// Schema define
const typeDefs = readFileSync(
  join(__dirname, 'lib', 'schema.graphql'),
  'utf-8'
)
const schema = makeExecutableSchema({ typeDefs, resolvers })

app.use(cors)

app.use('/api', graphqlHTTP({
  schema,
  rootValue: resolvers,
  graphiql: isDev
}))

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}/api`)
})
