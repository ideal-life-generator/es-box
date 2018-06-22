<template lang="pug">
text.white Login is processed...
</template>

<script>
import gql from 'graphql-tag'
import { SHOW_ERROR } from 'store/error'

export default {
  async mounted() {
    try {
      await this.$apollo.mutate({
        mutation: gql`
          mutation($code: String!) {
            auth(code: $code) {
              token
              refreshToken
            }
          }
        `,
        variables: {
          code: this.$route.query.code
        },
        update: (store, { data: { auth: { token, refreshToken } } }) => {
          localStorage.setItem('token', token)
          localStorage.setItem('refreshToken', refreshToken)
        },
      })
    } catch (error) { // FIXME: Should parse
      this.$store.dispatch(SHOW_ERROR,
        (error && error.graphQLErrors && error.graphQLErrors[0] && error.graphQLErrors[0].message) ?
          error.graphQLErrors[0].message : 'Google authentication is failed'
      )
    }

    this.$router.push('/')
  }
}
</script>

<style lang="sass">
text.white
  fill: white

</style>
