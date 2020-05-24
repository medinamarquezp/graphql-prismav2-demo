import Validator from 'Validator'

const createUserRules = {
  username: 'required',
  name: 'required',
  email: 'required|email',
  password: 'required|min:8|alpha_num'
}

export const validateCreateUserData = data => {
  const result = Validator.make(data, createUserRules)
  if (result.fails()) {
    const errors = result.getErrors()
    throw new Error(JSON.stringify(errors))
  }
}
