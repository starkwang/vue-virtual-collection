import Vue from "vue"
import VirtualCollection from "./VirtualCollection.vue"

const plugin = {
    install(Vue, options) {
        Vue.component("VirtualCollection", VirtualCollection)
    }
}

export default plugin
