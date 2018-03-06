<style lang="less" scoped>
.vue-virtual-collection {
    overflow: auto;
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
    <div class="vue-virtual-collection" :style="outerStyle" @scroll="onScroll" ref="outer">
        <div class="vue-virtual-collection-container" :style="scrollHeight">
            <div v-for="(item, index) in displayItems" class="cell-container" :key="index" :style="getComputedStyle(item, index)">
                <slot name="cell" :data="collection[item.index].data"></slot>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from "vue"
export default {
    props: ["cellSizeAndPositionGetter", "collection", "height", "width"],
    data() {
        return {
            displayItems: []
        }
    },
    watch: {
        collection() {
            this.flushDisplayItems()
        }
    },
    created() {
        // get rid of getter for improve performance
        this._cacheBoundry = []
        this._height = this.height
        this._width = this.width

        this.flushDisplayItems()
    },
    methods: {
        getComputedStyle(item, index) {
            const { width, height, x, y } = item
            return {
                left: `${x}px`,
                top: `${y}px`,
                width: `${width}px`,
                height: `${height}px`
            }
        },
        checkIfNeedRender(item, index) {
            return true
        },
        onScroll() {
            this.flushDisplayItems()
        },
        isInViewPort(index, { scrollTop, scrollLeft }) {
            const { _height: outerHeight, _width: outerWidth } = this
            const { top, bottom, left, right } = this._cacheBoundry[index]
            if (
                right < scrollLeft ||
                left - outerWidth > scrollLeft ||
                top - scrollTop > outerHeight ||
                bottom < scrollTop
            ) {
                return false
            } else {
                return true
            }
        },
        flushDisplayItems() {
            let scrollTop = 0
            let scrollLeft = 0
            if (this.$refs.outer) {
                scrollTop = this.$refs.outer.scrollTop
                scrollLeft = this.$refs.outer.scrollLeft
            }
            this.displayItems = this.cellSizeAndPosition.filter(sizeAndPosition =>
                this.isInViewPort(sizeAndPosition.index, { scrollTop, scrollLeft })
            )
        }
    },
    computed: {
        cellSizeAndPosition() {
            const { height: outerHeight, width: outerWidth } = this
            const cellSizeAndPosition = this.collection.map((item, index) => {
                const { x, y, width, height } = this.cellSizeAndPositionGetter(item, index)
                this._cacheBoundry[index] = {
                    top: y - 5 * height,
                    bottom: y + 6 * height,
                    left: x - 5 * width,
                    right: x + 6 * width
                }
                return { x, y, width, height, index }
            })
            return cellSizeAndPosition
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
