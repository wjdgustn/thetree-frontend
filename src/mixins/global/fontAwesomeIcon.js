import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
    faXmark,
    faKey,
    faChevronRight,
    faMobileScreen
} from '@fortawesome/free-solid-svg-icons'

export default {
    created() {
        // config.autoAddCss = false

        library.add(
            faXmark,
            faKey,
            faChevronRight,
            faMobileScreen
        )
    },
    components: {
        FontAwesomeIcon
    }
}