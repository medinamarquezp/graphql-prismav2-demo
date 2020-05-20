import { gql } from 'apollo-boost'
import { GQLServer } from '../GQLServer';
import apolloClient from '../ApolloClientSingleton'

beforeAll(async () => {
  await GQLServer.start()
})

afterAll(() => {
  GQLServer.stop()
})

describe('Server Test', () => {
  test('it should display "pong" when querying for "ping"', async () => {
    const ping = gql`
      query{
        ping
      }
    `
    const rs = await apolloClient.query({ query: ping })

    expect(rs.data.ping).toBe('pong')
  })
  
})