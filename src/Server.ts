import { GraphQLServer } from 'graphql-yoga';

export class Server {

  private _server: GraphQLServer
  private _uri: string
  private _port: number

  constructor({ server, uri, port }: { server: GraphQLServer; uri: string; port: number }) {
    this._server = server
    this._uri = uri
    this._port = port
  }

  start(): void 
  {
    const options = {
      port: this._port
    }
    this._server.start(options, ({port}) => {
      console.log(`Server listen on ${this._uri}:${port}`)
    })
  }

}

