export default {
    data() {
        return {
            searchTextModel: '',
            show: false
        }
    },
    methods: {
        reset() {
            this.searchTextModel = ''
            this.show = false
        }
    }
}