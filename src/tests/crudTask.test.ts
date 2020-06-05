import Seeder from '@seeds/Seeder'
import cleanDB from '@tests/utils/cleanDB'
import { GQLServer } from '@src/GQLServer'
import apolloClient from '@src/ApolloClient'
import loggedUserClient from '@tests/utils/loggedUserClient'
import { getLists, getListById, createList } from '@tests/gqlQueries/ListGQLQueries'
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskByIdWithNestedList
} from '@tests/gqlQueries/TaskGQLQueries'

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
  describe('Read tasks', () => {
    test('Unregistered users should only see public tasks', async () => {
      const tasks = await apolloClient.query({ query: getTasks })
      const privateTasks = tasks.data.getTasks.some(task => task.isPublic === false)
      expect(privateTasks).toBeFalsy()
    })
    test('Logged-in users should see public tasks and their own private tasks', async () => {
      const tasks = await client.query({ query: getTasks })
      const tasksData = tasks.data.getTasks
      const publicTasks = tasksData.some(task => task.isPublic === true)
      const privateTasks = tasksData.filter(task => task.isPublic === false)
      expect(publicTasks).toBeTruthy()
      expect(privateTasks.length).toBe(1)
      expect(privateTasks[0].title).toBe('Creación de tarea test E2E NEW!!!')
    })
    test('Logged-in users should be able to search their own private tasks by id', async () => {
      const tasks = await client.query({ query: getTasks })
      const privateTask = tasks.data.getTasks.find(task => task.isPublic === false)
      const { id, title, content } = privateTask
      const taskToSearch = getTaskById(id)
      const taskById = await client.query({ query: taskToSearch })
      expect(taskById.data.getTask.title).toBe(title)
      expect(taskById.data.getTask.content).toBe(content)
    })
  })
  describe('Update Task', () => {
    test('It should display an error if user is not logged-in', async () => {
      const taskToUpdate = updateTask(22)
      await expect(apolloClient.mutate({ mutation: taskToUpdate })).rejects.toThrowError(
        'Authorization is required on this transaction'
      )
    })
    test('It should display an error on try to update a task that not exists', async () => {
      const taskToUpdate = updateTask(2222)
      await expect(client.mutate({ mutation: taskToUpdate })).rejects.toThrowError(
        'GraphQL error: This Task does not exists'
      )
    })
    test('Logged-in users will be able to update their own tasks', async () => {
      const tasks = await client.query({ query: getTasks })
      const privateTask = tasks.data.getTasks.find(task => task.isPublic === false)
      const { id } = privateTask
      const taskToUpdate = updateTask(Number(id))
      const updatedTask = await client.mutate({ mutation: taskToUpdate })
      expect(updatedTask.data.updateTask.title).toBe('ACTUALIZACIÓN de tarea test E2E!!!')
      expect(updatedTask.data.updateTask.isPublic).toBeTruthy()
    })
    test('It should display an error if an user try to update a task of other user', async () => {
      const tasks = await apolloClient.query({ query: getTasks })
      const firstTaskId = Number(tasks.data.getTasks[0].id)
      const taskToUpdate = updateTask(firstTaskId)
      await expect(client.mutate({ mutation: taskToUpdate })).rejects.toThrowError(
        'GraphQL error: Unauthorized to do this action'
      )
    })
  })
  describe('Delete a Task', () => {
    test('It should display an error if user is not logged-in', async () => {
      const taskToDelete = deleteTask(22)
      await expect(apolloClient.mutate({ mutation: taskToDelete })).rejects.toThrowError(
        'Authorization is required on this transaction'
      )
    })
    test('It should display an error on try to delete a task that not exists', async () => {
      const taskToDelete = deleteTask(2222)
      await expect(client.mutate({ mutation: taskToDelete })).rejects.toThrowError(
        'GraphQL error: This Task does not exists'
      )
    })
    test('Logged-in users will be able to delete their own tasks', async () => {
      const tasks = await client.query({ query: getTasks })
      const privateTask = tasks.data.getTasks.find(task => task.isPublic === false)
      const { id } = privateTask
      const taskToDelete = deleteTask(Number(id))
      const deletedTask = await client.mutate({ mutation: taskToDelete })
      expect(deletedTask.data.deleteTask.title).toBe('ACTUALIZACIÓN de tarea test E2E!!!')
    })
    test('It should display an error if an user try to delete a task of other user', async () => {
      const tasks = await apolloClient.query({ query: getTasks })
      const firstTaskId = Number(tasks.data.getTasks[0].id)
      const taskToDelete = deleteTask(firstTaskId)
      await expect(client.mutate({ mutation: taskToDelete })).rejects.toThrowError(
        'GraphQL error: Unauthorized to do this action'
      )
    })
  })
  describe('Nested list', () => {
    test('It should display a nested list name of a task', async () => {
      const tasks = await client.query({ query: getTasks })
      const firstTaskId = Number(tasks.data.getTasks[0].id)
      const queryTask = getTaskByIdWithNestedList(firstTaskId)
      const taskWithNestedList = await client.query({ query: queryTask })
      const { id, name } = taskWithNestedList.data.getTask.list
      const queryList = getListById(Number(id))
      const list = await client.query({ query: queryList })
      expect(name).toBe(list.data.getList.name)
    })
  })
})
