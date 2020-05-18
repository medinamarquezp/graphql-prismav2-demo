import { Ifactory } from './factories/IFactory';
export class Seeder {
  private factory: Ifactory
  private numSeeds: number

  constructor (factory: Ifactory, numSeeds: number) {
    this.factory = factory
    this.numSeeds = numSeeds
  }

  async getSeeds(): Promise<any[]> {
    const seeds: any[] = []
    for  (let i = 0; i < this.numSeeds; i++) {
      seeds.push(this.factory.define())
    }
    return await Promise.all(seeds) 
  }

}