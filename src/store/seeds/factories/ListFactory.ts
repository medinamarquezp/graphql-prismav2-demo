import { lorem, random } from 'faker'
import List from '@models/List'
import { Ifactory } from './IFactory';
import client from '@store/PrismaClientSingleton'

export class ListFactory implements Ifactory {
  async define() {
    const ids = await this.getUsersIds()
    const list = new List({
      name: lorem.words(2), 
      isPublic: random.boolean()
    })
    return list.getData(random.arrayElement(ids))
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