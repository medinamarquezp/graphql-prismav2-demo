import { getListbyIdRepo } from '@repositories/ListRepository'

export const Task = {
  async list({ listId }, __, { client }) {
    return await getListbyIdRepo(client, Number(listId))
  }
}
