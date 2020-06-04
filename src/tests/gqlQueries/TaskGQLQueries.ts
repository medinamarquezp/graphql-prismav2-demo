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
