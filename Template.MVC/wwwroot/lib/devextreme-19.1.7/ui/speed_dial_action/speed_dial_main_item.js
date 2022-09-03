/**
 * DevExtreme (ui/speed_dial_action/speed_dial_main_item.js)
 * Version: 19.1.7
 * Build date: Fri Oct 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _renderer = require("../../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _config = require("../../core/config");
var _config2 = _interopRequireDefault(_config);
var _extend = require("../../core/utils/extend");
var _common = require("../../core/utils/common");
var _events_engine = require("../../events/core/events_engine");
var _events_engine2 = _interopRequireDefault(_events_engine);
var _ui = require("../widget/ui.errors");
var _ui2 = _interopRequireDefault(_ui);
var _swatch_container = require("../widget/swatch_container");
var _speed_dial_item = require("./speed_dial_item");
var _speed_dial_item2 = _interopRequireDefault(_speed_dial_item);
var _themes = require("../themes");
var _themes2 = _interopRequireDefault(_themes);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var FAB_MAIN_CLASS = "dx-fa-button-main";
var FAB_CLOSE_ICON_CLASS = "dx-fa-button-icon-close";
var INVISIBLE_STATE_CLASS = "dx-state-invisible";
var speedDialMainItem = null;
var SpeedDialMainItem = _speed_dial_item2.default.inherit({
    _actionItems: [],
    _getDefaultOptions: function() {
        var defaultOptions = {
            icon: "add",
            closeIcon: "close",
            position: {
                at: "right bottom",
                my: "right bottom",
                offset: {
                    x: -16,
                    y: -16
                }
            },
            maxSpeedDialActionCount: 5,
            hint: "",
            actions: [],
            visible: true,
            activeStateEnabled: true,
            hoverStateEnabled: true,
            indent: 56,
            childIndent: 40,
            callOverlayRenderShading: true
        };
        return (0, _extend.extend)(this.callBase(), (0, _extend.extend)(defaultOptions, (0, _config2.default)().floatingActionButtonConfig))
    },
    _defaultOptionsRules: function() {
        return this.callBase().concat([{
            device: function() {
                return _themes2.default.isMaterial()
            },
            options: {
                indent: 72,
                childIndent: 56
            }
        }])
    },
    _render: function() {
        this.$element().addClass(FAB_MAIN_CLASS);
        this.callBase();
        this._moveToContainer();
        this._renderCloseIcon();
        this._renderClick()
    },
    _renderCloseIcon: function() {
        this._$closeIcon = this._renderButtonIcon(this._$closeIcon, this._options.closeIcon, FAB_CLOSE_ICON_CLASS);
        this._$closeIcon.addClass(INVISIBLE_STATE_CLASS)
    },
    _renderClick: function() {
        this._clickAction = 1 === this.option("actions").length ? this._createActionByOption("onClick") : this._createAction(this._clickHandler);
        this._setClickAction()
    },
    _defaultActionArgs: function() {
        var actions = this.option("actions");
        return {
            component: 1 === actions.length ? actions[0] : this
        }
    },
    _clickHandler: function() {
        var _this = this;
        var actions = this._actionItems;
        actions.forEach(function(action) {
            action.toggle();
            if (action.option("visible")) {
                action._$wrapper.css("position", _this._$wrapper.css("position"))
            }
        });
        this._$icon.toggleClass(INVISIBLE_STATE_CLASS);
        this._$closeIcon.toggleClass(INVISIBLE_STATE_CLASS)
    },
    _renderActions: function() {
        var _this2 = this;
        var actions = this.option("actions");
        var lastActionIndex = actions.length - 1;
        var minActionButtonCount = 1;
        if (this._actionItems.length) {
            this._actionItems.forEach(function(actionItem) {
                actionItem.dispose();
                actionItem.$element().remove()
            })
        }
        if (actions.length === minActionButtonCount) {
            return
        }
        for (var i = 0; i < actions.length; i++) {
            var action = actions[i];
            var $actionElement = (0, _renderer2.default)("<div>").appendTo((0, _swatch_container.getSwatchContainer)(action.$element()));
            _events_engine2.default.off($actionElement, "click");
            _events_engine2.default.on($actionElement, "click", function() {
                _this2._clickHandler()
            });
            var actionOffsetY = this.initialOption("indent") + this.initialOption("childIndent") * i;
            var actionAnimationDelay = 30;
            action._options.position = {
                of: this.$content(),
                at: "center",
                my: "center",
                offset: {
                    x: 0,
                    y: -actionOffsetY
                }
            };
            action._options.animation.show.delay = actionAnimationDelay * i;
            action._options.animation.hide.delay = actionAnimationDelay * (lastActionIndex - i);
            action._options.actionComponent = action;
            this._actionItems.push(this._createComponent($actionElement, _speed_dial_item2.default, action._options))
        }
    },
    _setPosition: function() {
        this._hide();
        this._show()
    },
    _optionChanged: function(args) {
        switch (args.name) {
            case "actions":
                this._renderIcon();
                this._renderCloseIcon();
                this._renderClick();
                this._renderActions();
                break;
            case "maxSpeedDialActionCount":
                this._renderActions();
                break;
            case "closeIcon":
                this._renderCloseIcon();
                break;
            case "position":
                if (!(0, _common.equalByValue)(args.value, args.previousValue)) {
                    this._setPosition()
                }
                break;
            default:
                this.callBase(args)
        }
    }
});
exports.initAction = function(newAction) {
    delete newAction._options.onInitializing;
    var isActionExist = false;
    if (!speedDialMainItem) {
        var $fabMainElement = (0, _renderer2.default)("<div>").appendTo((0, _swatch_container.getSwatchContainer)(newAction.$element()));
        speedDialMainItem = newAction._createComponent($fabMainElement, SpeedDialMainItem, (0, _extend.extend)({}, newAction._options, {
            actions: [newAction],
            visible: true
        }))
    } else {
        var savedActions = speedDialMainItem.option("actions");
        savedActions.forEach(function(action) {
            if (action._options.id === newAction._options.id) {
                isActionExist = true;
                return newAction
            }
        });
        if (!isActionExist) {
            if (savedActions.length >= speedDialMainItem.option("maxSpeedDialActionCount")) {
                newAction.dispose();
                _ui2.default.log("W1014");
                return
            }
            savedActions.push(newAction);
            speedDialMainItem.option((0, _extend.extend)(speedDialMainItem._getDefaultOptions(), {
                actions: savedActions
            }))
        } else {
            if (1 === savedActions.length) {
                speedDialMainItem.option((0, _extend.extend)({}, newAction._options, {
                    actions: savedActions,
                    visible: true,
                    position: speedDialMainItem._getDefaultOptions().position
                }))
            } else {
                speedDialMainItem.option({
                    actions: savedActions,
                    position: speedDialMainItem._getDefaultOptions().position
                })
            }
        }
    }
};
exports.disposeAction = function(actionId) {
    if (!speedDialMainItem) {
        return
    }
    var savedActions = speedDialMainItem.option("actions");
    var savedActionsCount = savedActions.length;
    savedActions = savedActions.filter(function(action) {
        return action._options.id !== actionId
    });
    if (savedActionsCount === savedActions.length) {
        return
    }
    if (!savedActions.length) {
        speedDialMainItem.dispose();
        speedDialMainItem.$element().remove();
        speedDialMainItem = null
    } else {
        if (1 === savedActions.length) {
            speedDialMainItem.option((0, _extend.extend)({}, savedActions[0]._options, {
                actions: savedActions,
                visible: true,
                position: speedDialMainItem._getDefaultOptions().position
            }))
        } else {
            speedDialMainItem.option({
                actions: savedActions
            })
        }
    }
};
exports.repaint = function() {
    if (!speedDialMainItem) {
        return
    }
    var icon = 1 === speedDialMainItem.option("actions").length ? speedDialMainItem.option("actions")[0].option("icon") : speedDialMainItem._getDefaultOptions().icon;
    speedDialMainItem.option({
        actions: speedDialMainItem.option("actions"),
        icon: icon,
        closeIcon: speedDialMainItem._getDefaultOptions().closeIcon,
        position: speedDialMainItem._getDefaultOptions().position,
        maxSpeedDialActionCount: speedDialMainItem._getDefaultOptions().maxSpeedDialActionCount
    })
};
