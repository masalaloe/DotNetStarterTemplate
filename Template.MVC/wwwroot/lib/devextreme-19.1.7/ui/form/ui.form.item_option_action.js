/**
 * DevExtreme (ui/form/ui.form.item_option_action.js)
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

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function")
    }
}
var ItemOptionAction = function() {
    function ItemOptionAction(options) {
        _classCallCheck(this, ItemOptionAction);
        var item = options.item,
            itemsRunTimeInfo = options.itemsRunTimeInfo,
            value = options.value;
        this.item = item;
        this.itemsRunTimeInfo = itemsRunTimeInfo;
        this.value = value
    }
    _createClass(ItemOptionAction, [{
        key: "getInstance",
        value: function() {
            return this.itemsRunTimeInfo.findWidgetInstanceByItem(this.item)
        }
    }, {
        key: "getItemContainer",
        value: function() {
            return this.itemsRunTimeInfo.findItemContainerByItem(this.item)
        }
    }, {
        key: "tryExecute",
        value: function() {
            return true
        }
    }]);
    return ItemOptionAction
}();
exports.default = ItemOptionAction;
