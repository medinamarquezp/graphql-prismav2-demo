import Validator from 'Validator'
const validate = (data, rules) => {
  const result = Validator.make(data, rules)
  if (result.fails()) {
    const errors = result.getErrors()
    throw new Error(JSON.stringify(errors))
  }
}

export { validate as default }
