import { mapGetters, mapActions } from 'vuex'

export const ebookMinxins = {
  methods: {
    ...mapActions([
      'setFileName',
      'setMenuVisible'
    ])
  },
  computed: {
    ...mapGetters([
      'fileName',
      'menuVisible'
    ])
  }
}
