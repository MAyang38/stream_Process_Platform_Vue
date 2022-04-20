import {get, post, gettwo, posttwo, getthree, postthree, getfour, postfour, getfive, postfive} from "../service/request";

export default {
    install(Vue) {
        Vue.mixin({
            methods: {
                $get(url, params) {
                    return get(url, params)
                },
                $post(url, params, config) {
                    return post(url, params, config)
                },
                $gettwo(url, params) {
                    return gettwo(url, params)
                },
                $posttwo(url, params, config) {
                    return posttwo(url, params, config)
                },
                $getthree(url, params) {
                    return getthree(url, params)
                },
                $postthree(url, params, config) {
                    return postthree(url, params, config)
                },
                $getfour(url, params) {
                    return getfour(url, params)
                },
                $postfour(url, params, config) {
                    return postfour(url, params, config)
                },
                $getfive(url, params) {
                    return getfive(url, params)
                },
                $postfive(url, params, config) {
                    return postfive(url, params, config)
                },
            }
        })
    }
}
