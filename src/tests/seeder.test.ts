import { random, usersSeed, listsSeed, tasksSeed } from './generators/seedContetGenerator';

const totalUsers = 5
const totalLists = 3
const totalTasks = 12

let users: any
let lists: any
let tasks: any

beforeAll(async () => {
  users = await usersSeed(totalUsers)
  lists = await listsSeed(totalLists)
  tasks = await tasksSeed(totalTasks)
})

describe('Users factory seed', () => {
  test('Users seed length should be 5', async () => {
    expect(users.length).toBe(totalUsers)
  })
  test('User\'s name should have two words', async () => {
    expect(users[random(totalUsers)].name.split(' ').length).toBe(2)
  })
  test('User\'s email should have an @', async () => {
    expect(users[random(totalUsers)].email.indexOf('@')).not.toBe(-1)
  })
  test('User\'s token should have 24 characters', async () => {
    expect(users[random(totalUsers)].token.length).toBe(24)
  })
})

describe('Lists factory seed', () => {
  test('Lists seed length should be 3', async () => {
    expect(lists.length).toBe(totalLists)
  })
  test('List\'s name should have four words', async () => {
    expect(lists[random(totalLists)].name.split(' ').length).toBe(4)
  })
  test('Lits\'s isPublic should be boolean', async () => {
    expect(typeof lists[random(totalLists)].isPublic).toBe('boolean')
    expect(lists[random(totalLists)].isPublic).toEqual(expect.any(Boolean))
  })
})

describe('Tasks factory seed', () => {
  test('Tasks seed length should be 12', async () => {
    expect(tasks.length).toBe(totalTasks)
  })
  test('Task\'s title should have five words', async () => {
    expect(tasks[random(totalTasks)].title.split(' ').length).toBe(5)
  })
  test('Task\'s isPublic should be boolean', async () => {
    expect(typeof tasks[random(totalTasks)].isPublic).toBe('boolean')
    expect(tasks[random(totalTasks)].isPublic).toEqual(expect.any(Boolean))
  })
})