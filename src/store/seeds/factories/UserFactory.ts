import { name, internet, random } from 'faker'
import User from '@models/User'
import { Ifactory } from './IFactory'
export class UserFactory implements Ifactory {
  define() {
    const user = new User({
      username: internet.userName(),
      name: `${name.firstName()} ${name.lastName()}`,
      email: internet.email(),
      password: random.alphaNumeric(8)
    })
    return user.getData()
  }
}
