import Token from '@services/Token'
import { validateOwnership } from './validate'
import { existListRepo, getListbyIdRepo } from '@repositories/ListRepository'

const validateListExists = async (client, id) => {
  const existList = await existListRepo(client, Number(id))
  if (!existList) throw new Error('This List does not exists')
}

const validateListActions = async (client, request, id) => {
  const userId = await Token.getIdFromRequestToken(request, true)

  await validateListExists(client, id)

  const listToUpdate = await getListbyIdRepo(client, Number(id))
  validateOwnership(listToUpdate.ownerId, userId)
}

export { validateListActions as default, validateListExists }
