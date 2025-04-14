import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
    faXmark
} from '@fortawesome/free-solid-svg-icons'

export default {
    created() {
        // config.autoAddCss = false

        library.add(
            faXmark
        )
    },
    components: {
        FontAwesomeIcon
    }
}