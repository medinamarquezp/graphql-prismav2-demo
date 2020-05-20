class Task {
  
  private title: string
  private content: string
  private isPublic: boolean
  
  constructor(task: TaskInterface) {
    const { title, content, isPublic } = task
    this.title = title
    this.content = content
    this.isPublic = isPublic
  }

  getData(listRelated: number): any {
    return {
      data: {
        ...this,
        list: {
          connect: { id: listRelated }
        }
      }
    }
  }

}

interface TaskInterface {
  title: string; 
  content: string;
  isPublic: boolean;
}

export { Task as default }