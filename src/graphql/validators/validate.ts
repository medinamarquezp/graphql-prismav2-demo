import Validator from 'Validator'
const validate = (data, rules) => {
  const result = Validator.make(data, rules)
  if (result.fails()) {
    const errors = result.getErrors()
    throw new Error(JSON.stringify(errors))
  }
}
const validateOwnership = (ownerId, userId) => {
  if (ownerId !== userId) throw new Error('Unauthorized to do this action')
}

export { validate as default, validateOwnership }
