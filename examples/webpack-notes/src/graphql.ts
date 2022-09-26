import { ApolloClient, ApolloLink, InMemoryCache, Observable } from '@apollo/client'
import { relayStylePagination } from '@apollo/client/utilities'
import { ComposeClient } from '@composedb/client'

import { definition } from './__generated__/definition'

export const compose = new ComposeClient({ ceramic: 'http://localhost:7007', definition })

const cache = new InMemoryCache({
  typePolicies: {
    CeramicAccount: {
      fields: {
        noteList: relayStylePagination(),
      },
    },
  },
})

const link = new ApolloLink((operation) => {
  return new Observable((observer) => {
    compose.execute(operation.query, operation.variables).then(
      (result) => {
        observer.next(result)
        observer.complete()
      },
      (error) => {
        observer.error(error)
      }
    )
  })
})

export const client = new ApolloClient({ cache, link })
