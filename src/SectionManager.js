import Section from "./Section"

const SECTION_SIZE = 600

export default class SectionManager {
    constructor(sectionSize = SECTION_SIZE) {
        this._sectionSize = sectionSize

        this._cellMetadata = []
        this._sections = {}
    }

    registerCell({ cellMetadatum, index }) {
        const frozenCellMetadatum = Object.freeze(cellMetadatum);
        this._cellMetadata[index] = frozenCellMetadatum

        this.getSections(frozenCellMetadatum).forEach(section => section.addCellIndex({ index }))
    }

    freezeCells() {
        Object.freeze(this._cellMetadata)
    }

    /** Get all Sections overlapping the specified region. */
    getSections({ height, width, x, y }) {
        const sectionXStart = Math.floor(x / this._sectionSize)
        const sectionXStop = Math.floor((x + width - 1) / this._sectionSize)
        const sectionYStart = Math.floor(y / this._sectionSize)
        const sectionYStop = Math.floor((y + height - 1) / this._sectionSize)

        const sections = []

        for (let sectionX = sectionXStart; sectionX <= sectionXStop; sectionX++) {
            for (let sectionY = sectionYStart; sectionY <= sectionYStop; sectionY++) {
                const key = `${sectionX}.${sectionY}`

                if (!this._sections[key]) {
                    this._sections[key] = new Section({
                        height: this._sectionSize,
                        width: this._sectionSize,
                        x: sectionX * this._sectionSize,
                        y: sectionY * this._sectionSize
                    })
                }

                sections.push(this._sections[key])
            }
        }

        return sections
    }

    /** Total number of Sections based on the currently registered cells. */
    getTotalSectionCount() {
        return Object.keys(this._sections).length
    }

    /**
     * Gets all cell indices contained in the specified region.
     * A region may encompass 1 or more Sections.
     */
    getCellIndices({ height, width, x, y }) {
        const indices = {}

        this.getSections({ height, width, x, y }).forEach(section =>
            section.getCellIndices().forEach(index => {
                indices[index] = index
            })
        )

        // Object keys are strings; this function returns numbers
        return Object.keys(indices).map(index => indices[index])
    }

    getCellMetadata(index) {
        return this._cellMetadata[index]
    }
}
