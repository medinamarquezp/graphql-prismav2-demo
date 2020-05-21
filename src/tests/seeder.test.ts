import Seeder from '@seeds/Seeder'
import cleanDB from './utils/cleanDB'
import client from '@store/PrismaClientSingleton'

let users: any
let lists: any
let tasks: any
const totalUsers = 5
const totalLists = 3
const totalTasks = 12

const random = (max: number) => Math.floor(Math.random() * max)

beforeAll(async () => {
  await cleanDB()
  users = await Seeder.seedUsers(totalUsers, true, true)
  lists = await Seeder.seedLists(totalLists, true, true)
  tasks = await Seeder.seedTasks(totalTasks, true, true)
})

describe('Seed Users locally', () => {
  test('Users seed length should be 5', async () => {
    const totalUsersAddingMock = totalUsers + 1
    expect(users.length).toBe(totalUsersAddingMock)
  })
  test('User\'s name should have two words', async () => {
    expect(users[random(totalUsers)].data.name.split(' ').length).toBe(2)
  })
  test('User\'s email should have an @', async () => {
    expect(users[random(totalUsers)].data.email.indexOf('@')).not.toBe(-1)
  })
  test('User\'s token should have 24 characters', async () => {
    expect(users[random(totalUsers)].data.token.length).toBe(24)
  })
})

describe('Seed Lists locally', () => {
  test('Lists seed length should be 3', async () => {
    const totalListsAddingMock = totalLists + 1
    expect(lists.length).toBe(totalListsAddingMock)
  })
  test('List\'s name should have two words', async () => {
    expect(lists[random(totalLists)].data.name.split(' ').length).toBe(2)
  })
  test('Lits\'s isPublic should be boolean', async () => {
    expect(typeof lists[random(totalLists)].data.isPublic).toBe('boolean')
    expect(lists[random(totalLists)].data.isPublic).toEqual(expect.any(Boolean))
  })
})

describe('Seed Tasks locally', () => {
  test('Tasks seed length should be 12', async () => {
    const totalTasksAddingMock = totalTasks + 1
    expect(tasks.length).toBe(totalTasksAddingMock)
  })
  test('Task\'s title should have five words', async () => {
    expect(tasks[random(totalTasks)].data.title.split(' ').length).toBe(5)
  })
  test('Task\'s isPublic should be boolean', async () => {
    expect(typeof tasks[random(totalTasks)].data.isPublic).toBe('boolean')
    expect(tasks[random(totalTasks)].data.isPublic).toEqual(expect.any(Boolean))
  })
})

describe('Seed Users on DB', () => {
  test('It should be 6 users on DB', async () => {
    const totalUsers = await client.user.count()
    expect(totalUsers).toBe(6)
  })
  test('It should be 1 user with email medinamarquezp@test.es', async () => {
    const countUsersByEmail = await client.user.count({
      where: {
        email: 'medinamarquezp@test.es'
      }
    })
    expect(countUsersByEmail).toBe(1)
  })
  test('User with email medinamarquezp@test.es should have medinamarquezp as username', async () => {
    const medinamarquezp = await client.user.findOne({
      select: {
        username: true
      },
      where: {
        email: 'medinamarquezp@test.es'
      }
    })
    expect(medinamarquezp.username).toBe('medinamarquezp')
  })
})

describe('Seed Lists on DB', () => {
  test('It Should be 4 lists on DB', async () => {
    const totalLists = await client.list.count()
    expect(totalLists).toBe(4)
  })
  test('It should be 1 list with name Test Lista', async () => {
    const testListaCount = await client.list.count({
      where: {
        name: 'Test lista'
      }
    })
    expect(testListaCount).toBe(1)
  })
  test('Test lista should be public', async() => {
    const testListaPublic = await client.list.findMany({
      select: {
        isPublic: true
      },
      where: {
        name: 'Test list'
      }
    })
    expect(testListaPublic).toBeTruthy()
  })
})

describe('Seed Tasks on DB', () => {
  test('It should be 14 tasks on DB', async () => {
    const totalTasksOnDB = await client.task.count()
    expect(totalTasksOnDB).toBe(13)
  })
  test('It should be 1 task with title Crear tarea para la demo', async () => {
    const existTestTask = await client.task.count({
      where: {
        title: 'Crear tarea para la demo'
      }
    })
    expect(existTestTask).toBe(1)
  })
  test('Last task on DB sould be public', async () => {
    const lastTask = await client.raw('SELECT isPublic FROM Task ORDER BY id DESC LIMIT 1')
    expect(lastTask).toBeTruthy()
  })
})