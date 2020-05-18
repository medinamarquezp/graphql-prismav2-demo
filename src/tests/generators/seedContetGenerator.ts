import { TaskFactory } from './../../store/seeds/factories/TaskFactory';
import { ListFactory } from './../../store/seeds/factories/ListFactory';
import { UserFactory } from './../../store/seeds/factories/UserFactory';
import { Seeder } from './../../store/seeds/Seeder';

export const random = (max: number) => Math.floor(Math.random() * max)

export const usersSeed = async (numUsers: number) => {
  const userFactory = new UserFactory()
  const seeder = new Seeder(userFactory, numUsers)
  return await seeder.getSeeds()
}

export const listsSeed = async (numLists: number) => {
  const listFactory = new ListFactory()
  const seeder = new Seeder(listFactory, numLists)
  return await seeder.getSeeds()
}

export const tasksSeed = async (numTasks: number) => {
  const taskFactory = new TaskFactory()
  const seeder = new Seeder(taskFactory, numTasks)
  return await seeder.getSeeds()
}