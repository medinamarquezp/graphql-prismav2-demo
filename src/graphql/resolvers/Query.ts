import Token from '@services/Token'
import Password from '@services/Password'
import { getUserRepo, getUsersRepo, existUserRepo } from '@repositories/UserRepository'

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
    const token = Token.getTokenFromRequest(request)
    const decodedToken = await Token.verify(token)
    const id = decodedToken.id
    return await getUserRepo(client, { id })
  }
}
