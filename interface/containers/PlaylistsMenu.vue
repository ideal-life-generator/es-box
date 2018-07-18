<template lang="pug">
div.playlists
  div.new-playlist
    input.input(type="text" v-bind:value="newPlaylist.name" v-on:input="rename")
    div(v-for="(item, i) in newPlaylist.items")
      div(v-bind:key="item.id" v-text="item.title")
    add(
      class="add"
      v-bind:size="16"
      @click.native="save"
    )
  div.playlist-links
    router-link.playlist-link(
      v-for="(playlist, i) in playlists.items"
      v-bind:key="playlist._key"
      v-bind:to="`/playlists/${playlist._key}`"
      v-text="playlist.name"
    )
</template>

<script>
import gql from 'graphql-tag'
import { mapGetters } from 'vuex'
import Add from 'components/icons/Add.vue'
import { SHOW_ERROR } from 'store/error'

const PLAYLISTS_QUERY = gql`{
  playlists {
    items {
      _key
      name
      ids
    }
    offset
    count
    total
  }
}`

export default {
  data: () => ({
    playlists: {
      items: [],
      offset: 0,
      count: 0,
      total: 0
    }
  }),
  apollo: {
    playlists: PLAYLISTS_QUERY
  },
  computed: {
    ...mapGetters([
      'newPlaylist'
    ])
  },
  methods: {
    rename({ target: { value } }) {
      this.$store.commit('new-playlist@rename', value)
    },
    async save() {
      try {
        await this.$apollo.mutate({
          mutation: gql`
            mutation ($name: String!, $ids: [ID]!) {
              createPlaylist(name: $name, ids: $ids) {
                _id
                name
                ids
              }
            }
          `,
          variables: {
            name: this.newPlaylist.name,
            ids: this.newPlaylist.items.map(({ id }) => id)
          },
          update: (store, { data: { createPlaylist } }) => {
            const data = store.readQuery({ query: PLAYLISTS_QUERY })

            data.playlists.items.unshift(createPlaylist)
            data.playlists.count += 1
            data.playlists.total += 1

            store.writeQuery({ query: PLAYLISTS_QUERY, data })

            this.$store.commit('new-playlist@clear')
          },
        })
      } catch (error) { // FIXME: Should parse
        console.log(error)

        this.$store.dispatch(SHOW_ERROR,
          (error && error.graphQLErrors && error.graphQLErrors[0] && error.graphQLErrors[0].message) ?
            error.graphQLErrors[0].message : 'Playlist creating is failed'
        )
      }
    }
  },
  components: {
    Add
  }
}
</script>

<style lang="sass">
.playlists
  .new
    .new-wrapper
      width: 210px
      height: 30px
      .title

.add
  margin-left: 5px

.input
  border: 1px solid white
  color: white
  background-color: black
  outline: none

.playlist-links
  display: flex
  flex-direction: column

  .playlist-link
    &.active
      color: purple

</style>
