import { gql } from 'apollo-boost'
export const createUser = gql`
  mutation {
    createUser(
      data: {
        username: "pedro.medina.test"
        name: "Pedro Medina Test"
        email: "pedro.medina@e2etest.es"
        password: "TestTest"
      }
    ) {
      id
      username
      email
    }
  }
`
export const getUser = gql`
  query {
    getUser(username: "pedro.medina.test") {
      id
      email
    }
  }
`
export const updateUserByID = id => gql`
  mutation{
    updateUser(
      data: {
        id: ${id}
        name:"Pedro Medina Editado"
      }
    ){
      name
    }
  }
`
export const deleteUserByID = id => gql`
  mutation{
    deleteUser(id: ${id}){
      username
    }
  }
`
export const login = gql`
  query {
    login(email: "pedro.medina@e2etest.es", password: "TestTest") {
      token
    }
  }
`
export const me = gql`
  query {
    me {
      username
      email
    }
  }
`
