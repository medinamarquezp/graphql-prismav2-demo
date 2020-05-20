import client from '@store/PrismaClientSingleton'

const cleanDB = async () => {
  try {
    await client.task.deleteMany({})
    await client.list.deleteMany({})
    await client.user.deleteMany({})
  } catch (err) {
    console.error('Error on cleaning DB: ', err)
    process.exit(1)
  }
}

export { cleanDB as default }