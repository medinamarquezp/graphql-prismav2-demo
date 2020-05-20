class List {

  private name: string
  private isPublic: boolean
  
  constructor({ name, isPublic }: ListInterface) {
    this.name = name
    this.isPublic = isPublic
  }

  getData(userRelated: number): any {
    return {
      data: {
        ...this,
        owner: {
          connect: { id: userRelated }
        }
      }
    }
  }
}
interface ListInterface {
  name: string;
  isPublic: boolean;
}

export { List as default }