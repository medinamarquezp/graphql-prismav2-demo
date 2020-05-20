import Mocks from '@seeds/Mocks'
import client, { PrismaClient } from '@store/PrismaClientSingleton';
import { GenerateSeeds } from '@seeds/GenerateSeeds';
import { UserFactory } from '@factories/UserFactory';
import { ListFactory } from '@factories/ListFactory';
import { TaskFactory } from '@factories/TaskFactory';

class Seeder {

  private static numUsers= 5
  private static numLists= 5
  private static numTasks= 15
  private static client: PrismaClient = client

  static async seedUsers(numUsers= Seeder.numUsers, mockUser= true, save= false) {
    const seeds = new GenerateSeeds(new UserFactory(), numUsers)
    const users = await seeds.getSeeds()
    if (mockUser) users.push(Mocks.user())
    if (save) {
      for await (const user of users) {
        await Seeder.client.user.create(user)
      }
    }
    return users
  }

  static async seedLists (numLists= Seeder.numLists, mockList= true, save= false) {
    const seeds = new GenerateSeeds(new ListFactory(), numLists)
    const lists = await seeds.getSeeds()
    if (mockList) lists.push(Mocks.list())
    if (save) {
      for await (const list of lists) {
        await Seeder.client.list.create(list)
      }
    }
    return lists
  }
  static async seedTasks (numTasks= Seeder.numTasks, mockTask= true, save= false) {
    const seeds = new GenerateSeeds(new TaskFactory(), numTasks)
    const tasks = await seeds.getSeeds()
    if (mockTask) tasks.push(Mocks.task())
    if (save) {
      for await (const task of tasks) {
        await Seeder.client.task.create(task)
      }
    }
    return tasks
  }
  static async seedApp () {
    try {
      console.log('1 of 3: Seeding users')
      await Seeder.seedUsers(Seeder.numUsers, true, true)
      console.log('2 of 3: Seeding lists')
      await Seeder.seedLists(Seeder.numLists, true, true)
      console.log('3 of 3: Seeding Tasks')
      await Seeder.seedTasks(Seeder.numTasks, true, true)
      console.log('All seeds have been generated correctly')
    } catch (error) {
      console.error('There have been an error on seeding the App: ', error)
      process.exit(1)
    }
  }

}

export { Seeder as default }