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
        <div class="vue-virtual-collection-container" :style="scrollHeight">
            <div v-for="(item, index) in displayItems" class="cell-container" :key="item.index" :style="getComputedStyle(item, index)">
                <slot name="cell" :data="item.data"></slot>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from "vue"
import SectionManager from "./SectionManager"
export default {
    props: {
        cellSizeAndPositionGetter: Function,
        collection: Array,
        height: Number,
        width: Number
    },
    data() {
        return {
            displayItems: []
        }
    },
    watch: {
        collection() {
            this._sectionManager = new SectionManager()
            this.registerCellsToSectionManager()
            this.flushDisplayItems()
        }
    },
    created() {
        this._sectionManager = new SectionManager()
        this.registerCellsToSectionManager()
        this.flushDisplayItems()
    },
    methods: {
        registerCellsToSectionManager() {
            if (!this._sectionManager) {
                this._sectionManager = new SectionManager()
            }
            this.collection.forEach((item, index) => {
                this._sectionManager.registerCell({
                    index,
                    cellMetadatum: this.cellSizeAndPositionGetter(item, index)
                })
            })
        },
        getComputedStyle(displayItem) {
            if (!displayItem) return
            const { width, height, x, y } = this.cellSizeAndPosition[displayItem.index]
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
        cellSizeAndPosition() {
            return this.collection.map((item, index) => this.cellSizeAndPositionGetter(item, index))
        },
        scrollHeight() {
            let containerHeight = 0
            let containerWidth = 0
            const { cellSizeAndPosition } = this
            cellSizeAndPosition.forEach(sizeAndPosition => {
                const { x, y, width, height } = sizeAndPosition
                const bottom = y + height
                const right = x + width
                if (bottom > containerHeight) {
                    containerHeight = bottom
                }
                if (right > containerWidth) {
                    containerWidth = right
                }
            })
            return {
                height: containerHeight + "px",
                width: containerWidth + "px"
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
