import Token from '@services/Token'
import { validateOwnership } from './validate'
import { existListRepo, getListbyIdRepo } from '@repositories/ListRepository'
import { existTaskRepo, checkTaskOwnerRepo } from '@repositories/TaskRepository'

const validateTaskExists = async (client, taskId) => {
  const existTask = await existTaskRepo(client, Number(taskId))
  if (!existTask) throw new Error('This Task does not exists')
}

const validatTaskOwnership = async (client, taskId, userId) => {
  const isTaskOwner = await checkTaskOwnerRepo(client, taskId, userId)
  if (isTaskOwner.length === 0) throw new Error(`Unauthorized to do this action`)
}

const validateTaskActions = async (client, request, taskId = 0, listId = 0) => {
  const userId = await Token.getIdFromRequestToken(request, true)

  if (!taskId) {
    const existList = await existListRepo(client, Number(listId))
    if (!existList) throw new Error('Related list does not exists')

    const relatedList = await getListbyIdRepo(client, Number(listId))
    validateOwnership(relatedList.ownerId, userId)
  } else {
    await validateTaskExists(client, Number(taskId))
    await validatTaskOwnership(client, taskId, userId)
  }
}

export { validateTaskActions as default, validateTaskExists }
