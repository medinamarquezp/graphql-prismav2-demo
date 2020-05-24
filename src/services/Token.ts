import jwt from 'jsonwebtoken'

class Token {
  private static expiresIn = '1h'
  private static secret = process.env.TOKEN_SECRET

  static async sign(data: any): Promise<string> {
    let token: string
    try {
      token = await jwt.sign(data, Token.secret, { expiresIn: Token.expiresIn })
    } catch (err) {
      console.error('Error on signing data: ', err)
      return err.message
    }
    return token
  }

  static async verify(token: string): Promise<any> {
    let decodedData: any
    try {
      decodedData = await jwt.verify(token, Token.secret)
    } catch (err) {
      console.error('Error on verifying token: ', err)
      return err.message
    }
    return decodedData
  }
}

export { Token as default }