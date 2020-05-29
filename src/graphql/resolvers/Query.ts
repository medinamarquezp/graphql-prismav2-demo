import Token from '@services/Token'
import Password from '@services/Password'
import { getUserRepo, getUsersRepo, existUserRepo } from '@repositories/UserRepository'
import {
  getPublicListsRepo,
  getListsOfLoggedUserRepo,
  getListbyIdRepo
} from '@repositories/ListRepository'

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
    const existUser = await existUserRepo(client, { email })
    if (!existUser) throw new Error('There are not any user with this email')

    const userData = await getUserRepo(client, { email })
    const isValidPassword = await Password.compare(password, userData.password)
    if (!isValidPassword) throw new Error('Password is not correct')

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
    let userId: any
    const { authorization } = request.request.headers || false
    if (authorization) userId = await Token.getIdFromRequestToken(request)
    if (userId) return await getListsOfLoggedUserRepo(client, userId)
    return await getPublicListsRepo(client)
  },
  async getList(_, { id }, { client, request }) {
    let userId: any
    const { authorization } = request.request.headers || false
    if (authorization) userId = await Token.getIdFromRequestToken(request)

    const list = await getListbyIdRepo(client, Number(id))
    if (!list) throw new Error(`No lists were found by id ${id}`)
    if (!list.isPublic && list.ownerId !== userId) throw new Error(`Unauthorized to do this action`)
    return list
  }
}
