import SectionManager from "./SectionManager";

/** Represents a group of logically-related items */
export default class GroupManager {
    constructor (group, groupId, sectionSize, cellSizeAndPositionGetter, unwatch) {
        this._groupId = groupId
        this._sectionSize = sectionSize
        this._cellSizeAndPositionGetter = cellSizeAndPositionGetter;
        this._unwatch = unwatch
        this.totalHeight = 0
        this.totalWidth = 0
        this.updateGroup(group)
    }

    updateGroup(group) {
        const sectionManager = new SectionManager(this._sectionSize)
        let totalHeight = 0
        let totalWidth = 0

        group.forEach((item, index) => {
            const cellMetadatum = this._cellSizeAndPositionGetter(item, index, this._groupId)
            sectionManager.registerCell({
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
        })

        sectionManager.freezeCells()
        
        this._group = group
        this._sectionManager = sectionManager
        this.totalHeight = totalHeight
        this.totalWidth = totalWidth
    }

    getCellIndices(region) {
        return this._sectionManager.getCellIndices(region);
    }

    getCellMetadata(index) {
        return this._sectionManager.getCellMetadata(index)
    }

    getItem(index) {
        return this._group[index]
    }

    dispose() {
        this._unwatch()
    }
}