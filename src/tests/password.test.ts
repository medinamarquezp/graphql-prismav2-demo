import Password from '@services/Password'

describe('Password service test', () => {
  test('Password hash should have 60 characters', async () => {
    const passwordHashed = await Password.hash('Hola12345')
    expect(passwordHashed.length).toBe(60)
  })
  test('Comparison of hash and password must be truthy', async () => {
    const plainPassword = 'Hola12345'
    const hash = '$2b$10$.81KbWL25RECKc19IlDsLui7v7QQGCU/eOKF4TsBmp0DSxxkwDM.W'
    const comparison = await Password.compare(plainPassword, hash)
    expect(comparison).toBeTruthy()
  })
  test('Comparison of hash and error password must be falsy', async () => {
    const plainPassword = 'Hola'
    const hash = '$2b$10$.81KbWL25RECKc19IlDsLui7v7QQGCU/eOKF4TsBmp0DSxxkwDM.W'
    const comparison = await Password.compare(plainPassword, hash)
    expect(comparison).toBeFalsy()
  })
})
