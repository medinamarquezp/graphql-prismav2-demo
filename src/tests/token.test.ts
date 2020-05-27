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
    await expect(Token.verify(malformedToken)).rejects.toThrowError()
  })
  test('It should display an error if token is not available on request', () => {
    const request = {
      request: {
        headers: {}
      }
    }
    expect(() => Token.getTokenFromRequest(request)).toThrow(
      'Authorization is required on this transaction'
    )
  })
  test('It should display an error if token is not correct', () => {
    const request = {
      request: {
        headers: {
          authorization: 'test'
        }
      }
    }
    expect(() => Token.getTokenFromRequest(request)).toThrow(
      'Token is not defined or is not correct'
    )
  })
  test('It should works if token is correct', () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsImlhdCI6MTU5MDUyNjQwNSwiZXhwIjoxNTkwNTMwMDA1fQ.3-Jq9z0flIXPKGeEqY4-169OTykNM7nuXwoA1mNj8ZE'
    const request = {
      request: {
        headers: {
          authorization: `Bearer ${token}`
        }
      }
    }
    expect(Token.getTokenFromRequest(request)).toBe(token)
  })
})
