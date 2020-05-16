import 'cross-fetch/polyfill'
import ApolloBoost, { gql } from 'apollo-boost' 
 
const apolloClient = new ApolloBoost({         
    uri: `${process.env.URI}:${process.env.PORT}`
}) 
 
export { apolloClient, gql } 