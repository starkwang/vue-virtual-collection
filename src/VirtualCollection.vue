<style lang="less" scoped>
.vue-virtual-collection {
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    &-container {
        position: relative;
    }
    .cell-container {
        position: absolute;
        top: 0;
    }
}
</style>

<template>
    <div class="vue-virtual-collection" :style="outerStyle" @scroll.passive="onScroll" ref="outer">
        <div class="vue-virtual-collection-container" :style="containerStyle">
            <div v-for="(item, index) in displayItems" class="cell-container" :key="item.index" :style="getComputedStyle(item, index)">
                <slot name="cell" :data="item.data"></slot>
            </div>
        </div>
    </div>
</template>

<script>
import SectionManager from "./SectionManager"
export default {
    props: {
        cellSizeAndPositionGetter: {
            type: Function,
            required: true
        },
        collection: {
            type: Array,
            required: true
        },
        height: {
            type: Number,
            required: true,
            validator(value) {
                return value >= 0
            }
        },
        width: {
            type: Number,
            required: true,
            validator(value) {
                return value >= 0
            }
        },
        sectionSize: {
            type: Number,
            default: 300
        }
    },
    data() {
        return {
            displayItems: [],
            totalHeight: 0,
            totalWidth: 0
        }
    },
    watch: {
        collection() {
            this.init()
        }
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            this._sectionManager = new SectionManager(this.sectionSize)
            this.registerCellsToSectionManager()
            this.flushDisplayItems()
        },
        registerCellsToSectionManager() {
            if (!this._sectionManager) {
                this._sectionManager = new SectionManager(this.sectionSize)
            }
            let totalHeight = 0
            let totalWidth = 0
            this.collection.forEach((item, index) => {
                // register
                const cellMetadatum = this.cellSizeAndPositionGetter(item, index)
                this._sectionManager.registerCell({
                    index,
                    cellMetadatum
                })

                // compute total height and total width
                const { x, y, width, height } = cellMetadatum
                const bottom = y + height
                const right = x + width
                if (bottom > totalHeight) {
                    totalHeight = bottom
                }
                if (right > totalWidth) {
                    totalWidth = right
                }
                this.totalHeight = totalHeight
                this.totalWidth = totalWidth
            })
        },
        getComputedStyle(displayItem) {
            if (!displayItem) return
            const { width, height, x, y } = this._sectionManager.getCellMetadata(displayItem.index)
            return {
                left: `${x}px`,
                top: `${y}px`,
                width: `${width}px`,
                height: `${height}px`
            }
        },
        onScroll(e) {
            this.flushDisplayItems()
        },
        flushDisplayItems() {
            let scrollTop = 0
            let scrollLeft = 0
            if (this.$refs.outer) {
                scrollTop = this.$refs.outer.scrollTop
                scrollLeft = this.$refs.outer.scrollLeft
            }
            var indices = this._sectionManager.getCellIndices({
                height: this.height,
                width: this.width,
                x: scrollLeft,
                y: scrollTop
            })
            const displayItems = []
            indices.forEach(index => {
                displayItems.push({
                    index,
                    ...this.collection[index]
                })
            })
            if (window.requestAnimationFrame) {
                window.requestAnimationFrame(() => {
                    this.displayItems = displayItems
                    this.$forceUpdate()
                })
            } else {
                this.displayItems = displayItems
                this.$forceUpdate()
            }
        }
    },
    computed: {
        containerStyle() {
            return {
                height: this.totalHeight + "px",
                width: this.totalWidth + "px"
            }
        },
        outerStyle() {
            return {
                height: this.height + "px",
                width: this.width + "px"
            }
        }
    }
}
</script>
