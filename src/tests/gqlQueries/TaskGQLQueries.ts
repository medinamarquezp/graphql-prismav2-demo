import { gql } from 'apollo-boost'

export const createTask = listId => gql`
  mutation{
    createTask(
      data: {
        title: "Creación de tarea test E2E NEW!!!",
        content: "Este el contenido de la nueva tarea creada desde un test E2E",
        isPublic: false,
        listId: ${listId}
      }
    ){
      id,
      title
      content,
      isPublic
    }
  }
`
export const getTasks = gql`
  query {
    getTasks {
      id
      title
      content
      isPublic
    }
  }
`
export const getTaskById = id => gql`
  query {
    getTask(id: ${id}) {
      id
      title
      content
      isPublic
    }
  }
`
export const updateTask = id => gql`
  mutation{
    updateTask(
      data: {
        id: ${id}
        title: "ACTUALIZACIÓN de tarea test E2E!!!"
        isPublic: true
      }
    ){
      title
      isPublic
    }
  }
`
export const deleteTask = id => gql`
  mutation{
    deleteTask(id: ${id}){
      id
      title
      content
    }
  }
`
export const getTaskByIdWithNestedList = id => gql`
  query{
    getTask(id: ${id}){
      id
      title
      content
      isPublic
      list{
        id
        name
      }
    }
  }
`
