import VirtualCollection from "./VirtualCollection.vue"

const plugin = {
    install(Vue) {
        Vue.component("VirtualCollection", VirtualCollection)
    },
}

export default plugin
