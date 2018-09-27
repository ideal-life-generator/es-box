import Vue from 'vue'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'

Vue.use(VueApollo)

const httpLink = new HttpLink({
  uri: 'http://localhost:3001/graphql',
  credentials: 'include'
})

export const graphqlClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  connectToDevTools: true
})

export default new VueApollo({ defaultClient: graphqlClient })
