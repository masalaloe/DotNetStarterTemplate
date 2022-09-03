/**
 * DevExtreme (ui/form/ui.form.items_runtime_info.js)
 * Version: 19.1.7
 * Build date: Fri Oct 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
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
var _guid = require("../../core/guid");
var _guid2 = _interopRequireDefault(_guid);
var _iterator = require("../../core/utils/iterator");

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
var FormItemsRunTimeInfo = function() {
    function FormItemsRunTimeInfo() {
        _classCallCheck(this, FormItemsRunTimeInfo);
        this._map = {}
    }
    _createClass(FormItemsRunTimeInfo, [{
        key: "_findWidgetInstance",
        value: function(condition) {
            var result;
            (0, _iterator.each)(this._map, function(guid, _ref) {
                var widgetInstance = _ref.widgetInstance,
                    item = _ref.item;
                if (condition(item)) {
                    result = widgetInstance;
                    return false
                }
            });
            return result
        }
    }, {
        key: "clear",
        value: function() {
            this._map = {}
        }
    }, {
        key: "add",
        value: function(item, widgetInstance, guid, $itemContainer) {
            guid = guid || new _guid2.default;
            this._map[guid] = {
                item: item,
                widgetInstance: widgetInstance,
                $itemContainer: $itemContainer
            };
            return guid
        }
    }, {
        key: "addItemsOrExtendFrom",
        value: function(itemsRunTimeInfo) {
            var _this = this;
            itemsRunTimeInfo.each(function(key, itemRunTimeInfo) {
                if (_this._map[key]) {
                    _this._map[key].widgetInstance = itemRunTimeInfo.widgetInstance;
                    _this._map[key].$itemContainer = itemRunTimeInfo.$itemContainer
                } else {
                    _this.add(itemRunTimeInfo.item, itemRunTimeInfo.widgetInstance, key, itemRunTimeInfo.$itemContainer)
                }
            })
        }
    }, {
        key: "findWidgetInstanceByItem",
        value: function(item) {
            return this._findWidgetInstance(function(storedItem) {
                return storedItem === item
            })
        }
    }, {
        key: "findWidgetInstanceByName",
        value: function(name) {
            return this._findWidgetInstance(function(item) {
                return name === item.name
            })
        }
    }, {
        key: "findWidgetInstanceByDataField",
        value: function(dataField) {
            return this._findWidgetInstance(function(item) {
                return dataField === item.dataField
            })
        }
    }, {
        key: "findItemContainerByItem",
        value: function(item) {
            for (var key in this._map) {
                if (this._map[key].item === item) {
                    return this._map[key].$itemContainer
                }
            }
            return null
        }
    }, {
        key: "each",
        value: function(handler) {
            (0, _iterator.each)(this._map, function(key, itemRunTimeInfo) {
                handler(key, itemRunTimeInfo)
            })
        }
    }]);
    return FormItemsRunTimeInfo
}();
exports.default = FormItemsRunTimeInfo;
