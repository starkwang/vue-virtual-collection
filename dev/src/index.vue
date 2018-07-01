<template>
    <div class="container">
        <button @click="groupItems = !groupItems">
            {{ groupItems ? "Flatten items" : "Group items" }}
        </button>
        <GroupedItems v-if="groupItems" />
        <FlatItems v-else />
    </div>
</template>

<script>
import GroupedItems from "./GroupedItems"
import FlatItems from "./FlatItems"
export default {
    components: {
        GroupedItems,
        FlatItems
    },
    data() {
        return {
            groupItems: false
        }
    }
}
</script>

<style scoped>
.container {
    display: grid;
    grid-template-rows: auto 1fr;
    justify-items: start;
    grid-row-gap: 10px;
}
</style>
