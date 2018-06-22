import { shallowMount } from '@vue/test-utils'
import VirtualCollection from '../src/VirtualCollection.vue'
import { assert, expect } from "chai"

function cellSizeAndPositionGetter(item, index) {
    // compute size and position
    return {
        width: 100,
        height: 150,
        x: (index % 2) * 110,
        y: parseInt(index / 2) * 160
    }
}

const items = new Array(1000).fill(0).map((_, index) => ({ data: '#' + index }))

describe('VirtualCollection', () => {
    it('can render cells correctly', () => {
        const wrapper = shallowMount(
            VirtualCollection,
            {
                propsData: {
                    cellSizeAndPositionGetter,
                    collection: items,
                    height: 300,
                    width: 500
                },
                scopedSlots: {
                    cell: '<div slot-scope="props">{{props.data}}</div>'
                }
            }
        )
        expect(wrapper.findAll('.cell-container').length >= 4).to.be.true
        expect(wrapper.text()).to.be.equal('#0#1#2#3')
    })

    it('will not render cells if width or height equals zero', () => {
        const wrapper1 = shallowMount(
            VirtualCollection,
            {
                propsData: {
                    cellSizeAndPositionGetter,
                    collection: items,
                    height: 0,
                    width: 500
                },
                scopedSlots: {
                    cell: '<div slot-scope="props">{{props.data}}</div>'
                }
            }
        )
        expect(wrapper1.findAll('.cell-container').length).to.equal(0)

        const wrapper2 = shallowMount(
            VirtualCollection,
            {
                propsData: {
                    cellSizeAndPositionGetter,
                    collection: items,
                    height: 500,
                    width: 0
                },
                scopedSlots: {
                    cell: '<div slot-scope="props">{{props.data}}</div>'
                }
            }
        )
        expect(wrapper2.findAll('.cell-container').length).to.equal(0)
    })

    it('can correctly render cells if data change', () => {
        let changedData = new Array(1000).fill(0).map((_, index) => ({ data: '#' + index }))
        const wrapper1 = shallowMount(
            VirtualCollection,
            {
                propsData: {
                    cellSizeAndPositionGetter,
                    collection: changedData,
                    height: 500,
                    width: 500
                },
                scopedSlots: {
                    cell: '<div slot-scope="props">{{props.data}}</div>'
                }
            }
        )
        expect(wrapper1.text()).to.equal("#0#1#2#3#4#5#6#7")

        wrapper1.setProps({ collection: changedData.slice(-2) })

        expect(wrapper1.text()).to.equal("#998#999")
    })


})