import path from 'path'
import { Server as HttpServer } from 'http'
import { GraphQLServer } from 'graphql-yoga'
import { resolvers } from '@graphql/resolvers'

export class GQLServer {
  private static uri: string = process.env.URI 
  private static port: number = Number(process.env.PORT) as number
  private static typeDefs: string = path.join(__dirname, 'graphql', 'schema.graphql')
  private static gql: GraphQLServer = new GraphQLServer({ typeDefs: GQLServer.typeDefs, resolvers })
  private static http: HttpServer

  static async start(): Promise<HttpServer> {
    return GQLServer.http = await GQLServer.gql.start({port: GQLServer.port}, () =>
      console.log(`Server is up and running at ${GQLServer.uri}:${GQLServer.port}`)
    );
  }

  static stop(): void {
    GQLServer.http.close()
  }

}


