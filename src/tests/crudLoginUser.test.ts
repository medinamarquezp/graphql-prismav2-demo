import { GQLServer } from '@src/GQLServer'
import apolloClient, { ApolloClient } from '@src/ApolloClient'
import cleanDB from '@tests/utils/cleanDB'
import {
  createUser,
  getUser,
  updateUserByID,
  deleteUserByID,
  login,
  me
} from '@tests/gqlQueries/UserGQLQueries'

beforeAll(async () => {
  await cleanDB()
  await GQLServer.start()
})

afterAll(() => {
  GQLServer.stop()
})

describe('CRUD User', () => {
  test('it should create a new user', async () => {
    const rs = await apolloClient.mutate({ mutation: createUser })
    expect(rs.data.createUser.username).toBe('pedro.medina.test')
    expect(rs.data.createUser.email).toBe('pedro.medina@e2etest.es')
  })
  test('it should get user by username', async () => {
    const rs = await apolloClient.query({ query: getUser })
    expect(rs.data.getUser.email).toBe('pedro.medina@e2etest.es')
  })
  test('it should update an existing user', async () => {
    const user = await apolloClient.query({ query: getUser })
    const { id } = user.data.getUser
    const updateUser = updateUserByID(id)
    const rs = await apolloClient.mutate({ mutation: updateUser })
    expect(rs.data.updateUser.name).toBe('Pedro Medina Editado')
  })
  test('it should delete an existing user', async () => {
    const user = await apolloClient.query({ query: getUser })
    const { id } = user.data.getUser
    const deleteUser = deleteUserByID(id)
    const rs = await apolloClient.mutate({ mutation: deleteUser })
    expect(rs.data.deleteUser.username).toBe('pedro.medina.test')
  })
  test('it should login with test credentials', async () => {
    await apolloClient.mutate({ mutation: createUser })
    const rs = await apolloClient.query({ query: login })
    const tokenFormat = /^[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$/
    expect(rs.data.login.token).toMatch(tokenFormat)
  })
  test('it should display data of user logged', async () => {
    const userLogged = await apolloClient.query({ query: login })
    const { token } = userLogged.data.login
    const client = ApolloClient.getInstance(token)
    const rs = await client.query({ query: me })
    expect(rs.data.me.username).toBe('pedro.medina.test')
    expect(rs.data.me.email).toBe('pedro.medina@e2etest.es')
  })
})
