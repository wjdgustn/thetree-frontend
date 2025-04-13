export default {
    data() {
        return {

        }
    },
    methods: {
        doc_fulltitle(document) {
            const type = typeof document;

            if(type === 'object') {
                if(document.forceShowNamespace === false) return document.title;
                return `${document.namespace}:${document.title}`;
            }
            else return document;
        },
        user_doc(str) {
            return `사용자:${str}`;
        },
        contribution_link(uuid) {
            return `/contribution/${uuid}/document`;
        },
        contribution_link_discuss(uuid) {
            return `/contribution/${uuid}/discuss`;
        },
        contribution_link_edit_request(uuid) {
            return `/contribution/${uuid}/edit_request`;
        },
        encodeSpecialChars(str, exclude = []) {
            const specialChars = '?&=+$#%'.split('');
            return str.split('').map(a => specialChars.includes(a) && !exclude.includes(a) ? encodeURIComponent(a) : a).join('');
        },
        doc_action_link(document, route, query = {}) {
            const specialUrls = [
                '.',
                '..',
                '\\'
            ];

            const title = this.doc_fulltitle(document);
            let str;
            if(specialUrls.includes(title) || route.startsWith('a/')) {
                query.doc = encodeURIComponent(title);
                str = `/${route}/`;
            }
            else str = `/${route}/${this.encodeSpecialChars(title)}`;
            if(Object.keys(query).length > 0) {
                str += '?';
                str += Object.keys(query).filter(k => query[k]).map(k => `${k}=${query[k]}`).join('&');
            }
            return str;
        }
    }
}