# vue-virtual-collection

[![npm version](https://badge.fury.io/js/vue-virtual-collection.svg)](https://badge.fury.io/js/vue-virtual-collection)
[![Build Status](https://travis-ci.org/starkwang/vue-virtual-collection.svg?branch=master)](https://travis-ci.org/starkwang/vue-virtual-collection)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![npm](https://img.shields.io/npm/dt/vue-virtual-collection.svg)](https://www.npmjs.com/package/vue-virtual-collection)


Vue component for efficiently rendering large collection data. Inspired by [react-virtualize](https://github.com/bvaughn/react-virtualized)

[Demo](https://starkwang.github.io/vue-virtual-collection/demo/dist/index.html)

![Demo](https://starkwang.github.io/vue-virtual-collection/img/demo.png)

# Usage

## Install
```
npm i vue-virtual-collection
```

## import
```js
import Vue from 'vue'
import VirtualCollection from 'vue-virtual-collection'

Vue.use(VirtualCollection)
```

## Use it !
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


## Props

### cellSizeAndPositionGetter

Type: `Function`

`(item: object, index: number) -> ({ height: number, width: number, x: number, y: number })`

**Required: ✓**

Callback responsible for returning size and offset/position information for a given cell

```js
function cellSizeAndPositionGetter(item, index) {
    return {
        width: item.width,
        height: item.height,
        x: item.x,
        y: item.y
    }
}
```


### collection

Type: `Array`

**Required: ✓**

The Data for cells to render. Each object in array Must contains `data` property, which will be passed into slot scope.

```js
const collection = [
    { data: { text: "#1" } },
    { data: { text: "#2" } },
    { data: { text: "#3" } },
    // ...
]
```

### width

Type: `number`

**Required: ✓**

The width of collection

### height

Type: `number`

**Required: ✓**

The height of collection

### sectionSize

Type: `number`

Optionally override the size of the sections a Collection's cells are split into. This is an advanced option and should only be used for performance tuning purposes.



## Slots

### cell
```html
<div slot="cell" slot-scope="yourOwnScope">{{yourOwnScope.data.text}}</div>
```

*The `data` property in items of `collection` will be passed into the slot scope.*
```js
const collection = [
    { data: { text: "#1" } },
    { data: { text: "#2" } },
    { data: { text: "#3" } },
    // ...
]
```
