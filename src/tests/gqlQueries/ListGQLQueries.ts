import { gql } from 'apollo-boost'

export const createList = gql`
  mutation {
    createList(data: { name: "Nueva Lista E2E Test", isPublic: false }) {
      id
      name
      isPublic
    }
  }
`

export const getLists = gql`
  query {
    getLists {
      id
      name
      isPublic
    }
  }
`

export const getListById = id => gql`
    query {
      getList(id: ${id}){
        id
        name
        isPublic
      }
    }
  `

export const updateList = id => gql`
  mutation{
    updateList(
        data: {
          id: ${id},
          name: "Nueva Lista E2E Test ACTUALIZADA!"
        }
      ){
        id
        name
        isPublic
      }
    }
  `

export const deleteList = id => gql`
    mutation{
      deleteList(id: ${id}){
        id
        name
        isPublic
      }
    }
  `

export const getListsWithNestedTasks = gql`
  query {
    getLists {
      id
      name
      isPublic
      tasks {
        id
        title
        isPublic
      }
    }
  }
`
