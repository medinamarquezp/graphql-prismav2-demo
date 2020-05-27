import 'cross-fetch/polyfill'
import ApolloBoost from 'apollo-boost'

class ApolloClient {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static getInstance(jwt): any {
    return new ApolloBoost({
      uri: `${process.env.URI}:${process.env.PORT}`,
      request(operation) {
        if (jwt) {
          operation.setContext({
            headers: {
              authorization: `Bearer ${jwt}`
            }
          })
        }
      }
    })
  }
}

const apolloClient: any = ApolloClient.getInstance(null)

export { apolloClient as default, ApolloClient }
