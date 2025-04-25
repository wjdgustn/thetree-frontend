import { markRaw } from 'vue'

import FontAwesomeIcon from '@/mixins/global/fontAwesomeIcon'

export default {
    mixins: [
        FontAwesomeIcon
    ],
    computed: {
        page() {
            return this.$store.state.page
        },
        data() {
            return this.$store.state.viewData
        },
        session() {
            return this.$store.state.session
        }
    }
}