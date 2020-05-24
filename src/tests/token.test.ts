import Token from '@services/Token'

describe('Token service test', () => {
  test('Token should have a valid format', async () => {
    const tokenFormat = /^[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$/
    const data = { id: 1 }
    const tokenSigned = await Token.sign(data)
    expect(tokenSigned).toMatch(tokenFormat)
  })
  test('Token decoded should match with data test', async () => {
    const data = { id: 1 }
    const tokenSigned = await Token.sign(data)
    const verifiedToken = await Token.verify(tokenSigned)
    expect(verifiedToken.id).toBe(1)
  })
  test('Token malformed should display an error', async () => {
    const malformedToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTkwMzI5OTk2LCJleHAiOjE1OTAzMzM1OTZ9'
    const verifiedToken = await Token.verify(malformedToken)
    expect(verifiedToken).toBe('jwt malformed')
  })
})
