<template>
    <div>
        <button @click="addGroup">Add group</button>
        <button @click="deleteGroup">Delete group</button>
        <button @click="addItem">Add item</button>
        <button @click="mutateItem">Mutate item</button>
        <button @click="deleteItem">Delete item</button>
        <VirtualCollection :cellSizeAndPositionGetter="cellSizeAndPositionGetter" :collection="items" :height="500" :width="600">
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
                items: [
                    { group: new Array(10).fill(0).map((_, index) => ({ data: '#' + index })) },
                    { group: new Array(5).fill(0).map((_, index) => ({ data: '#' + (index + 10) })) },
                    { group: new Array(3).fill(0).map((_, index) => ({ data: '#' + (index + 15) })) },
                ],
            }
        },
        methods: {
            cellSizeAndPositionGetter(item, itemIndex, groupIndex) {
                // compute size and position
                return {
                    width: 100,
                    height: 150,
                    x: (groupIndex * 2 + itemIndex % 2) * 110,
                    y: parseInt(itemIndex / 2) * 160
                }
            },
            addGroup() {
                console.log("Adding group")
                this.items.unshift({ group: [{ data: "baz" }] })
            },
            deleteGroup() {
                console.log("Deleting group")
                this.items.shift()
            },
            addItem() {
                console.log("Adding item to first group");
                this.items[0].group.unshift({ data: "foo" })
            },
            mutateItem() {
                console.log("Modifying item in first group")
                this.items[0].group[0].data = "bar";
            },
            deleteItem() {
                console.log("Deleting item in first group")
                this.items[0].group.shift()
            }
        }
    }
</script>