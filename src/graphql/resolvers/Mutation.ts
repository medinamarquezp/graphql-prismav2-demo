import Token from '@services/Token'
import Password from '@services/Password'

import {
  validateCreateUserData,
  validateUpdateUserData,
  validateUserExists,
  validateUserRegistered
} from '@validators/UserValidator'
import validateListActions from '@validators/ListValidator'
import validateTaskActions from '@validators/TaskValidator'

import { createUserRepo, deleteUserRepo, updateUserRepo } from '@repositories/UserRepository'
import { createListRepo, updateListRepo, deleteListRepo } from '@repositories/ListRepository'
import { createTaskRepo, updateTaskRepo, deleteTaskRepo } from '@repositories/TaskRepository'

export const Mutation = {
  async createUser(_, { data }, { client }) {
    await validateUserRegistered(client, data)
    validateCreateUserData(data)

    const password = await Password.hash(data.password)
    const newUserData = {
      ...data,
      password
    }
    return await createUserRepo(client, newUserData)
  },
  async deleteUser(_, { id }, { client }) {
    await validateUserExists(client, { id: Number(id) })
    return await deleteUserRepo(client, Number(id))
  },

  async updateUser(_, { data }, { client }) {
    await validateUserExists(client, { id: Number(data.id) })

    validateUpdateUserData(data)

    let updatedUserData: any
    if (data.password) {
      const password = await Password.hash(data.password)
      updatedUserData = {
        ...data,
        password
      }
    } else {
      updatedUserData = { ...data }
    }

    return await updateUserRepo(client, updatedUserData)
  },

  async createList(_, { data }, { client, request }) {
    const userId = await Token.getIdFromRequestToken(request, true)
    return await createListRepo(client, userId, data)
  },

  async updateList(_, { data }, { client, request }) {
    await validateListActions(client, request, data.id)
    return await updateListRepo(client, data)
  },
  async deleteList(_, { id }, { client, request }) {
    await validateListActions(client, request, id)
    return await deleteListRepo(client, Number(id))
  },
  async createTask(_, { data }, { client, request }) {
    await validateTaskActions(client, request, 0, data.listId)
    return await createTaskRepo(client, data)
  },

  async updateTask(_, { data }, { client, request }) {
    await validateTaskActions(client, request, data.id)
    return updateTaskRepo(client, data)
  },

  async deleteTask(_, { id }, { client, request }) {
    await validateTaskActions(client, request, id)
    return deleteTaskRepo(client, Number(id))
  }
}
