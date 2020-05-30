class User {
  private username: string
  private name: string
  private email: string
  private password: string

  constructor({ username, name, email, password }: UserInterface) {
    this.username = username
    this.name = name
    this.email = email
    this.password = password
  }

  getData(): any {
    return {
      data: {
        ...this
      }
    }
  }
}

interface UserInterface {
  username: string
  name: string
  email: string
  password: string
}

export { User as default }
