import Password from '@services/Password'
import { validateCreateUserData, validateUpdateUserData } from '@validators/UserValidator'
import {
  existUserRepo,
  createUserRepo,
  deleteUserRepo,
  updateUserRepo
} from '@repositories/UserRepository'

export const Mutation = {
  async createUser(_, { data }, { client }) {
    const existUsername = await existUserRepo(client, { username: data.username })
    const existEmail = await existUserRepo(client, { email: data.email })
    if (existUsername || existEmail) throw new Error('User is already registered')

    validateCreateUserData(data)

    const password = await Password.hash(data.password)
    const newUserData = {
      ...data,
      password
    }
    return await createUserRepo(client, newUserData)
  },
  async deleteUser(_, { id }, { client }) {
    const existUser = await existUserRepo(client, { id: Number(id) })
    if (!existUser) throw new Error('There are not any user with this ID')
    return await deleteUserRepo(client, Number(id))
  },

  async updateUser(_, { data }, { client }) {
    const existUser = await existUserRepo(client, { id: Number(data.id) })
    if (!existUser) throw new Error('There are not any user with this ID')

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
  }
}
