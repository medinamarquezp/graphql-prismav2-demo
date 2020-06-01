import Seeder from '@seeds/Seeder'
import cleanDB from '@tests/utils/cleanDB'
import { GQLServer } from '@src/GQLServer'
import apolloClient, { ApolloClient } from '@src/ApolloClient'
import { login, createUser } from '@tests/gqlQueries/UserGQLQueries'
import {
  createList,
  getLists,
  getListById,
  updateList,
  deleteList
} from '@tests/gqlQueries/ListGQLQueries'

beforeAll(async () => {
  await cleanDB()
  await Seeder.seedUsers(5, true, true)
  await Seeder.seedLists(5, true, true)
  await GQLServer.start()
  await apolloClient.mutate({ mutation: createUser })
})

afterAll(() => {
  GQLServer.stop()
})

describe('CRUD List', () => {
  describe('Create a list', () => {
    test('It should display an error on create a list if user is not logged-in', async () => {
      await expect(apolloClient.mutate({ mutation: createList })).rejects.toThrowError(
        'Authorization is required on this transaction'
      )
    })
    test('Logged-in users will be able to create a new list', async () => {
      const userLogged = await apolloClient.query({ query: login })
      const { token } = userLogged.data.login
      const client = ApolloClient.getInstance(token)
      const rs = await client.mutate({ mutation: createList })
      expect(rs.data.createList.name).toBe('Nueva Lista E2E Test')
      expect(rs.data.createList.isPublic).toBeFalsy()
    })
  })

  describe('Read lists', () => {
    test('Unregistered users should only see public lists', async () => {
      const rs = await apolloClient.query({ query: getLists })
      const privateLists = rs.data.getLists.some(list => list.isPublic === false)
      expect(privateLists).toBeFalsy()
    })
    test('Logged-in users should see public lists and their own private lists', async () => {
      const userLogged = await apolloClient.query({ query: login })
      const { token } = userLogged.data.login
      const client = ApolloClient.getInstance(token)
      const rs = await client.query({ query: getLists })
      const lists = rs.data.getLists
      const publicList = lists.some(list => list.isPublic === true)
      const privateLists = lists.filter(list => list.isPublic === false)
      expect(publicList).toBeTruthy()
      expect(privateLists.length).toBe(1)
      expect(privateLists[0].name).toBe('Nueva Lista E2E Test')
    })
    test('Unregistered users will be able to search public lists by ID', async () => {
      const lists = await apolloClient.query({ query: getLists })
      const publicList = lists.data.getLists.find(list => list.isPublic === true)
      const { id, name, isPublic } = publicList
      const listToSearch = getListById(id)
      const listById = await apolloClient.query({ query: listToSearch })
      expect(listById.data.getList.name).toBe(name)
      expect(listById.data.getList.isPublic).toBe(isPublic)
    })
  })

  describe('Update a list', () => {
    test('It should display an error if user is not logged-in', async () => {
      const listToUpdate = updateList(12)
      await expect(apolloClient.mutate({ mutation: listToUpdate })).rejects.toThrowError(
        'Authorization is required on this transaction'
      )
    })
    test('It should display an error on try to update a list that not exists', async () => {
      const userLogged = await apolloClient.query({ query: login })
      const { token } = userLogged.data.login
      const client = ApolloClient.getInstance(token)
      const listToUpdate = updateList(1)
      await expect(client.mutate({ mutation: listToUpdate })).rejects.toThrowError(
        'GraphQL error: This List does not exists'
      )
    })
    test('Logged-in users will be able to update their own lists', async () => {
      const userLogged = await apolloClient.query({ query: login })
      const { token } = userLogged.data.login
      const client = ApolloClient.getInstance(token)
      const lists = await client.query({ query: getLists })
      const loggedUserList = lists.data.getLists.find(list => list.isPublic === false)
      const { id } = loggedUserList
      const listToUpdate = updateList(id)
      const updatedList = await client.mutate({ mutation: listToUpdate })
      expect(updatedList.data.updateList.name).toBe('Nueva Lista E2E Test ACTUALIZADA!')
    })
    test('It should display an error if an user try to update a list of other user', async () => {
      const userLogged = await apolloClient.query({ query: login })
      const { token } = userLogged.data.login
      const client = ApolloClient.getInstance(token)
      const lists = await client.query({ query: getLists })
      const otherUserList = lists.data.getLists.find(list => list.isPublic === true)
      const { id } = otherUserList
      const listToUpdate = updateList(id)
      await expect(client.mutate({ mutation: listToUpdate })).rejects.toThrowError(
        'Unauthorized to do this action'
      )
    })
  })

  describe('Delete a list', () => {
    test('It should display an error if user is not logged-in', async () => {
      const listToDelete = deleteList(12)
      await expect(apolloClient.mutate({ mutation: listToDelete })).rejects.toThrowError(
        'Authorization is required on this transaction'
      )
    })
    test('It should display an error on try to delete a list that not exists', async () => {
      const userLogged = await apolloClient.query({ query: login })
      const { token } = userLogged.data.login
      const client = ApolloClient.getInstance(token)
      const listToDelete = updateList(1)
      await expect(client.mutate({ mutation: listToDelete })).rejects.toThrowError(
        'GraphQL error: This List does not exists'
      )
    })
    test('Logged-in users will be able to delete their own lists', async () => {
      const userLogged = await apolloClient.query({ query: login })
      const { token } = userLogged.data.login
      const client = ApolloClient.getInstance(token)
      const lists = await client.query({ query: getLists })
      const loggedUserList = lists.data.getLists.find(list => list.isPublic === false)
      const { id } = loggedUserList
      const listToDelete = deleteList(id)
      const deletedList = await client.mutate({ mutation: listToDelete })
      expect(deletedList.data.deleteList.name).toBe('Nueva Lista E2E Test ACTUALIZADA!')
    })
    test('It should display an error if an user try to delete a list of other user', async () => {
      const userLogged = await apolloClient.query({ query: login })
      const { token } = userLogged.data.login
      const client = ApolloClient.getInstance(token)
      const lists = await client.query({ query: getLists })
      const otherUserList = lists.data.getLists.find(list => list.isPublic === true)
      const { id } = otherUserList
      const listToDelete = deleteList(id)
      await expect(client.mutate({ mutation: listToDelete })).rejects.toThrowError(
        'Unauthorized to do this action'
      )
    })
  })
})
