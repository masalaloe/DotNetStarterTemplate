/**
 * DevExtreme (ui/diagram/ui.diagram.items.js)
 * Version: 19.1.7
 * Build date: Fri Oct 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
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
var _component = require("../../core/component");
var _component2 = _interopRequireDefault(_component);
var _data_helper = require("../../data_helper");
var _data_helper2 = _interopRequireDefault(_data_helper);

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
var ItemsOption = function(_Component) {
    _inherits(ItemsOption, _Component);

    function ItemsOption(diagramWidget) {
        _classCallCheck(this, ItemsOption);
        var _this = _possibleConstructorReturn(this, (ItemsOption.__proto__ || Object.getPrototypeOf(ItemsOption)).call(this));
        _this._diagramWidget = diagramWidget;
        return _this
    }
    _createClass(ItemsOption, [{
        key: "insert",
        value: function(data, callback) {
            this._dataSource.store().insert(data).done(function(data) {
                if (callback) {
                    callback(data)
                }
            })
        }
    }, {
        key: "update",
        value: function(key, data, callback) {
            this._dataSource.store().update(key, data).done(function(data, key) {
                if (callback) {
                    callback(key, data)
                }
            })
        }
    }, {
        key: "remove",
        value: function(key, callback) {
            this._dataSource.store().remove(key).done(function(key) {
                if (callback) {
                    callback(key)
                }
            })
        }
    }]);
    return ItemsOption
}(_component2.default);
ItemsOption.include(_data_helper2.default);
module.exports = ItemsOption;
