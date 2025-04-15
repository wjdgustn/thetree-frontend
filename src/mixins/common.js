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
        },
        getTitleDescription(page) {
            const text = {
                edit_edit_request: '편집 요청',
                edit_request: '편집 요청',
                edit: '편집',
                history: '역사',
                backlinks: '역링크',
                move: '이동',
                delete: '삭제',
                acl: 'ACL',
                thread: '토론',
                thread_list: '토론 목록',
                thread_list_close: '닫힌 토론',
                edit_request_close: '닫힌 편집 요청',
                diff: '비교',
                revert: `r${page.data.rev}로 되돌리기`,
                raw: `r${page.data.rev} RAW`,
                blame: `r${page.data.rev} Blame`,
                wiki: page.data.rev ? `r${page.data.rev}` : '',
            }[page.viewName];

            let additionalText;
            if(page.data.thread) additionalText = page.data.thread.topic;

            return text ? ` (${text})` + (additionalText ? ` - ${additionalText}` : '') : '';
        },
        removeHtmlTags(text) {
            return text.replaceAll(/<[^>]+>/g, '');
        }
    }
}