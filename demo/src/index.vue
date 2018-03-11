<style lang="less" scoped>
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    .title {
        margin: 40px;
        font-size: 30px;
    }
    .collection {
        margin-top: 20px;
        .vue-virtual-collection {
            margin: 0 auto;
        }
    }
    .text {
        input {
            text-align: center;
            border: 0;
            width: 75px;
            border-bottom: 1px solid #e0e0e0;
        }
    }
}
.card {
    background: #aaa;
    width: 100%;
    height: 100%;
    color: #fff;
    line-height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    &.color0 {
        background: rgb(244, 67, 54);
    }
    &.color1 {
        background: rgb(255, 235, 59);
    }
    &.color2 {
        background: rgb(255, 152, 0);
    }
    &.color3 {
        background: rgb(33, 150, 243);
    }
    &.color4 {
        background: rgb(55, 64, 70);
    }
    &.color5 {
        background: rgb(103, 58, 183);
    }
    &.color6 {
        background: rgb(63, 81, 181);
    }
    &.color7 {
        background: rgb(76, 175, 80);
    }
}
</style>

<template>
    <div id="app">
        <div class="title">Vue Virtual Collection</div>
        <div class="text">With <input v-model="amount"/> data in <input v-model="line"/> columns</div>
        <div class="collection">
            <VirtualCollection :cellSizeAndPositionGetter="cellSizeAndPositionGetter" :collection="items" :height="800" :width="width">
                <div slot="cell" slot-scope="props" class="card" :class="props.data.color">{{props.data.text}}</div>
            </VirtualCollection>
        </div>
    </div>
</template>

<script>
export default {
    name: "App",
    data() {
        return {
            amount: "100000",
            line: "30",
            width: (document.body.clientWidth || document.documentElement.clientWidth) - 20
        }
    },
    computed: {
        items() {
            const amount = +this.amount
            const line = +this.line
            const columnHeight = new Array(line).fill(0)
            return new Array(amount).fill(1).map((_, index) => {
                const column = index % line
                const height = 50 + 100 * Math.random()
                const result = {
                    data: {
                        text: `#${index}`,
                        color: this.randomColor()
                    },
                    height,
                    width: 75,
                    x: column * 85,
                    y: columnHeight[column]
                }
                columnHeight[column] += height + 10
                return result
            })
        }
    },
    methods: {
        cellSizeAndPositionGetter(item, index) {
            const { data, ...sizeAndPosition } = item
            return sizeAndPosition
        },
        randomColor() {
            return "color" + parseInt(Math.random() * 8)
        }
    }
}
</script>
