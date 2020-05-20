import { User } from '@prisma/client'
import client from '@store/PrismaClientSingleton'

export const Query = {
  ping(): string {
    return 'pong'
  },

  async getUsers(): Promise<User[]> {
    return await client.user.findMany()
  }

} 