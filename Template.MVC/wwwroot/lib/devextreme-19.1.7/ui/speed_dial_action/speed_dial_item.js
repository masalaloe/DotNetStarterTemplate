/**
 * DevExtreme (ui/speed_dial_action/speed_dial_item.js)
 * Version: 19.1.7
 * Build date: Fri Oct 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _renderer = require("../../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _extend = require("../../core/utils/extend");
var _events_engine = require("../../events/core/events_engine");
var _events_engine2 = _interopRequireDefault(_events_engine);
var _utils = require("../../events/utils");
var _click = require("../../events/click");
var _click2 = _interopRequireDefault(_click);
var _icon = require("../../core/utils/icon");
var _overlay = require("../overlay");
var _overlay2 = _interopRequireDefault(_overlay);
var _utils2 = require("../widget/utils.ink_ripple");
var _utils3 = _interopRequireDefault(_utils2);
var _themes = require("../themes");
var _themes2 = _interopRequireDefault(_themes);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var FAB_CLASS = "dx-fa-button";
var FAB_ICON_CLASS = "dx-fa-button-icon";
var OVERLAY_CONTENT_SELECTOR = ".dx-overlay-content";
var SpeedDialItem = _overlay2.default.inherit({
    _getDefaultOptions: function() {
        return (0, _extend.extend)(this.callBase(), {
            shading: false,
            useInkRipple: false,
            callOverlayRenderShading: false
        })
    },
    _defaultOptionsRules: function() {
        return this.callBase().concat([{
            device: function() {
                return _themes2.default.isMaterial()
            },
            options: {
                useInkRipple: true
            }
        }])
    },
    _render: function() {
        this.$element().addClass(FAB_CLASS);
        this.callBase();
        this._renderIcon();
        this.option("useInkRipple") && this._renderInkRipple();
        this._renderClick()
    },
    _renderButtonIcon: function($element, icon, iconClass) {
        !!$element && $element.remove();
        $element = (0, _renderer2.default)("<div>").addClass(iconClass);
        var $iconElement = (0, _icon.getImageContainer)(icon);
        $element.append($iconElement).appendTo(this.$content());
        return $element
    },
    _renderIcon: function() {
        this._$icon = this._renderButtonIcon(this._$icon, this._options.icon, FAB_ICON_CLASS)
    },
    _renderShading: function() {
        if (this._options.callOverlayRenderShading) {
            this.callBase()
        }
    },
    _fixWrapperPosition: function() {
        var $wrapper = this._$wrapper;
        var $container = this._getContainer();
        $wrapper.css("position", this._isWindow($container) ? "fixed" : "absolute")
    },
    _setClickAction: function() {
        var _this = this;
        var eventName = (0, _utils.addNamespace)(_click2.default.name, this.NAME);
        var overlayContent = this.$element().find(OVERLAY_CONTENT_SELECTOR);
        _events_engine2.default.off(overlayContent, eventName);
        _events_engine2.default.on(overlayContent, eventName, function(e) {
            _this._clickAction({
                event: e,
                element: _this.$element()
            })
        })
    },
    _defaultActionArgs: function() {
        return {
            component: this.option("actionComponent")
        }
    },
    _renderClick: function() {
        this._clickAction = this._createActionByOption("onClick");
        this._setClickAction()
    },
    _renderInkRipple: function() {
        this._inkRipple = _utils3.default.render()
    },
    _toggleActiveState: function($element, value, e) {
        this.callBase.apply(this, arguments);
        if (!this._inkRipple) {
            return
        }
        var config = {
            element: this.$content(),
            event: e
        };
        if (value) {
            this._inkRipple.showWave(config)
        } else {
            this._inkRipple.hideWave(config)
        }
    },
    _optionChanged: function(args) {
        switch (args.name) {
            case "icon":
                this._renderIcon();
                break;
            case "onClick":
                this._renderClick();
                break;
            case "useInkRipple":
                this._render();
                break;
            default:
                this.callBase(args)
        }
    }
});
module.exports = SpeedDialItem;
