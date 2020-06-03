import Token from '@services/Token'
import { getTaskWhereRepo, getTasksListOfLoggedUserRepo } from '@repositories/TaskRepository'
export const List = {
  async tasks({ id, ownerId }, __, { client, request }) {
    const userId = await Token.getIdFromRequestToken(request)
    if (userId && ownerId === userId) {
      return await getTasksListOfLoggedUserRepo(client, Number(id), Number(ownerId))
    }
    return await getTaskWhereRepo(client, { listId: Number(id), isPublic: true })
  }
}
