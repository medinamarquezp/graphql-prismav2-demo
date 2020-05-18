import { Ifactory } from './IFactory';
import { name, internet, random } from 'faker'

export class UserFactory implements Ifactory {
  define() {
    return {
      username: internet.userName(),
      name: `${name.firstName()} ${name.lastName()}` ,
      email: internet.email(),
      password: random.alphaNumeric(8),
      token: random.alphaNumeric(24)
    }
  }
}