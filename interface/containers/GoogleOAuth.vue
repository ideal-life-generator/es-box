<template lang="jade">
text.white Login is processed...
</template>

<script>
import gql from 'graphql-tag'
import { SHOW_ERROR } from 'store/error'

export default {
  async mounted() {
    try {
      await this.$apollo.mutate({
        mutation: gql`mutation ($code: String!) {
          auth(code: $code) {
            token
            refreshToken
          }
        }`,
        variables: {
          code: 'hi' // this.$route.query.code
        },
        update: (store, { data: { auth: { token, refreshToken } } }) => {
          localStorage.setItem('token', token)
          localStorage.setItem('refreshToken', refreshToken)
        },
      })
    } catch (error) { // FIXME: Should parse
      this.$store.dispatch(SHOW_ERROR, error.message)
    }

    this.$router.push('/')
  }
}
</script>

<style lang="sass">
text.white
  fill: white

</style>
