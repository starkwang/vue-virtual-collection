(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("vue"));
	else if(typeof define === 'function' && define.amd)
		define(["vue"], factory);
	else if(typeof exports === 'object')
		exports["vue-virtual-collection"] = factory(require("vue"));
	else
		root["vue-virtual-collection"] = factory(root["vue"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(11)

var Component = __webpack_require__(9)(
  /* script */
  __webpack_require__(2),
  /* template */
  __webpack_require__(10),
  /* scopeId */
  "data-v-75486378",
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _GroupManager = __webpack_require__(3);

var _GroupManager2 = _interopRequireDefault(_GroupManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

exports.default = {
    props: {
        cellSizeAndPositionGetter: {
            type: Function,
            required: true
        },
        collection: {
            type: Array,
            required: true
        },
        height: {
            type: Number,
            required: true,
            validator: function validator(value) {
                return value >= 0;
            }
        },
        width: {
            type: Number,
            required: true,
            validator: function validator(value) {
                return value >= 0;
            }
        },
        sectionSize: {
            type: Number,
            default: 300
        }
    },
    data: function data() {
        return {
            totalHeight: 0,
            totalWidth: 0,
            displayItems: []
        };
    },

    watch: {
        collection: function collection() {
            this.resetCollection();
        }
    },
    created: function created() {
        this.groupManagers = [];
        this.onCollectionChanged();
    },

    methods: {
        resetCollection: function resetCollection() {
            // Dispose previous groups and reset associated data
            this.groupManagers.forEach(function (manager) {
                return manager.dispose();
            });
            this.groupManagers = [];
            this.totalHeight = 0;
            this.totalWidth = 0;

            this.onCollectionChanged();
        },
        onCollectionChanged: function onCollectionChanged() {
            var _this = this;

            var collection = this.collection;

            // If the collection is flat, wrap it inside a single group
            if (collection.length > 0 && collection[0].group === undefined) {
                collection = [{ group: collection }];
            }

            // Create and store managers for each item group
            collection.forEach(function (groupContainer, i) {
                var groupIndex = i; // Capture group index for closure
                var unwatch = _this.$watch(function () {
                    return groupContainer;
                }, function () {
                    return _this.onGroupChanged(groupContainer.group, groupIndex);
                }, { deep: true });

                _this.groupManagers.push(new _GroupManager2.default(groupContainer.group, groupIndex, _this.sectionSize, _this.cellSizeAndPositionGetter, unwatch));
            });

            this.updateGridDimensions();
            this.flushDisplayItems();
        },
        updateGridDimensions: function updateGridDimensions() {
            this.totalHeight = Math.max.apply(Math, _toConsumableArray(this.groupManagers.map(function (it) {
                return it.totalHeight;
            })));
            this.totalWidth = Math.max.apply(Math, _toConsumableArray(this.groupManagers.map(function (it) {
                return it.totalWidth;
            })));
        },
        onGroupChanged: function onGroupChanged(group, index) {
            this.groupManagers[index].updateGroup(group);
            this.updateGridDimensions();
            this.flushDisplayItems();
        },
        getComputedStyle: function getComputedStyle(displayItem) {
            if (!displayItem) return;

            // Currently displayed items may no longer exist
            // if collection has been modified since
            var groupManager = this.groupManagers[displayItem.groupIndex];
            if (!groupManager) return;

            var cellMetadatum = groupManager.getCellMetadata(displayItem.itemIndex);
            if (!cellMetadatum) return;

            var width = cellMetadatum.width,
                height = cellMetadatum.height,
                x = cellMetadatum.x,
                y = cellMetadatum.y;

            return {
                left: x + 'px',
                top: y + 'px',
                width: width + 'px',
                height: height + 'px'
            };
        },
        onScroll: function onScroll(e) {
            this.flushDisplayItems();
        },
        onContainerResized: function onContainerResized() {
            this.resetCollection();
        },
        flushDisplayItems: function flushDisplayItems() {
            var _this2 = this;

            var scrollTop = 0;
            var scrollLeft = 0;
            if (this.$refs.outer) {
                scrollTop = this.$refs.outer.scrollTop;
                scrollLeft = this.$refs.outer.scrollLeft;
            }

            var displayItems = [];
            this.groupManagers.forEach(function (groupManager, groupIndex) {
                var indices = groupManager.getCellIndices({
                    height: _this2.height,
                    width: _this2.width,
                    x: scrollLeft,
                    y: scrollTop
                });

                indices.forEach(function (itemIndex) {
                    displayItems.push(Object.freeze(_extends({
                        groupIndex: groupIndex,
                        itemIndex: itemIndex,
                        key: itemIndex
                    }, groupManager.getItem(itemIndex))));
                });
            });

            if (window.requestAnimationFrame) {
                window.requestAnimationFrame(function () {
                    _this2.displayItems = displayItems;
                    _this2.$emit('flush-display-item', displayItems);
                });
            } else {
                this.displayItems = displayItems;
                this.$emit('flush-display-item', displayItems);
            }
        }
    },
    mounted: function mounted() {
        if (ResizeObserver) {
            this.resizeObserver = new ResizeObserver(this.onContainerResized);
            this.resizeObserver.observe(this.$refs.outer);
        } else {
            this.$refs.outer.addEventListener('resize', this.onContainerResized);
        }
    },
    beforeDestroy: function beforeDestroy() {
        if (ResizeObserver) {
            this.resizeObserver.disconnect();
        } else {
            this.$refs.outer.removeEventListener('resize', this.onContainerResized);
        }
    },

    computed: {
        containerStyle: function containerStyle() {
            return {
                height: this.totalHeight + "px",
                width: this.totalWidth + "px"
            };
        },
        outerStyle: function outerStyle() {
            return {
                height: this.height + "px",
                width: this.width + "px"
            };
        }
    }
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SectionManager = __webpack_require__(5);

var _SectionManager2 = _interopRequireDefault(_SectionManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** Represents a group of logically-related items */
var GroupManager = function () {
    function GroupManager(group, groupId, sectionSize, cellSizeAndPositionGetter, unwatch) {
        _classCallCheck(this, GroupManager);

        this._groupId = groupId;
        this._sectionSize = sectionSize;
        this._cellSizeAndPositionGetter = cellSizeAndPositionGetter;
        this._unwatch = unwatch;
        this.totalHeight = 0;
        this.totalWidth = 0;
        this.updateGroup(group);
    }

    _createClass(GroupManager, [{
        key: "updateGroup",
        value: function updateGroup(group) {
            var _this = this;

            var sectionManager = new _SectionManager2.default(this._sectionSize);
            var totalHeight = 0;
            var totalWidth = 0;

            group.forEach(function (item, index) {
                var cellMetadatum = _this._cellSizeAndPositionGetter(item, index, _this._groupId);
                sectionManager.registerCell({
                    index: index,
                    cellMetadatum: cellMetadatum
                });

                // compute total height and total width
                var x = cellMetadatum.x,
                    y = cellMetadatum.y,
                    width = cellMetadatum.width,
                    height = cellMetadatum.height;

                var bottom = y + height;
                var right = x + width;
                if (bottom > totalHeight) {
                    totalHeight = bottom;
                }
                if (right > totalWidth) {
                    totalWidth = right;
                }
            });

            sectionManager.freezeCells();

            this._group = group;
            this._sectionManager = sectionManager;
            this.totalHeight = totalHeight;
            this.totalWidth = totalWidth;
        }
    }, {
        key: "getCellIndices",
        value: function getCellIndices(region) {
            return this._sectionManager.getCellIndices(region);
        }
    }, {
        key: "getCellMetadata",
        value: function getCellMetadata(index) {
            return this._sectionManager.getCellMetadata(index);
        }
    }, {
        key: "getItem",
        value: function getItem(index) {
            return this._group[index];
        }
    }, {
        key: "dispose",
        value: function dispose() {
            this._unwatch();
        }
    }]);

    return GroupManager;
}();

exports.default = GroupManager;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * A section of the Window.
 * Window Sections are used to group nearby cells.
 * This enables us to more quickly determine which cells to display in a given region of the Window.
 * Sections have a fixed size and contain 0 to many cells (tracked by their indices).
 */
var Section = function () {
    function Section(_ref) {
        var height = _ref.height,
            width = _ref.width,
            x = _ref.x,
            y = _ref.y;

        _classCallCheck(this, Section);

        this.height = height;
        this.width = width;
        this.x = x;
        this.y = y;

        this._indexMap = {};
        this._indices = [];
    }

    /** Add a cell to this section. */


    _createClass(Section, [{
        key: "addCellIndex",
        value: function addCellIndex(_ref2) {
            var index = _ref2.index;

            if (!this._indexMap[index]) {
                this._indexMap[index] = true;
                this._indices.push(index);
            }
        }

        /** Get all cell indices that have been added to this section. */

    }, {
        key: "getCellIndices",
        value: function getCellIndices() {
            return this._indices;
        }

        /** Intended for debugger/test purposes only */

    }, {
        key: "toString",
        value: function toString() {
            return this.x + "," + this.y + " " + this.width + "x" + this.height;
        }
    }]);

    return Section;
}();

exports.default = Section;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Section = __webpack_require__(4);

var _Section2 = _interopRequireDefault(_Section);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SECTION_SIZE = 600;

var SectionManager = function () {
    function SectionManager() {
        var sectionSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : SECTION_SIZE;

        _classCallCheck(this, SectionManager);

        this._sectionSize = sectionSize;

        this._cellMetadata = [];
        this._sections = {};
    }

    _createClass(SectionManager, [{
        key: "registerCell",
        value: function registerCell(_ref) {
            var cellMetadatum = _ref.cellMetadatum,
                index = _ref.index;

            var frozenCellMetadatum = Object.freeze(cellMetadatum);
            this._cellMetadata[index] = frozenCellMetadatum;

            this.getSections(frozenCellMetadatum).forEach(function (section) {
                return section.addCellIndex({ index: index });
            });
        }
    }, {
        key: "freezeCells",
        value: function freezeCells() {
            Object.freeze(this._cellMetadata);
        }

        /** Get all Sections overlapping the specified region. */

    }, {
        key: "getSections",
        value: function getSections(_ref2) {
            var height = _ref2.height,
                width = _ref2.width,
                x = _ref2.x,
                y = _ref2.y;

            var sectionXStart = Math.floor(x / this._sectionSize);
            var sectionXStop = Math.floor((x + width - 1) / this._sectionSize);
            var sectionYStart = Math.floor(y / this._sectionSize);
            var sectionYStop = Math.floor((y + height - 1) / this._sectionSize);

            var sections = [];

            for (var sectionX = sectionXStart; sectionX <= sectionXStop; sectionX++) {
                for (var sectionY = sectionYStart; sectionY <= sectionYStop; sectionY++) {
                    var key = sectionX + "." + sectionY;

                    if (!this._sections[key]) {
                        this._sections[key] = new _Section2.default({
                            height: this._sectionSize,
                            width: this._sectionSize,
                            x: sectionX * this._sectionSize,
                            y: sectionY * this._sectionSize
                        });
                    }

                    sections.push(this._sections[key]);
                }
            }

            return sections;
        }

        /** Total number of Sections based on the currently registered cells. */

    }, {
        key: "getTotalSectionCount",
        value: function getTotalSectionCount() {
            return Object.keys(this._sections).length;
        }

        /**
         * Gets all cell indices contained in the specified region.
         * A region may encompass 1 or more Sections.
         */

    }, {
        key: "getCellIndices",
        value: function getCellIndices(_ref3) {
            var height = _ref3.height,
                width = _ref3.width,
                x = _ref3.x,
                y = _ref3.y;

            var indices = {};

            this.getSections({ height: height, width: width, x: x, y: y }).forEach(function (section) {
                return section.getCellIndices().forEach(function (index) {
                    indices[index] = index;
                });
            });

            // Object keys are strings; this function returns numbers
            return Object.keys(indices).map(function (index) {
                return indices[index];
            });
        }
    }, {
        key: "getCellMetadata",
        value: function getCellMetadata(index) {
            return this._cellMetadata[index];
        }
    }]);

    return SectionManager;
}();

exports.default = SectionManager;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _vue = __webpack_require__(1);

var _vue2 = _interopRequireDefault(_vue);

var _VirtualCollection = __webpack_require__(0);

var _VirtualCollection2 = _interopRequireDefault(_VirtualCollection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var plugin = {
    install: function install(Vue, options) {
        Vue.component("VirtualCollection", _VirtualCollection2.default);
    }
};

exports.default = plugin;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(8)();
// imports


// module
exports.push([module.i, ".vue-virtual-collection[data-v-75486378]{overflow:scroll;-webkit-overflow-scrolling:touch}.vue-virtual-collection-container[data-v-75486378]{position:relative}.vue-virtual-collection .cell-container[data-v-75486378]{position:absolute;top:0}", ""]);

// exports


/***/ }),
/* 8 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

// this module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  scopeId,
  cssModules
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  // inject cssModules
  if (cssModules) {
    var computed = Object.create(options.computed || null)
    Object.keys(cssModules).forEach(function (key) {
      var module = cssModules[key]
      computed[key] = function () { return module }
    })
    options.computed = computed
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    ref: "outer",
    staticClass: "vue-virtual-collection",
    style: (_vm.outerStyle),
    on: {
      "&scroll": function($event) {
        return _vm.onScroll($event)
      }
    }
  }, [_c('div', {
    staticClass: "vue-virtual-collection-container",
    style: (_vm.containerStyle)
  }, _vm._l((_vm.displayItems), function(item) {
    return _c('div', {
      key: item.key,
      staticClass: "cell-container",
      style: (_vm.getComputedStyle(item))
    }, [_vm._t("cell", null, {
      "data": item.data
    })], 2)
  }), 0)])
},staticRenderFns: []}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(7);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(12)("4c3186bc", content, true);

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(13)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 13 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ })
/******/ ]);
});
//# sourceMappingURL=index.js.map