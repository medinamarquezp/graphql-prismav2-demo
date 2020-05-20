import 'cross-fetch/polyfill'
import ApolloBoost from 'apollo-boost'

class ApolloClientSingleton {

  private static instance: any

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() { }

  static getInstance(): any {
    if(! ApolloClientSingleton.instance ) {
      ApolloClientSingleton.instance = new ApolloBoost({         
        uri: `${process.env.URI}:${process.env.PORT}`
      })
    }
    return ApolloClientSingleton.instance
  }

}

const apolloClient: any = ApolloClientSingleton.getInstance()

export { apolloClient as default }