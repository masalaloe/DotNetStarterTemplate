/**
 * DevExtreme (ui/form/ui.form.item_options_actions.js)
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
var _get = function get(object, property, receiver) {
    if (null === object) {
        object = Function.prototype
    }
    var desc = Object.getOwnPropertyDescriptor(object, property);
    if (void 0 === desc) {
        var parent = Object.getPrototypeOf(object);
        if (null === parent) {
            return
        } else {
            return get(parent, property, receiver)
        }
    } else {
        if ("value" in desc) {
            return desc.value
        } else {
            var getter = desc.get;
            if (void 0 === getter) {
                return
            }
            return getter.call(receiver)
        }
    }
};
var _uiForm = require("./ui.form.item_option_action");
var _uiForm2 = _interopRequireDefault(_uiForm);
var _element_data = require("../../core/element_data");

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
var WidgetOptionItemOptionAction = function(_ItemOptionAction) {
    _inherits(WidgetOptionItemOptionAction, _ItemOptionAction);

    function WidgetOptionItemOptionAction() {
        _classCallCheck(this, WidgetOptionItemOptionAction);
        return _possibleConstructorReturn(this, (WidgetOptionItemOptionAction.__proto__ || Object.getPrototypeOf(WidgetOptionItemOptionAction)).apply(this, arguments))
    }
    _createClass(WidgetOptionItemOptionAction, [{
        key: "tryExecute",
        value: function() {
            var instance = this.getInstance();
            instance.option(this.value);
            return _get(WidgetOptionItemOptionAction.prototype.__proto__ || Object.getPrototypeOf(WidgetOptionItemOptionAction.prototype), "tryExecute", this).call(this)
        }
    }]);
    return WidgetOptionItemOptionAction
}(_uiForm2.default);
var ValidationRulesItemOptionAction = function(_ItemOptionAction2) {
    _inherits(ValidationRulesItemOptionAction, _ItemOptionAction2);

    function ValidationRulesItemOptionAction() {
        _classCallCheck(this, ValidationRulesItemOptionAction);
        return _possibleConstructorReturn(this, (ValidationRulesItemOptionAction.__proto__ || Object.getPrototypeOf(ValidationRulesItemOptionAction)).apply(this, arguments))
    }
    _createClass(ValidationRulesItemOptionAction, [{
        key: "tryExecute",
        value: function() {
            var instance = this.getInstance();
            var validator = (0, _element_data.data)(instance.$element()[0], "dxValidator");
            if (validator) {
                var filterRequired = function(item) {
                    return "required" === item.type
                };
                var oldContainsRequired = (validator.option("validationRules") || []).some(filterRequired);
                var newContainsRequired = (this.item.validationRules || []).some(filterRequired);
                if (!oldContainsRequired && !newContainsRequired || oldContainsRequired && newContainsRequired) {
                    validator.option("validationRules", this.item.validationRules);
                    return _get(ValidationRulesItemOptionAction.prototype.__proto__ || Object.getPrototypeOf(ValidationRulesItemOptionAction.prototype), "tryExecute", this).call(this)
                }
            }
            return false
        }
    }]);
    return ValidationRulesItemOptionAction
}(_uiForm2.default);
var CssClassItemOptionAction = function(_ItemOptionAction3) {
    _inherits(CssClassItemOptionAction, _ItemOptionAction3);

    function CssClassItemOptionAction(options) {
        _classCallCheck(this, CssClassItemOptionAction);
        var _this3 = _possibleConstructorReturn(this, (CssClassItemOptionAction.__proto__ || Object.getPrototypeOf(CssClassItemOptionAction)).call(this, options));
        _this3.previousValue = options.previousValue;
        return _this3
    }
    _createClass(CssClassItemOptionAction, [{
        key: "tryExecute",
        value: function() {
            var $itemContainer = this.getItemContainer();
            $itemContainer.removeClass(this.previousValue).addClass(this.value);
            return _get(CssClassItemOptionAction.prototype.__proto__ || Object.getPrototypeOf(CssClassItemOptionAction.prototype), "tryExecute", this).call(this)
        }
    }]);
    return CssClassItemOptionAction
}(_uiForm2.default);
var tryCreateItemOptionAction = function(optionName, itemActionOptions) {
    switch (optionName) {
        case "editorOptions":
        case "buttonOptions":
            return new WidgetOptionItemOptionAction(itemActionOptions);
        case "validationRules":
            return new ValidationRulesItemOptionAction(itemActionOptions);
        case "cssClass":
            return new CssClassItemOptionAction(itemActionOptions);
        default:
            return null
    }
};
exports.default = tryCreateItemOptionAction;
