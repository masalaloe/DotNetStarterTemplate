/**
 * DevExtreme (ui/speed_dial_action/speed_dial_action.js)
 * Version: 19.1.7
 * Build date: Fri Oct 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _component_registrator = require("../../core/component_registrator");
var _component_registrator2 = _interopRequireDefault(_component_registrator);
var _extend = require("../../core/utils/extend");
var _guid = require("../../core/guid");
var _guid2 = _interopRequireDefault(_guid);
var _ready_callbacks = require("../../core/utils/ready_callbacks");
var _ready_callbacks2 = _interopRequireDefault(_ready_callbacks);
var _ui = require("../widget/ui.widget");
var _ui2 = _interopRequireDefault(_ui);
var _speed_dial_main_item = require("./speed_dial_main_item");
var _swatch_container = require("../widget/swatch_container");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var ready = _ready_callbacks2.default.add;
var SpeedDialAction = _ui2.default.inherit({
    _getDefaultOptions: function() {
        return (0, _extend.extend)(this.callBase(), {
            icon: "",
            onClick: null,
            visible: false,
            activeStateEnabled: true,
            hoverStateEnabled: true,
            animation: {
                show: {
                    type: "pop",
                    duration: 200,
                    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
                    from: {
                        scale: 0,
                        opacity: 0
                    },
                    to: {
                        scale: 1,
                        opacity: 1
                    }
                },
                hide: {
                    type: "pop",
                    duration: 200,
                    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
                    from: {
                        scale: 1,
                        opacity: 1
                    },
                    to: {
                        scale: 0,
                        opacity: 0
                    }
                }
            },
            id: new _guid2.default
        })
    },
    _optionChanged: function(args) {
        switch (args.name) {
            case "onClick":
            case "icon":
                (0, _speed_dial_main_item.initAction)(this);
                break;
            case "animation":
            case "id":
                break;
            default:
                this.callBase(args)
        }
    },
    _render: function() {
        var _this = this;
        if (!(0, _swatch_container.getSwatchContainer)(this.$element())) {
            ready(function() {
                return (0, _speed_dial_main_item.initAction)(_this)
            })
        } else {
            (0, _speed_dial_main_item.initAction)(this)
        }
    },
    _dispose: function() {
        (0, _speed_dial_main_item.disposeAction)(this._options.id);
        this.callBase()
    }
});
(0, _component_registrator2.default)("dxSpeedDialAction", SpeedDialAction);
module.exports = SpeedDialAction;
