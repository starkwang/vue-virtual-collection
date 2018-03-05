<style>
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
.card {
    background: #aaa;
}
</style>

<template>
  <div id="app">
    <input v-model="amount"/>
    <VirtualCollection :cellSizeAndPositionGetter="cellSizeAndPositionGetter" :collection="items" :height="500" :width="330">
      <div slot="cell" slot-scope="props" class="card">{{props.data}}</div>
    </VirtualCollection>
  </div>
</template>

<script>
export default {
    name: "App",
    data() {
        return {
            amount: "2000"
        }
    },
    computed: {
        items() {
            const line = 100
            const columnHeight = new Array(line).fill(0)
            return new Array(+this.amount).fill(1).map((_, index) => {
                const column = index % line
                const height = 100 + 50 * Math.random()
                const result = {
                    data: `item${index}`,
                    height,
                    width: 100,
                    x: column * 110,
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
        }
    }
}
</script>
