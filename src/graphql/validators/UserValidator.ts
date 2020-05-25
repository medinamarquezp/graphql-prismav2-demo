import validate from '@validators/validate'

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
