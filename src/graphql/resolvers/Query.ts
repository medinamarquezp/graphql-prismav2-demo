import { getUserRepo, getUsersRepo } from '@repositories/UserRepository'

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
  }
}
