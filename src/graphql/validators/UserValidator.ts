import Password from '@services/Password'
import validate from '@validators/validate'
import { existUserRepo } from '@repositories/UserRepository'

const createUserRules = {
  username: 'required',
  name: 'required',
  email: 'required|email',
  password: 'required|min:8|alpha_num'
}
const updateUserRules = {
  id: 'required|numeric',
  email: 'nullable|email',
  password: 'nullable|min:8|alpha_num'
}

export const validateCreateUserData = data => {
  validate(data, createUserRules)
}

export const validateUpdateUserData = data => {
  validate(data, updateUserRules)
}
export const validateUserExists = async (client, where) => {
  const existUser = await existUserRepo(client, where)
  if (!existUser) throw new Error('User does not exist')
  return true
}
export const validateUserRegistered = async (client, data) => {
  const existEmail = await existUserRepo(client, { email: data.email })
  const existUsername = await existUserRepo(client, { username: data.username })
  if (existUsername || existEmail) throw new Error('User is already registered')
}
export const validateUserPassword = async (password, userPassword) => {
  const isValidPassword = await Password.compare(password, userPassword)
  if (!isValidPassword) throw new Error('Password is not correct')
}
