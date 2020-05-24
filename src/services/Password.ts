import bcrypt from 'bcrypt'

class Password {
  private static salt = 10

  static async hash(plainPassword: string): Promise<string> {
    let hashedPassword: string
    try {
      hashedPassword = await bcrypt.hash(plainPassword, Password.salt)
    } catch (err) {
      console.error('Error on hashing plain passowrd, ', err)
    }
    return hashedPassword
  }

  static async compare(plainPassword: string, hash: string): Promise<boolean> {
    let resultComparison: boolean
    try {
      resultComparison = await bcrypt.compare(plainPassword, hash)
    } catch (err) {
      console.error('Error on comparing plain password to hash', err)
    }
    return resultComparison
  }
}

export { Password as default }
