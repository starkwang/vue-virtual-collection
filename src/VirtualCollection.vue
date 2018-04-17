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
    <div class="vue-virtual-collection" :style="outerStyle" ref="outer">
        <vertical-scroll :listenScroll="true"
                             :probeType="3"
                             :bounce="false"
                             @scroll="verticalScroll">
            <div class="vue-virtual-collection-container" :style="containerStyle">
                <div v-for="(item, index) in displayItems" class="cell-container" :key="item.index" :style="getComputedStyle(item, index)">
                    <slot name="cell" :data="item.data"></slot>
                </div>
            </div>
         </vertical-scroll>
    </div>
</template>

<script>
import SectionManager from "./SectionManager"
import VerticalScroll from "base/VerticalScroll";

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
            // 设置当前视图我们中应该显示那些块
            this.flushDisplayItems(0, 0);
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
         // 垂直滚动
        verticalScroll (pos) {
            this.flushDisplayItems(pos.x, pos.y)
        },
        flushDisplayItems (x, y) {
            let scrollLeft = x;
            let scrollTop = Math.abs(y);

            // 然后这里我们需要去设置当前视图中应该渲染那些块
            // 于是我们要在 SectionManager类中定义一个方法去获取需要渲染的那个块的索引
            let indices = this._sectionManager.getCellIndices({
                height: this.height,
                width: this.width,
                x: scrollLeft,
                y: scrollTop
            });

            // 到这里我们已经获取到了索引了,然后我们就可以去渲染该视图所对应的块了
            const displayItems = [];

            indices.forEach(index => {
                displayItems.push({
                    index,
                    ...this.collection[index]
                })
            });

            // 重新渲染数据
            this.displayItems = displayItems;

            // 收集的滚动高度
            this.setScrollTop(-scrollTop);
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
