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
    div.playlist-link-container(
      v-for="(playlist, i) in playlists.items"
      v-bind:key="playlist._key"
      v-on:dragover="onDragOver"
      v-on:drop="onDrop(playlist._key, ...arguments)"
    )
      router-link.playlist-link(
        v-bind:to="`/playlists/${playlist._key}`"
        v-text="playlist.name"
      )
      up.close(
        v-if="playlistsMenu.showItems[i]"
        v-bind:size="17"
        v-on:click.native="onHideItems(i)"
      )
      down.open(
        v-else
        v-bind:size="17"
        v-on:click.native="onShowItems(i)"
      )
      bin.delete(
        v-bind:size="17"
        v-on:click.native="deletePlaylist(playlist._key)"
      )
      div.items(v-show="playlistsMenu.showItems[i]")
        div.item(
          v-for="(item, i) in playlist.items"
          v-bind:key="`${i}-${item._id}`"
          v-text="item.title"
          v-bind:data-i="i"
          draggable="true"
          v-on:dragstart="onDragStart(playlist._key, item, i, ...arguments)"
        )
</template>

<script>
import gql from 'graphql-tag'
import { mapGetters } from 'vuex'
import { Drop, Drag } from 'vue-drag-drop'
import Add from 'components/icons/Add.vue'
import Up from 'components/icons/Up.vue'
import Down from 'components/icons/Down.vue'
import Bin from 'components/icons/Bin.vue'
import api from 'api'
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
    },
    showItems: []
  }),
  apollo: {
    playlists: {
      query: PLAYLISTS_QUERY,
      manual: true,
      async result({ data, loading, networkStatus }) {
        if (!loading) {
          const youtubeVideos = await Promise.all(data.playlists.items.map(playlist =>
            api.getVideos(playlist.ids)
          ))

          const resuts = {
            ...data.playlists,
            items: data.playlists.items.map((item, i) => ({ ...item, ...youtubeVideos[i] }))
          }

          this.playlists = resuts
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'newPlaylist',
      'playlistsMenu'
    ])
  },
  methods: {
    onRemove(event) {
      const { _key, currentIndex } = JSON.parse(event.dataTransfer.getData('text/plain'))

      this.removeItem(_key, currentIndex)
    },
    onDragStart(_key, item, index, event) {
      event.dataTransfer.setData('text/plain', JSON.stringify({ _key, data: item, currentIndex: index, type: 'MOVE' }))
    },
    onDragOver(event) {
      event.preventDefault()
    },
    onDrop(_key, event) {
      event.preventDefault()
      event.stopPropagation()

      const { type, data, currentIndex } = JSON.parse(event.dataTransfer.getData('text/plain'))
      const itemIndex = parseFloat(event.target.dataset.i) || 0
      const { top, height } = event.target.getBoundingClientRect()

      let index
      if (event.clientY < top + (height / 2)) {
        index = itemIndex
      } else {
        index = itemIndex + 1
      }

      if (type === 'INSERT') {
        this.addItem(_key, data, index)
      } else {
        this.moveItem(_key, currentIndex, index)
      }
    },
    onShowItems(i) {
      this.$store.commit('onShowItems', i)
    },
    onHideItems(i) {
      this.$store.commit('onHideItems', i)
    },
    rename({ target: { value } }) {
      this.$store.commit('new-playlist@rename', value)
    },
    async addItem(_key, data, index) {
      try {
        await this.$apollo.mutate({
          mutation: gql`
            mutation(
              $_key: ID!
              $sourceId: ID!
              $index: Int!
            ) {
              addPlaylistItem(
                _key: $_key
                sourceId: $sourceId
                index: $index
              ) {
                _key
                name
                ids
              }
            }
          `,
          variables: {
            _key,
            sourceId: data._id,
            index
          },
          update: (store, { data: { addPlaylistItem } }) => {
            const data = store.readQuery({ query: PLAYLISTS_QUERY })

            const replacedPlaylistIndex = data.playlists.items.findIndex(playlist => addPlaylistItem._key === playlist._key)
            data.playlists.items[0] = addPlaylistItem

            store.writeQuery({ query: PLAYLISTS_QUERY, data })
          }
        })
      } catch (error) { // FIXME: Should parse
        console.log(error)

        this.$store.dispatch(SHOW_ERROR,
          (error && error.graphQLErrors && error.graphQLErrors[0] && error.graphQLErrors[0].message) ?
            error.graphQLErrors[0].message : 'Playlist creating is failed'
        )
      }
    },
    async removeItem(_key, index) {
      try {
        await this.$apollo.mutate({
          mutation: gql`
            mutation(
              $_key: ID!
              $index: Int!
            ) {
              removePlaylistItem(
                _key: $_key
                index: $index
              ) {
                _key
                name
                ids
              }
            }
          `,
          variables: {
            _key,
            index
          },
          update: (store, { data: { removePlaylistItem } }) => {
            const data = store.readQuery({ query: PLAYLISTS_QUERY })

            const replacedPlaylistIndex = data.playlists.items.findIndex(playlist => removePlaylistItem._key === playlist._key)
            data.playlists.items[0] = removePlaylistItem

            store.writeQuery({ query: PLAYLISTS_QUERY, data })
          }
        })
      } catch (error) { // FIXME: Should parse
        console.log(error)

        this.$store.dispatch(SHOW_ERROR,
          (error && error.graphQLErrors && error.graphQLErrors[0] && error.graphQLErrors[0].message) ?
            error.graphQLErrors[0].message : 'Playlist creating is failed'
        )
      }
    },
    async moveItem(_key, currentIndex, nextIndex) {
      try {
        await this.$apollo.mutate({
          mutation: gql`
            mutation(
              $_key: ID!
              $currentIndex: Int!
              $nextIndex: Int!
            ) {
              movePlaylistItem(
                _key: $_key
                currentIndex: $currentIndex
                nextIndex: $nextIndex
              ) {
                _key
                name
                ids
              }
            }
          `,
          variables: {
            _key,
            currentIndex,
            nextIndex
          },
          update: (store, { data: { movePlaylistItem } }) => {
            const data = store.readQuery({ query: PLAYLISTS_QUERY })

            const replacedPlaylistIndex = data.playlists.items.findIndex(playlist => movePlaylistItem._key === playlist._key)
            data.playlists.items[0] = movePlaylistItem

            store.writeQuery({ query: PLAYLISTS_QUERY, data })
          }
        })
      } catch (error) { // FIXME: Should parse
        console.log(error)

        this.$store.dispatch(SHOW_ERROR,
          (error && error.graphQLErrors && error.graphQLErrors[0] && error.graphQLErrors[0].message) ?
            error.graphQLErrors[0].message : 'Playlist creating is failed'
        )
      }
    },
    async save() {
      try {
        await this.$apollo.mutate({
          mutation: gql`
            mutation($name: String!, $ids: [ID]!) {
              createPlaylist(name: $name, ids: $ids) {
                _key
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
    },
    async deletePlaylist(_key) {
      try {
        await this.$apollo.mutate({
          mutation: gql`
            mutation($_key: ID!) {
              deletePlaylist(_key: $_key) {
                _key
                _id
                name
                ids
              }
            }
          `,
          variables: {
            _key
          },
          update: (store, { data: { deletePlaylist } }) => {
            const data = store.readQuery({ query: PLAYLISTS_QUERY })

            const deletedPlaylistIndex = data.playlists.items.findIndex(playlist => deletePlaylist._key === playlist._key)
            data.playlists.items.splice(deletedPlaylistIndex, 1)
            data.playlists.count -= 1
            data.playlists.total -= 1

            store.writeQuery({ query: PLAYLISTS_QUERY, data })
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
  mounted() {
    document.addEventListener('dragover', this.onDragOver)
    document.addEventListener('drop', this.onRemove)
  },
  components: {
    Add,
    Bin,
    Drop,
    Drag,
    Up,
    Down
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

  .playlist-link-container
    display: grid
    grid-template-columns: auto 21.6px 21.6px
    grid-template-areas: 'name toggler delete' 'items items items'

    .playlist-link
      grid-area: name

      &.active
        color: purple

    .close
      grid-area: toggler

    .open
      grid-area: toggler

    .delete
      grid-area: delete

    .items
      width: 190px
      grid-area: items
      display: flex
      flex-direction: column

      .item
        white-space: nowrap
        overflow: hidden
        text-overflow: ellipsis

</style>
