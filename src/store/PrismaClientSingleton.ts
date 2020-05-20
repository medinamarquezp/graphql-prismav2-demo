import { PrismaClient } from '@prisma/client'

class PrismaClientSingleton extends PrismaClient {

  private static instance: PrismaClient

  private constructor() {
    super()
  }
  static getInstance(): PrismaClient {
    if(! PrismaClientSingleton.instance ) {
      PrismaClientSingleton.instance = new PrismaClient()
    }
    return PrismaClientSingleton.instance
  }

}

const client: PrismaClient = PrismaClientSingleton.getInstance()

export { client as default, PrismaClient }