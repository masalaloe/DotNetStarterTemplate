/**
 * DevExtreme (ui/file_manager/file_provider/array.js)
 * Version: 19.1.7
 * Build date: Fri Oct 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _typeof = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function(obj) {
    return typeof obj
} : function(obj) {
    return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj
};
var _createClass = function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) {
                descriptor.writable = true
            }
            Object.defineProperty(target, descriptor.key, descriptor)
        }
    }
    return function(Constructor, protoProps, staticProps) {
        if (protoProps) {
            defineProperties(Constructor.prototype, protoProps)
        }
        if (staticProps) {
            defineProperties(Constructor, staticProps)
        }
        return Constructor
    }
}();
var _common = require("../../../core/utils/common");
var _data = require("../../../core/utils/data");
var _iterator = require("../../../core/utils/iterator");
var _type = require("../../../core/utils/type");
var _type2 = _interopRequireDefault(_type);
var _errors = require("../../../data/errors");
var _file_provider = require("./file_provider");
var _uiFile_manager = require("../ui.file_manager.common");
var _uiFile_manager2 = require("../ui.file_manager.utils");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function")
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    }
    return call && ("object" === typeof call || "function" === typeof call) ? call : self
}

function _inherits(subClass, superClass) {
    if ("function" !== typeof superClass && null !== superClass) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass)
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass) {
        Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass
    }
}
var ArrayFileProvider = function(_FileProvider) {
    _inherits(ArrayFileProvider, _FileProvider);

    function ArrayFileProvider(options) {
        _classCallCheck(this, ArrayFileProvider);
        options = (0, _common.ensureDefined)(options, {});
        var _this = _possibleConstructorReturn(this, (ArrayFileProvider.__proto__ || Object.getPrototypeOf(ArrayFileProvider)).call(this, options));
        var initialArray = options.data;
        if (initialArray && !Array.isArray(initialArray)) {
            throw _errors.errors.Error("E4006")
        }
        var itemsExpr = options.itemsExpr || "items";
        _this._subFileItemsGetter = (0, _data.compileGetter)(itemsExpr);
        _this._subFileItemsSetter = _type2.default.isFunction(itemsExpr) ? itemsExpr : (0, _data.compileSetter)(itemsExpr);
        var nameExpr = _this._getNameExpr(options);
        _this._nameSetter = _type2.default.isFunction(nameExpr) ? nameExpr : (0, _data.compileSetter)(nameExpr);
        var isDirExpr = _this._getIsDirExpr(options);
        _this._getIsDirSetter = _type2.default.isFunction(isDirExpr) ? isDirExpr : (0, _data.compileSetter)(isDirExpr);
        _this._data = initialArray || [];
        return _this
    }
    _createClass(ArrayFileProvider, [{
        key: "getItems",
        value: function(path, itemType) {
            return this._getItems(path, itemType)
        }
    }, {
        key: "renameItem",
        value: function(item, name) {
            item.dataItem.name = name
        }
    }, {
        key: "createFolder",
        value: function(parentFolder, name) {
            var newItem = {};
            this._nameSetter(newItem, name);
            this._getIsDirSetter(newItem, true);
            var array = this._getChildrenArray(parentFolder.dataItem);
            array.push(newItem)
        }
    }, {
        key: "deleteItems",
        value: function(items) {
            var _this2 = this;
            (0, _iterator.each)(items, function(_, item) {
                return _this2._deleteItem(item)
            })
        }
    }, {
        key: "moveItems",
        value: function(items, destinationDir) {
            var _this3 = this;
            var array = this._getChildrenArray(destinationDir.dataItem);
            (0, _iterator.each)(items, function(_, item) {
                _this3._checkAbilityToMoveOrCopyItem(item, destinationDir);
                _this3._deleteItem(item);
                array.push(item.dataItem)
            })
        }
    }, {
        key: "copyItems",
        value: function(items, destinationDir) {
            var _this4 = this;
            var array = this._getChildrenArray(destinationDir.dataItem);
            (0, _iterator.each)(items, function(_, item) {
                _this4._checkAbilityToMoveOrCopyItem(item, destinationDir);
                var copiedItem = _this4._createCopy(item.dataItem);
                array.push(copiedItem)
            })
        }
    }, {
        key: "_checkAbilityToMoveOrCopyItem",
        value: function(item, destinationDir) {
            var newItemPath = (0, _uiFile_manager2.pathCombine)(destinationDir.relativeName, item.name);
            if (0 === newItemPath.indexOf(item.relativeName)) {
                throw {
                    errorId: _uiFile_manager.ErrorCode.Other,
                    fileItem: item
                }
            }
        }
    }, {
        key: "_createCopy",
        value: function(dataObj) {
            var _this5 = this;
            var copyObj = {};
            this._nameSetter(copyObj, this._nameGetter(dataObj));
            this._getIsDirSetter(copyObj, this._isDirGetter(dataObj));
            var items = this._subFileItemsGetter(dataObj);
            if (Array.isArray(items)) {
                var itemsCopy = [];
                (0, _iterator.each)(items, function(_, childItem) {
                    var childCopy = _this5._createCopy(childItem);
                    itemsCopy.push(childCopy)
                });
                this._subFileItemsSetter(copyObj, itemsCopy)
            }
            return copyObj
        }
    }, {
        key: "_deleteItem",
        value: function(_ref) {
            var parentPath = _ref.parentPath,
                dataItem = _ref.dataItem;
            var array = this._data;
            if ("" !== parentPath) {
                var folder = this._findItem(parentPath);
                array = this._subFileItemsGetter(folder)
            }
            var index = array.indexOf(dataItem);
            array.splice(index, 1)
        }
    }, {
        key: "_getChildrenArray",
        value: function(dataItem) {
            if (!dataItem) {
                return this._data
            }
            var subItems = this._subFileItemsGetter(dataItem);
            if (!Array.isArray(subItems)) {
                subItems = [];
                this._subFileItemsSetter(dataItem, subItems)
            }
            return subItems
        }
    }, {
        key: "_getItems",
        value: function(path, itemType) {
            if ("" === path || void 0 === path) {
                return this._convertDataObjectsToFileItems(this._data, "", itemType)
            }
            var folderEntry = this._findItem(path);
            var entries = folderEntry && this._subFileItemsGetter(folderEntry) || [];
            return this._convertDataObjectsToFileItems(entries, path, itemType)
        }
    }, {
        key: "_findItem",
        value: function(path) {
            var _this6 = this;
            if ("" === path) {
                return null
            }
            var result = null;
            var data = this._data;
            var parts = path.split("/");
            var _loop = function(i) {
                var part = parts[i];
                result = data.filter(function(entry) {
                    return _this6._isDirGetter(entry) && _this6._nameGetter(entry) === part
                })[0];
                if (result) {
                    var children = _this6._subFileItemsGetter(result);
                    if (children) {
                        data = children
                    } else {
                        if (i !== parts.length - 1) {
                            return {
                                v: null
                            }
                        }
                    }
                } else {
                    return {
                        v: null
                    }
                }
            };
            for (var i = 0; i < parts.length; i++) {
                var _ret = _loop(i);
                if ("object" === ("undefined" === typeof _ret ? "undefined" : _typeof(_ret))) {
                    return _ret.v
                }
            }
            return result
        }
    }, {
        key: "_hasSubDirs",
        value: function(dataObj) {
            var subItems = (0, _common.ensureDefined)(this._subFileItemsGetter(dataObj), []);
            if (!Array.isArray(subItems)) {
                return true
            }
            for (var i = 0; i < subItems.length; i++) {
                if (true === this._isDirGetter(subItems[i])) {
                    return true
                }
            }
            return false
        }
    }]);
    return ArrayFileProvider
}(_file_provider.FileProvider);
module.exports = ArrayFileProvider;
