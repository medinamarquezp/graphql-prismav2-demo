export const createListRepo = async (client, id, data) => {
  try {
    return await client.list.create({
      data: {
        name: data.name,
        isPublic: data.isPublic,
        owner: {
          connect: { id }
        }
      }
    })
  } catch (err) {
    throw new Error(`Error on creating a new list: ${err}`)
  }
}
export const getPublicListsRepo = async client => {
  try {
    return await client.list.findMany({
      where: {
        isPublic: true
      }
    })
  } catch (err) {
    throw new Error(`Error on fetching public lists: ${err}`)
  }
}
export const getListsOfLoggedUserRepo = async (client, ownerId) => {
  try {
    return await client.raw(
      `SELECT * FROM List WHERE isPublic = 1 or (isPublic = 0 AND ownerId = ${ownerId})`
    )
  } catch (err) {
    throw new Error(`Error on fetching lists of logged user: ${err}`)
  }
}
export const getListbyIdRepo = async (client, id) => {
  try {
    return await client.list.findOne({
      where: {
        id
      }
    })
  } catch (err) {
    throw new Error(`Error on fetching a list by ID: ${err}`)
  }
}

export const existListRepo = async (client, id) => {
  try {
    return await client.list.count({
      where: {
        id
      }
    })
  } catch (err) {
    throw new Error(`Error on cheking if list exists: ${err}`)
  }
}

export const updateListRepo = async (client, data) => {
  const id = Number(data.id)
  delete data.id
  try {
    return await client.list.update({
      where: {
        id
      },
      data
    })
  } catch (err) {
    throw new Error(`Error on updating a list: ${err}`)
  }
}

export const deleteListRepo = async (client, id) => {
  try {
    return await client.list.delete({
      where: {
        id
      }
    })
  } catch (err) {
    throw new Error(`Error on deleting a list: ${err}`)
  }
}
