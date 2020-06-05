import cleanDB from '@tests/utils/cleanDB'
import { GQLServer } from '@src/GQLServer'
import apolloClient, { ApolloClient } from '@src/ApolloClient'
import { createList } from '@tests/gqlQueries/ListGQLQueries'

import {
  createUser,
  getUser,
  updateUserByID,
  deleteUserByID,
  login,
  me,
  getUsersWithNestedLists
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
    const userCreated = await apolloClient.mutate({ mutation: createUser })
    expect(userCreated.data.createUser.username).toBe('pedro.medina.test')
    expect(userCreated.data.createUser.email).toBe('pedro.medina@e2etest.es')
  })
  test('it should get user by username', async () => {
    const user = await apolloClient.query({ query: getUser })
    expect(user.data.getUser.email).toBe('pedro.medina@e2etest.es')
  })
  test('it should update an existing user', async () => {
    const user = await apolloClient.query({ query: getUser })
    const { id } = user.data.getUser
    const updateUser = updateUserByID(id)
    const updatedUser = await apolloClient.mutate({ mutation: updateUser })
    expect(updatedUser.data.updateUser.name).toBe('Pedro Medina Editado')
  })
  test('it should delete an existing user', async () => {
    const user = await apolloClient.query({ query: getUser })
    const { id } = user.data.getUser
    const deleteUser = deleteUserByID(id)
    const deletedUser = await apolloClient.mutate({ mutation: deleteUser })
    expect(deletedUser.data.deleteUser.username).toBe('pedro.medina.test')
  })
  test('it should login with test credentials', async () => {
    await apolloClient.mutate({ mutation: createUser })
    const loggedUser = await apolloClient.query({ query: login })
    const tokenFormat = /^[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$/
    expect(loggedUser.data.login.token).toMatch(tokenFormat)
  })
  test('it should display data of user logged', async () => {
    const loggedUser = await apolloClient.query({ query: login })
    const { token } = loggedUser.data.login
    const client = ApolloClient.getInstance(token)
    const loggedUserData = await client.query({ query: me })
    expect(loggedUserData.data.me.username).toBe('pedro.medina.test')
    expect(loggedUserData.data.me.email).toBe('pedro.medina@e2etest.es')
  })
  test('Unregistered users should only see public lists', async () => {
    const usersWithNestedLists = await apolloClient.query({ query: getUsersWithNestedLists })
    const lists = usersWithNestedLists.data.getUsers.map(user => user.lists)
    const isPublic = list => list.isPublic === true
    const checkIfAllListsArePublic = lists.flat().every(isPublic)
    expect(checkIfAllListsArePublic).toBeTruthy()
  })
  test('Logged-in users should see public and their own private lists', async () => {
    const loggedUser = await apolloClient.query({ query: login })
    const { token } = loggedUser.data.login
    const client = ApolloClient.getInstance(token)
    await client.mutate({ mutation: createList })
    const usersWithNestedLists = await client.query({ query: getUsersWithNestedLists })
    const userLists = usersWithNestedLists.data.getUsers.map(user => user.lists)
    const privateLists = userLists.flat().filter(list => list.isPublic === false)
    expect(privateLists.length).toBe(1)
    expect(privateLists[0].name).toBe('Nueva Lista E2E Test')
    expect(privateLists[0].isPublic).toBeFalsy()
  })
})
