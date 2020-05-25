export const getUsersRepo = async client => {
  try {
    return await client.user.findMany()
  } catch (err) {
    throw new Error(`Error on fetching users: ${err}`)
  }
}
export const getUserRepo = async (client, where) => {
  try {
    return await client.user.findOne({
      where
    })
  } catch (err) {
    throw new Error(`Error on fetching a specific user: ${err}`)
  }
}

export const existUserRepo = async (client, condition) => {
  try {
    return await client.user.count({
      where: {
        ...condition
      }
    })
  } catch (err) {
    throw new Error(`Error on checking if user exists: ${err}`)
  }
}

export const createUserRepo = async (client, data) => {
  try {
    return await client.user.create({ data })
  } catch (err) {
    throw new Error(`Error on creating a new user: ${err}`)
  }
}

export const deleteUserRepo = async (client, id) => {
  try {
    return await client.user.delete({
      where: {
        id
      }
    })
  } catch (err) {
    throw new Error(`Error on deleting a user: ${err}`)
  }
}

export const updateUserRepo = async (client, data) => {
  const id = Number(data.id)
  delete data.id
  try {
    return await client.user.update({
      where: {
        id
      },
      data
    })
  } catch (err) {
    throw new Error(`Error on updating a user: ${err}`)
  }
}
