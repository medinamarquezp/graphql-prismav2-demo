import { GqlServer } from '../GqlServer';
import { apolloClient, gql } from './apolloClient'

beforeEach(async () => {
  await GqlServer.start()
})

afterEach(async () => {
  await GqlServer.stop()
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