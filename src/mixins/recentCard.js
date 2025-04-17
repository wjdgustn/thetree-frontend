import Common from '@/mixins/common'
import LocalDate from '@/components/localDate';

export default {
    mixins: [Common],
    components: {
        LocalDate
    },
    data() {
        return {
            recent: [],
            interval: null
        }
    },
    mounted() {
        this.interval = setInterval(() => this.updateSidebar(), 1000 * 30)
        this.updateSidebar().then()
    },
    beforeUnmount() {
        if(this.interval) {
            clearInterval(this.interval)
            this.interval = null
        }
    },
    methods: {
        async updateSidebar() {
            const res = await fetch('/sidebar.json')
            this.recent = await res.json()
        }
    }
}