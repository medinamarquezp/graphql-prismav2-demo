import Token from '@services/Token'
import { validateOwnership } from '@validators/validate'
import { validateUserExists, validateUserPassword } from '@validators/UserValidator'
import { validateListExists } from '@validators/ListValidator'
import { validateTaskExists, validateTaskOwnership } from '@validators/TaskValidator'
import { getUserRepo, getUsersRepo } from '@repositories/UserRepository'
import {
  getListsWhereRepo,
  getListsOfLoggedUserRepo,
  getListbyIdRepo
} from '@repositories/ListRepository'
import {
  getTaskWhereRepo,
  getTasksOfLoggedUserRepo,
  getTaskbyIdRepo
} from '@repositories/TaskRepository'

export const Query = {
  ping(): string {
    return 'pong'
  },

  async getUsers(_, __, { client }) {
    return await getUsersRepo(client)
  },
  async getUser(_, { id, username, email }, { client }) {
    const where = {}
    if (id) Object.assign(where, { id: Number(id) })
    if (username) Object.assign(where, { username })
    if (email) Object.assign(where, { email })

    return await getUserRepo(client, where)
  },

  async login(_, { email, password }, { client }) {
    await validateUserExists(client, { email })

    const userData = await getUserRepo(client, { email })
    await validateUserPassword(password, userData.password)

    const token = await Token.sign({ id: userData.id })
    return {
      token
    }
  },

  async me(_, __, { client, request }) {
    const id = await Token.getIdFromRequestToken(request)
    return await getUserRepo(client, { id })
  },
  async getLists(_, __, { client, request }) {
    const userId = await Token.getIdFromRequestToken(request)
    if (userId) return await getListsOfLoggedUserRepo(client, userId)
    return await getListsWhereRepo(client, { isPublic: true })
  },
  async getList(_, { id }, { client, request }) {
    const userId = await Token.getIdFromRequestToken(request)
    await validateListExists(client, id)
    const list = await getListbyIdRepo(client, Number(id))
    if (!list.isPublic) validateOwnership(list.ownerId, userId)
    return list
  },

  async getTasks(_, __, { client, request }) {
    const userId = await Token.getIdFromRequestToken(request)
    if (userId) return await getTasksOfLoggedUserRepo(client, userId)
    return await getTaskWhereRepo(client, { isPublic: true })
  },
  async getTask(_, { id }, { client, request }) {
    const userId = await Token.getIdFromRequestToken(request)
    await validateTaskExists(client, id)
    const task = await getTaskbyIdRepo(client, Number(id))
    if (!task.isPublic) await validateTaskOwnership(client, id, userId)
    return task
  }
}
