class User {
  
  private username: string
  private name: string
  private email: string
  private password: string
  private token: string
  
  constructor(user: UserInterface) {
    const { username, name, email, password, token } = user
    this.username = username
    this.name = name
    this.email = email
    this.password = password
    this.token = token
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
  username: string;
  name: string;
  email: string;
  password: string;
  token: string;
}

export { User as default }