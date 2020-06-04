import apolloClient, { ApolloClient } from '@src/ApolloClient'
import { login, getUser, createUser } from '@tests/gqlQueries/UserGQLQueries'

const loggedUserClient = async () => {
  const testUser = await apolloClient.query({ query: getUser })
  if (testUser.data.getUser === null) {
    await apolloClient.mutate({ mutation: createUser })
  }
  const userLogged = await apolloClient.query({ query: login })
  const { token } = userLogged.data.login
  return ApolloClient.getInstance(token)
}

export default loggedUserClient
