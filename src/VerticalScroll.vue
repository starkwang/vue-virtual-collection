
<template>
    <div ref="wrapper" class="list-wrapper">
        <div ref="listWrapper">
            <slot></slot>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll';
    // 获取元素的长、宽、位置
    import {getRect} from './dom';

    // 横向滚动
    const DIRECTION_H = 'horizontal';
    // 垂直滚动
    const DIRECTION_V = 'vertical';

    export default {
        props: {
            /**
             * 滚动组件外部传入的数据
             * @type {Array}
             */
            data: {
                type: Array,
                default: function () {
                    return []
                }
            },
            /**
             * 滚动的状态
             * 当 probeType 为 1 的时候，会非实时（屏幕滑动超过一定时间后）派发scroll 事件；
             * 当 probeType 为 2 的时候，会在屏幕滑动的过程中实时的派发 scroll 事件；
             * 当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件。
             * @type {Number}
             */
            probeType: {
                type: Number,
                default: 1
            },
            /**
             * 是否开启回弹效果
             * @type {Boolean}
             */
            bounce: {
                type: Boolean,
                default: false
            },
            /**
             * 是否开启点击事件
             * @type {Boolean}
             */
            click: {
                type: Boolean,
                default: true
            },
            /**
             * 是否监听滚动事件
             * @type {Boolean}
             */
            listenScroll: {
                type: Boolean,
                default: false
            },
            /**
             * 是否监听滚动事件开始之前
             * @type {Boolean}
             */
            listenBeforeScroll: {
                type: Boolean,
                default: false
            },
            /**
             * 设置滚动方向
             * @type {Boolean}
             */
            direction: {
                type: String,
                default: DIRECTION_V
            },
            /**
             * 是否显示滚动条
             * @type {null}
             */
            scrollbar: {
                type: null,
                default: false
            },
            /**
             * 是否开启下拉刷新功能
             * @type {null}
             */
            pullDownRefresh: {
                type: null,
                default: false
            },
            /**
             * 是否开启上拉刷新功能
             * @type {null}
             */
            pullUpLoad: {
                type: null,
                default: false
            },
            /**
             * 纵轴方向初始化位置
             * @type {Number}
             */
            startY: {
                type: Number,
                default: 0
            },
            /**
             * 滚动组件刷新数据延迟
             * @type {Number}
             */
            refreshDelay: {
                type: Number,
                default: 20
            },
            /**
             * 是否开启支持横向和纵向同时滚动
             * @type {Boolean}
             */
            freeScroll: {
                type: Boolean,
                default: false
            },
            /**
             * 是否开启 PC 端的鼠标滚轮
             * @type {Boolean}
             */
            mouseWheel: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                /**
                 * 是否开启下拉刷新之前进行某些操作
                 * @type {Boolean}
                 */
                beforePullDown: true,
                /**
                 * 是否设置正在回弹
                 * @type {Boolean}
                 */
                isRebounding: false,
                /**
                 * 设置正在拉下
                 * @type {Boolean}
                 */
                isPullingDown: false,
                /**
                 * 设置正在上拉加载
                 * @type {Boolean}
                 */
                isPullUpLoad: false,
                /**
                 * 是否开启上拉显示文字
                 * @type {Boolean}
                 */
                pullUpDirty: true,
                /**
                 * 设置下拉风格
                 * @type {String}
                 */
                pullDownStyle: '',
                /*
                 * 刷新气泡位置
                 * @type {String}
                 * */
                bubbleY: 0,
                /*
                 * 下拉底部距离
                 * @type {String}
                 * */
                pullDownInitTop: -50
            }
        },
        mounted () {
            setTimeout (() => {
                // 初始化滚动组件
                this.initScroll ();
            }, 20);
        },
        methods: {
            // 初始化滚动组件
            initScroll () {
                // 判断有没有渲染完成
                if (!this.$refs.wrapper) {
                    return;
                }

                // 设置滚动高度
                if (this.$refs.listWrapper && (this.pullDownRefresh || this.pullUpLoad)) {
                    this.$refs.listWrapper.style.minHeight = `${getRect (this.$refs.wrapper).height + 1}px`;
                }

                // 设置滚动
                let options = {
                    // 滚动的状态
                    probeType: this.probeType,
                    // 是否开启点击事件
                    click: this.click,
                    // 是否开启Y轴滚动
                    scrollY: this.freeScroll || this.direction === DIRECTION_V,
                    // 是否开启X轴滚动
                    scrollX: this.freeScroll || this.direction === DIRECTION_H,
                    // 是否显示滚动条
                    scrollbar: this.scrollbar,
                    // 是否开启下拉刷新功能
                    pullDownRefresh: this.pullDownRefresh,
                    // 是否开启上拉刷新功能
                    pullUpLoad: this.pullUpLoad,
                    // 纵轴方向初始化位置
                    startY: this.startY,
                    // 是否开启支持横向和纵向同时滚动
                    freeScroll: this.freeScroll,
                    // 是否开启 PC 端的鼠标滚轮
                    mouseWheel: this.mouseWheel,
                    // 是否开启回弹效果
                    bounce: this.bounce
                };

                this.scroll = new BScroll (this.$refs.wrapper, options);


                // 监听滚动事件派发scroll滚动事件
                if (this.listenScroll) {
                    this.scroll.on ('scroll', (pos) => {
                        this.$emit ('scroll', pos);
                    });
                }


                // 监听滚动事件开始之前派发scroll滚动事件
                if (this.listenBeforeScroll) {
                    this.scroll.on ('beforeScrollStart', () => {
                        this.$emit ('beforeScrollStart');
                    });
                }


                // 下拉刷新方法
                if (this.pullDownRefresh) {
                    this._initPullDownRefresh ();
                }

                // 上拉刷新方法
                if (this.pullUpLoad) {
                    this._initPullUpLoad ();
                }
            },
            // 禁用 better-scroll
            disable () {
                this.scroll && this.scroll.disable ();
            },
            // 启用 better-scroll, 默认 开启。
            enable () {
                this.scroll && this.scroll.enable ();
            },
            // 刷新 better-scroll
            refresh () {
                this.scroll && this.scroll.refresh ();
            },
            // 滚动到指定位置
            scrollTo () {
                this.scroll && this.scroll.scrollTo.apply (this.scroll, arguments);
            },
            // 滚动到指定的目标元素
            scrollToElement () {
                this.scroll && this.scroll.scrollToElement.apply (this.scroll, arguments);
            },
            // 发送点击事件
            clickItem (e, item) {
                this.$emit ('click', item);
            },
            // 销毁 better-scroll，解绑事件。
            destroy () {
                this.scroll.destroy ();
            },
            // 初始化下拉刷新
            _initPullDownRefresh () {
                this.scroll.on ('pullingDown', () => {
                    // 是否开启下拉刷新之前进行某些操作
                    this.beforePullDown = false;
                    // 设置正在拉下
                    this.isPullingDown = true;
                    // 发送下拉刷新事件
                    this.$emit ('pullingDown');
                });

                this.scroll.on ('scroll', (pos) => {
                    // 是否开启了下拉刷新功能
                    if (!this.pullDownRefresh) {
                        return;
                    }

                    // 是否开启下拉刷新之前进行某些操作
                    if (this.beforePullDown) {
                        // 刷新气泡位置
                        this.bubbleY = Math.max (0, pos.y + this.pullDownInitTop);
                        // 设置下拉风格
                        this.pullDownStyle = `top:${Math.min (pos.y + this.pullDownInitTop, 10)}px`;
                    }
                    else {
                        // 刷新气泡位置
                        this.bubbleY = 0
                    }


                    // 判断回弹是否结束
                    if (this.isRebounding) {
                        // 设置下拉风格
                        this.pullDownStyle = `top:${10 - (this.pullDownRefresh.stop - pos.y)}px`;
                    }

                });

            },
            // 初始化上拉刷新
            _initPullUpLoad () {
                this.scroll.on ('pullingUp', () => {
                    // 设置正在上拉加载
                    this.isPullUpLoad = true;

                    // 发送上拉刷新事件
                    this.$emit ('pullingUp');
                })
            },
            // 刷新滚动组件重新计算滚动
            forceUpdate (dirty) {
                // 是否开启下拉刷新滚动组件
                if (this.pullDownRefresh && this.isPullingDown) {
                    // 设置没有正在拉下
                    this.isPullingDown = false;

                    // 反弹拉下来
                    this._reboundPullDown ().then (() => {
                        // 拉下后
                        this._afterPullDown ();
                    });
                }
                // 是否开启上拉刷新滚动组件
                else if (this.pullUpLoad && this.isPullUpLoad) {
                    // 设置没有正在上拉加载
                    this.isPullUpLoad = false;
                    // 当上拉加载数据加载完毕后，需要调用此方法告诉 better-scroll 数据已加载
                    this.scroll.finishPullUp ();
                    // 是否开启上拉显示文字
                    this.pullUpDirty = dirty;

                    // 刷新组件
                    this.refresh ();
                }
                else {
                    // 刷新组件
                    this.refresh ();
                }
            },
            // 反弹拉下来方法
            _reboundPullDown () {
                const {stopTime = 600} = this.pullDownRefresh;

                return new Promise ((resolve) => {
                    setTimeout (() => {
                        // 设置回弹结束
                        this.isRebounding = true;
                        // 当下拉刷新数据加载完毕后，需要调用此方法告诉 better-scroll 数据已加载。
                        this.scroll.finishPullDown ();
                        resolve ();
                    }, stopTime);
                });
            },
            // 拉下后
            _afterPullDown () {
                setTimeout (() => {
                    // 设置下拉风格
                    this.pullDownStyle = `top:${this.pullDownInitTop}px`;
                    // 是否开启下拉刷新之前进行某些操作
                    this.beforePullDown = true;
                    // 设置回弹结束
                    this.isRebounding = false;
                    // 刷新组件
                    this.refresh ();
                }, this.scroll.options.bounceTime);
            }
        },
        watch: {
            // 监听数据的变化
            data (data) {
                console.log (data);

                setTimeout (() => {
                    // 数据发生变化时刷新滚动重新计算滚动
                    this.forceUpdate (true)
                }, this.refreshDelay)
            }
        },
    }
</script>

<style lang="stylus" scoped>
    .list-wrapper {
        position: relative;
        overflow: hidden;
        height: 100%
    }
</style>
