import { markRaw } from 'vue'

import FontAwesomeIcon from '@/mixins/global/fontAwesomeIcon'

export default {
    mixins: [
        FontAwesomeIcon
    ],
    data() {
        return {
            thetreePlugins: {
                editor: []
            }
        }
    },
    created() {
        this.thetreePlugins.editor = Object.values(import.meta.glob('/plugins/editor/*/layout.vue', {
            eager: true,
            import: 'default'
        })).map(a => markRaw(a))
    }
}