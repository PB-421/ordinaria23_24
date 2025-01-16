

export const schema = `#graphql

    type Contact  {
        id: ID!,
        name: String!,
        phone: String!,
        country: String!,
        hour: String!
    }

    type Query {
        getContacts: [Contact!]!
        getContact(id: ID!): Contact 
    }

    type Mutation {
        addContact(name: String!,phone: String!): Contact #En el add, lanzamos un error cuando haya algo que no nos cuadre
        updateContact(id: ID!,name: String, phone: String): Contact # en el update, mejor lanzamos un error
        deleteContact(id: ID!): Boolean
    }

`