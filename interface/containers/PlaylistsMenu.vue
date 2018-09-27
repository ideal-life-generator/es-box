<template lang="pug">
div.playlists
  div.new-playlist
    input.input(
      type="text"
      v-bind:value="newPlaylist.name"
      v-on:input="rename"
      v-on:keyup.enter="createPlaylist"
    )
    div(v-for="(item, i) in newPlaylist.items")
      div(v-bind:key="item.id" v-text="item.title")
    add(
      class="add"
      v-bind:size="16"
      @click.native="createPlaylist"
    )
  div.playlist-links
    div.playlist-link-container(
      v-for="(playlist, i) in playlists.items"
      v-bind:key="playlist._key"
      v-on:dragover="onDragOver"
      v-on:drop="onDrop(playlist._key, ...arguments, this)"
    )
      header.header
        router-link.playlist-link(
          v-bind:to="`/playlist/${playlist._key}`"
          v-text="playlist.name"
        )
        //- div.toggler
        //-   up.close(
        //-     v-if="playlistsMenu.showItems[i]"
        //-     v-bind:size="17"
        //-     v-on:click.native="onHideItems(i)"
        //-   )
        //-   down.open(
        //-     v-else
        //-     v-bind:size="17"
        //-     v-on:click.native="onShowItems(i)"
        //-   )
        bin.delete(
          v-bind:size="17"
          v-on:click.native="deletePlaylist(playlist._key)"
        )
      //- div.items(
      //-   v-show="playlistsMenu.showItems[i]"
      //-   v-bind:data-i="0"
      //- )
      //-   div.item(
      //-     v-bind:class="{ active: player._id === item._id && currentItemIndex === i }"
      //-     v-for="(item, i) in playlist.items"
      //-     v-bind:key="`${i}-${item._id}`"
      //-     v-bind:data-i="i"
      //-     draggable="true"
      //-     v-on:dragstart="onDragStart(playlist._key, item, i, ...arguments)"
      //-   )
      //-     play-icon.play(
      //-       v-if="!player.play || (player.play && !(player._id === item._id && currentItemIndex === i))"
      //-       v-bind:size="21"
      //-       v-on:click.native="onPlay(playlist, item, i)"
      //-     )
      //-     pause-icon.pause(
      //-       v-else
      //-       v-bind:size="21"
      //-       v-on:click.native="onPause(playlist, item, i)"
      //-     )
      //-     div.title(v-text="item.title")
</template>

<script>
import gql from 'graphql-tag'
import { mapGetters } from 'vuex'
import {
  PLAYER_SET_ITEM,
  PLAYER_PLAY,
  PLAYER_PAUSE,
  PLAYER_PREVIOUS,
  PLAYER_ON_PREVIOUS,
  PLAYER_ON_NEXT
} from 'containers/Player.vue'
import Add from 'components/icons/Add.vue'
import Up from 'components/icons/Up.vue'
import Down from 'components/icons/Down.vue'
import Bin from 'components/icons/Bin.vue'
import PlayIcon from 'components/icons/Play.vue'
import PauseIcon from 'components/icons/Pause.vue'
import {
  PLAYLISTS_MENU_SET_CURRENT_PLAYLIST_ID_MUTATION,
  PLAYLISTS_MENU_SET_CURRENT_ACTION
} from 'store/playlists-menu'
import { NEW_PLAYLIST_CLEAR } from 'store/new-playlist'
import {
  COUNTER_UPDATE_CURRENT,
  COUNTER_UPDATE
} from 'store/counter'
import api from 'api'
import bus from 'events-bus'
import { SHOW_ERROR } from 'store/error'

const PLAYLISTS_QUERY = gql`
  query Playlists(
    $offset: Int!
    $limit: Int!
  ) {
    playlists(
      offset: $offset
      limit: $limit
    ) {
      items {
        _id
        _key
        name
      }
      total
    }
  }
`

export default {
  data: () => ({
    playlists: {
      items: [],
      offset: 0,
      limit: 0,
      total: 0
    }
  }),
  apollo: {
    playlists: {
      query: PLAYLISTS_QUERY,
      variables() {
        return {
          offset: 0,
          limit: 10
        }
      },
      manual: true,
      async result({ data, loading, networkStatus }) {
        if (!loading) {
          const youtubeVideos = await Promise.all(data.playlists.items.map(playlist =>
            api.getVideos(playlist.ids)
          ))

          const results = {
            ...data.playlists,
            items: data.playlists.items.map((item, i) => ({ ...item, ...youtubeVideos[i] }))
          }

          this.playlists = results

          if (!this.player._id && this.playlists.limit > 0) {
            if (this.playlists.items[0].limit > 0) {
              const { items: [item] } = this.playlists.items[0]

              this.setItem(this.playlists.items[0], this.playlists.items[0].items[0], 0)
            }
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'player',
      'newPlaylist',
      'playlistsMenu',
      'currentPlaylistSettings',
      'currentPlaylistId',
      'currentItemId',
      'currentItemIndex'
    ]),
    currentPlaylist() {
      return this.playlists.items.find(playlist => playlist._id === this.currentPlaylistId)
    }
  },
  methods: {
    setItem(playlist, item, index) {
      this.updateCurrent(playlist._id, item._id, index)

      if (this.player._id === item._id) {
        bus.$emit(PLAYER_SET_ITEM)
      } else {
        bus.$emit(PLAYER_SET_ITEM, item)
      }

      this.updateCounter(item._id)
    },
    onPlay(playlist, item, index) {
      this.play(playlist, item, index)
    },
    onPause(playlist, item, index) {
      this.pause(playlist, item, index)
    },
    play(playlist, item, index) {
      this.updateCurrent(playlist._id, item._id, index)

      if (this.player._id === item._id) {
        bus.$emit(PLAYER_PLAY)
      } else {
        bus.$emit(PLAYER_PLAY, item)
      }

      this.updateCounter(item._id)
    },
    pause() {
      bus.$emit(PLAYER_PAUSE)
    },
    updateCurrent(currentPlaylistId, currentItemId, currentItemIndex) {
      this.$store.dispatch(PLAYLISTS_MENU_SET_CURRENT_ACTION, {
        currentPlaylistId,
        currentItemId,
        currentItemIndex
      })
    },
    updateCounter() {
      this.$store.commit(COUNTER_UPDATE, { current: this.currentItemIndex, total: this.currentPlaylist.total })
    },
    [PLAYER_ON_PREVIOUS]() {
      let nextIndex
      if (this.currentItemIndex > 0) {
        nextIndex = this.currentItemIndex - 1
      } else if (this.player.repeatAll) {
        nextIndex = this.currentPlaylist.total - 1
      } else {
        nextIndex = 0
      }

      const { items: { [nextIndex]: nextItem } } = this.currentPlaylist

      if (nextItem) {
        if (this.player.play) {
          bus.$emit(PLAYER_PLAY, nextItem)
        } else {
          bus.$emit(PLAYER_SET_ITEM, nextItem)
        }

        this.updateCurrent(this.currentPlaylist._id, nextItem._id, nextIndex)
        this.updateCounter()
      }
    },
    [PLAYER_ON_NEXT]() {
      let nextIndex
      if (this.currentItemIndex < this.currentPlaylist.total - 1) {
        // if (this.currentItemIndex >= count - 1) {
        //   await this.onLoadMore()
        // }

        nextIndex = this.currentItemIndex + 1
      } else if (this.player.repeatAll) {
        nextIndex = 0
      } else {
        nextIndex = this.currentPlaylist.total - 1
      }

      const { items: { [nextIndex]: nextItem } } = this.currentPlaylist

      if (nextItem) {
        if (this.player.play) {
          bus.$emit(PLAYER_PLAY, nextItem)
        } else {
          bus.$emit(PLAYER_SET_ITEM, nextItem)
        }

        this.updateCurrent(this.currentPlaylist._id, nextItem._id, nextIndex)
        this.updateCounter()
      }
    },
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
    onDrop(_key, event, ...args) {
      event.preventDefault()
      event.stopPropagation()

      const { type, data, currentIndex } = JSON.parse(event.dataTransfer.getData('text/plain'))
      const itemIndex = parseFloat(event.target.closest('[data-i]').dataset.i)
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
    async createPlaylist() {
      try {
        await this.$apollo.mutate({
          mutation: gql`
            mutation(
              $name: String!
              $ids: [ID]!
            ) {
              createPlaylist(
                name: $name
                ids: $ids
              ) {
                _id
                _key
                name
              }
            }
          `,
          variables: {
            name: this.newPlaylist.name,
            ids: this.newPlaylist.items.map(({ id }) => id)
          },
          update: (store, { data: { createPlaylist } }) => {
            const data = store.readQuery({
              query: PLAYLISTS_QUERY,
              variables: {
                offset: 0,
                limit: 10
              }
            })

            data.playlists.items.unshift(createPlaylist)
            data.playlists.count += 1
            data.playlists.total += 1

            store.writeQuery({
              query: PLAYLISTS_QUERY,
              variables: {
                offset: 0,
                limit: 10
              },
              data
            })

            this.$store.commit(NEW_PLAYLIST_CLEAR)
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
                _id
                _key
                name
              }
            }
          `,
          variables: {
            _key
          },
          update: (store, { data: { deletePlaylist } }) => {
            const data = store.readQuery({
              query: PLAYLISTS_QUERY,
              variables: {
                offset: 0,
                limit: 10
              }
            })

            const deletedPlaylistIndex = data.playlists.items.findIndex(playlist => deletePlaylist._key === playlist._key)
            data.playlists.items.splice(deletedPlaylistIndex, 1)
            data.playlists.count -= 1
            data.playlists.total -= 1

            store.writeQuery({
              query: PLAYLISTS_QUERY,
              variables: {
                offset: 0,
                limit: 10
              },
              data
            })
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
    // console.log(this.currentPlaylistSettings)
    // this.$store.commit(COUNTER_UPDATE, {
    //   current: this.currentPlaylistSettings.currentItemIndex,
    //   // count: currentPlaylist.total
    // })

    // bus.$on(PLAYER_ON_PREVIOUS, this[PLAYER_ON_PREVIOUS])
    // bus.$on(PLAYER_ON_NEXT, this[PLAYER_ON_NEXT])

    // document.addEventListener('dragover', this.onDragOver)
    // document.addEventListener('drop', this.onRemove)
  },
  unmounted() {
    // bus.$off(PLAYER_ON_PREVIOUS, this[PLAYER_ON_PREVIOUS])
    // bus.$off(PLAYER_ON_NEXT, this[PLAYER_ON_NEXT])

    // document.removeEventListener('dragover', this.onDragOver)
    // document.removeEventListener('drop', this.onRemove)
  },
  components: {
    Add,
    Bin,
    Up,
    Down,
    PlayIcon,
    PauseIcon
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

    .header
      // display: grid
      // grid-template-columns: 300px 21.6px 21.6px
      // grid-template-areas: 'name toggler delete'

      .playlist-link
        grid-area: name

        &.active
          color: purple

      .toggler
        margin-left: 5px
        grid-area: toggler
        
        .close

        .open

      .delete
        margin-left: 5px
        grid-area: delete

    .items
      grid-area: items
      display: flex
      flex-direction: column

      .item
        display: grid
        grid-template-columns: 21.6px auto
        grid-template-areas: 'playback title'

        .play, .pause
          grid-area: playback

        .title
          grid-area: title
          white-space: nowrap
          overflow: hidden
          text-overflow: ellipsis

        &.active
          .title
            color: purple

</style>
