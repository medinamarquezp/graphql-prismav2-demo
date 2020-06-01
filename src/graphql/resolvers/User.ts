import Token from '@services/Token'
import { getListsWhereRepo } from '@repositories/ListRepository'
export const User = {
  async lists({ id }, __, { client, request }) {
    const userId = await Token.getIdFromRequestToken(request)
    if (userId && id === userId) {
      return await getListsWhereRepo(client, { ownerId: Number(id) })
    }
    return await getListsWhereRepo(client, { ownerId: Number(id), isPublic: true })
  }
}
