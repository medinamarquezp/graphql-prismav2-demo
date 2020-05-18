import path from 'path'
import { GraphQLServer } from 'graphql-yoga'
import { Server as HttpServer } from 'http';
import { resolvers } from './graphql/resolvers';

export class GqlServer 
{
  private static uri: string = process.env.URI 
  private static port: number = Number(process.env.PORT) as number
  private static typeDefs: string = path.join(__dirname, 'graphql', 'schema.graphql')
  private static gql: GraphQLServer = new GraphQLServer({ typeDefs: GqlServer.typeDefs, resolvers })
  private static http: HttpServer

  static async start(): Promise<HttpServer> 
  {
    return GqlServer.http = await GqlServer.gql.start({port: GqlServer.port}, () =>
      console.log(`Server is up and running at ${GqlServer.uri}:${GqlServer.port}`)
    );
  }

  static stop(): void 
  {
    GqlServer.http.close()
  }

}


