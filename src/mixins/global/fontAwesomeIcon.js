import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
    faXmark,
    faKey,
    faChevronLeft,
    faChevronRight,
    faMobileScreen,
    faAnglesLeft,
    faAnglesRight,
    faShare,
    faCircleXmark
} from '@fortawesome/free-solid-svg-icons'

export default {
    created() {
        // config.autoAddCss = false

        library.add(
            faXmark,
            faKey,
            faChevronLeft,
            faChevronRight,
            faMobileScreen,
            faAnglesLeft,
            faAnglesRight,
            faShare,
            faCircleXmark
        )
    },
    components: {
        FontAwesomeIcon
    }
}