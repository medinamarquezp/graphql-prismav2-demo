import Seeder from '@seeds/Seeder'
import cleanDB from '@tests/utils/cleanDB'
import { GQLServer } from '@src/GQLServer'
import apolloClient from '@src/ApolloClient'
import loggedUserClient from '@tests/utils/loggedUserClient'
import { getLists, createList } from '@tests/gqlQueries/ListGQLQueries'
import { createTask } from '@tests/gqlQueries/TaskGQLQueries'

let client: any

beforeAll(async () => {
  await cleanDB()
  await Seeder.seedUsers(5, true, true)
  await Seeder.seedLists(5, true, true)
  await Seeder.seedTasks(10, true, true)
  await GQLServer.start()
  client = await loggedUserClient()
})

afterAll(() => {
  GQLServer.stop()
})

describe('Crud Task', () => {
  describe('Create a task', () => {
    test('It should display an error if user is not logged-in', async () => {
      const taskToCreate = createTask(22)
      await expect(apolloClient.mutate({ mutation: taskToCreate })).rejects.toThrowError(
        'Authorization is required on this transaction'
      )
    })
    test('It should display an error if related list do not exists', async () => {
      const taskToCreate = createTask(2222)
      await expect(client.mutate({ mutation: taskToCreate })).rejects.toThrowError(
        'GraphQL error: Related list does not exists'
      )
    })
    test('It should display an error on creating a task if user is not owner of related list', async () => {
      const lists = await apolloClient.query({ query: getLists })
      const firstListId = Number(lists.data.getLists[0].id)
      const taskToCreate = createTask(firstListId)
      await expect(client.mutate({ mutation: taskToCreate })).rejects.toThrowError(
        'GraphQL error: Unauthorized to do this action'
      )
    })
    test('Logged-in users should be able to create a task related to their own lists', async () => {
      const listCreated = await client.mutate({ mutation: createList })
      const createdlistId = Number(listCreated.data.createList.id)
      const taskToCreate = createTask(createdlistId)
      const createdTask = await client.mutate({ mutation: taskToCreate })
      const { title, content, isPublic } = createdTask.data.createTask
      expect(title).toBe('Creación de tarea test E2E NEW!!!')
      expect(content).toBe('Este el contenido de la nueva tarea creada desde un test E2E')
      expect(isPublic).toBeFalsy()
    })
  })
})
