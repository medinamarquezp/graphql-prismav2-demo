import User from '@models/User'
import List from '@models/List'
import Task from '@models/Task'
import Password from '@services/Password'
import client from '@store/PrismaClientSingleton'

class Mocks {
  static async user() {
    const mockUser = new User({
      username: 'medinamarquezp',
      name: 'Pedro Medina',
      email: 'medinamarquezp@test.es',
      password: await Password.hash('Test12345678')
    })
    return mockUser.getData()
  }

  static async list() {
    const mockList = new List({
      name: 'Test lista',
      isPublic: false
    })
    const userRelated: number = await client.queryRaw(
      'SELECT id FROM User ORDER BY id DESC LIMIT 1'
    )
    return mockList.getData(userRelated[0].id)
  }

  static async task() {
    const mockTask = new Task({
      title: 'Crear tarea para la demo',
      content: 'Aliqua qui est exercitation ut velit labore sit laboris.',
      isPublic: true
    })
    const listRelated: number = await client.queryRaw(
      'SELECT id FROM List ORDER BY id DESC LIMIT 1'
    )
    return mockTask.getData(listRelated[0].id)
  }
}

export { Mocks as default }
