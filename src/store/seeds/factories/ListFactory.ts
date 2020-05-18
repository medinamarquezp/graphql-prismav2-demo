import { lorem, random } from 'faker'
import { Ifactory } from './IFactory';
import client from '../../PrismaClientSingleton'

export class ListFactory implements Ifactory {
  async define() {
    const ids = await this.getUsersIds()
    return {
      name: lorem.words(4), 
      isPublic: random.boolean(),
      ownerId: random.arrayElement(ids),
    }
  }
  private async getUsersIds(): Promise<number[]> {
    try {
      const uidObject = await client.user.findMany({
        select: {
          id: true
        }
      }) 
      if (uidObject) {
        return uidObject.map(uid => uid.id)  
      }
      return []
    } catch (err) {
      console.error(err)
      return []
    }
  }
}