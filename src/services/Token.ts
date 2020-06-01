import jwt from 'jsonwebtoken'

class Token {
  private static expiresIn = '1h'
  private static secret = process.env.TOKEN_SECRET

  static async sign(data: any): Promise<string> {
    let token: string
    try {
      token = await jwt.sign(data, Token.secret, { expiresIn: Token.expiresIn })
    } catch (err) {
      throw new Error(err)
    }
    return token
  }

  static async verify(token: string): Promise<any> {
    let decodedData: any
    try {
      decodedData = await jwt.verify(token, Token.secret)
    } catch (err) {
      throw new Error(err)
    }
    return decodedData
  }

  static getTokenFromRequest(request): string {
    const { authorization } = request.request.headers || false
    if (!authorization) throw new Error('Authorization is required on this transaction')

    const token = authorization.split(' ')[1] || false
    if (!token) throw new Error('Token is not defined or is not correct')

    return token
  }

  static async getIdFromRequestToken(request, shouldBeAuthenticated = false) {
    const { authorization } = request.request.headers || false
    if (!authorization && !shouldBeAuthenticated) return false
    const token = Token.getTokenFromRequest(request)
    const decodedToken = await Token.verify(token)
    return decodedToken.id
  }
}

export { Token as default }
