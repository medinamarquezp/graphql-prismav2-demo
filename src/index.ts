import path from 'path'
import { GraphQLServer } from 'graphql-yoga';
import { Server } from './Server';
import { resolvers } from './graphql/resolvers';

const typeDefs = path.join(__dirname, 'graphql', 'schema.graphql')

const server: GraphQLServer = new GraphQLServer({typeDefs, resolvers})
const uri: string = process.env.URI || 'http://127.0.0.1'
const port: number = Number(process.env.PORT) || 4000

const graphqlServer: Server = new Server({server, uri, port})

graphqlServer.start()