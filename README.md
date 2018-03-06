# vue-virtual-collection

Vue component for efficiently rendering large collection data

[Demo](https://starkwang.github.io/vue-virtual-collection/demo/dist/index.html)

# Usage

### Install
```
npm i vue-virtual-collection
```

### import
```js
import Vue from 'vue'
import VirtualCollection from 'vue-virtual-collection'

Vue.use(VirtualCollection)
```

### Use it !
```html
<template>
    <div>
        <VirtualCollection :cellSizeAndPositionGetter="cellSizeAndPositionGetter" :collection="items" :height="500" :width="330">
            <div slot="cell" slot-scope="props">{{props.data}}</div>
        </VirtualCollection>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                /**
                 * This will create 1000 items like:
                 * [
                 *   { data: '#0' },
                 *   { data: '#1' },
                 *   ...
                 *   { data: '#999' }
                 * ]
                 */
                items: new Array(1000).fill(0).map((_, index) => ({ data: '#' + index }))
            }
        },
        methods: {
            cellSizeAndPositionGetter(item, index) {
                // compute size and position
                return {
                    width: 100,
                    height: 150,
                    x: (index % 2) * 110,
                    y: parseInt(index / 2) * 160
                }
            }
        }
    }
</script>
```