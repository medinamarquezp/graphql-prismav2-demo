import Task from '@models/Task'
import { lorem, random } from 'faker'
import { Ifactory } from '@factories/IFactory'
import client from '@store/PrismaClientSingleton'

export class TaskFactory implements Ifactory {

  async define() {
    const ids = await this.getListsIds()
    const task = new Task({
      title: lorem.words(5), 
      content: lorem.paragraph(),
      isPublic: random.boolean()
    })
    return task.getData(random.arrayElement(ids))
  }

  private async getListsIds(): Promise<number[]> {
    try {
      const lidObject = await client.list.findMany({
        select: {
          id: true
        }
      })
      if(!lidObject){
        return []
      }
      return lidObject.map(uid => uid.id)
    } catch (err) {
      console.error(err)
      return []
    }
  }
}