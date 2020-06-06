export const getTaskWhereRepo = async (client, where) => {
  try {
    return await client.task.findMany({
      where
    })
  } catch (err) {
    throw new Error(`Error on fetching tasks: ${err}`)
  }
}
const taskListQuery = where => `
  SELECT t.* 
  FROM Task as t 
  INNER JOIN List as l on l.id = t.listId   
  ${where}
`

export const getTasksOfLoggedUserRepo = async (client, ownerId) => {
  try {
    const query = taskListQuery(
      `WHERE t.isPublic = 1 OR (t.isPublic = 0 and l.ownerId = ${ownerId})`
    )
    return await client.queryRaw(query)
  } catch (err) {
    throw new Error(`Error on fetching lists of logged user: ${err}`)
  }
}

export const getTasksListOfLoggedUserRepo = async (client, listId, ownerId) => {
  try {
    const query = taskListQuery(
      `WHERE t.listId = ${listId} 
       AND t.isPublic = 1 
       OR (t.isPublic = 0 
       AND t.listId = ${listId}
       AND l.ownerId = ${ownerId})`
    )
    return await client.queryRaw(query)
  } catch (err) {
    throw new Error(`Error on fetching lists of logged user: ${err}`)
  }
}

export const getTaskbyIdRepo = async (client, id) => {
  try {
    return await client.task.findOne({
      where: {
        id
      }
    })
  } catch (err) {
    throw new Error(`Error on fetching task by id ${err}`)
  }
}

export const existTaskRepo = async (client, id) => {
  try {
    return await client.task.count({
      where: {
        id
      }
    })
  } catch (err) {
    throw new Error(`Error on checking if task exists: ${err}`)
  }
}

export const checkTaskOwnerRepo = async (client, id, ownerId) => {
  try {
    const query = taskListQuery(`WHERE t.id = ${id} and l.ownerId = ${ownerId}`)
    return await client.queryRaw(query)
  } catch (err) {
    throw new Error(`Error on checking task owner: ${err}`)
  }
}

export const createTaskRepo = async (client, data) => {
  try {
    const { title, content, isPublic, listId } = data
    return await client.task.create({
      data: {
        title,
        content,
        isPublic,
        list: {
          connect: { id: Number(listId) }
        }
      }
    })
  } catch (err) {
    throw new Error(`Error on creating a list: ${err}`)
  }
}

export const updateTaskRepo = async (client, data) => {
  try {
    const taskId = Number(data.id)
    delete data.id
    return await client.task.update({
      where: {
        id: taskId
      },
      data
    })
  } catch (err) {
    throw new Error(`Error on updating a task: ${err}`)
  }
}

export const deleteTaskRepo = async (client, id) => {
  try {
    return await client.task.delete({
      where: {
        id
      }
    })
  } catch (err) {
    throw new Error(`Error on deleting a task: ${err}`)
  }
}
