import User from '@models/User'
import List from '@models/List'
import Task from '@models/Task'
import client from '@store/PrismaClientSingleton';

class Mocks {
  static user() {
    const mockUser = new User({
      username: 'medinamarquezp',
      name: 'Pedro Medina',
      email: 'medinamarquezp@test.es',
      password: 'Test12345678',
      token: 'OkjOYrmKIvq3gik6QUsgGTFf'
    })
    return mockUser.getData()
  }

  static async list() {
    const mockList = new List({
      name: 'Test lista',
      isPublic: true,
    })
    const userRelated: number = await client.raw('SELECT id FROM User ORDER BY id DESC LIMIT 1')
    return mockList.getData(userRelated[0].id)
  }

  static async task() {
    const mockTask = new Task({
      title: 'Crear tarea para la demo', 
      content: 'Aliqua qui est exercitation ut velit labore sit laboris.',
      isPublic: true
    })
    const listRelated: number = await client.raw('SELECT id FROM List ORDER BY id DESC LIMIT 1')
    return mockTask.getData(listRelated[0].id)
  }
}

export { Mocks as default }