/**
 * DevExtreme (ui/validation_group.js)
 * Version: 19.1.7
 * Build date: Fri Oct 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _renderer = require("../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _component_registrator = require("../core/component_registrator");
var _component_registrator2 = _interopRequireDefault(_component_registrator);
var _dom_component = require("../core/dom_component");
var _dom_component2 = _interopRequireDefault(_dom_component);
var _validation_summary = require("./validation_summary");
var _validation_summary2 = _interopRequireDefault(_validation_summary);
var _validation_engine = require("./validation_engine");
var _validation_engine2 = _interopRequireDefault(_validation_engine);
var _validator = require("./validator");
var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var VALIDATION_ENGINE_CLASS = "dx-validationgroup";
var VALIDATOR_CLASS = "dx-validator";
var VALIDATION_SUMMARY_CLASS = "dx-validationsummary";
var ValidationGroup = _dom_component2.default.inherit({
    _getDefaultOptions: function() {
        return this.callBase()
    },
    _init: function() {
        this.callBase();
        _validation_engine2.default.addGroup(this)
    },
    _initMarkup: function() {
        var $element = this.$element();
        $element.addClass(VALIDATION_ENGINE_CLASS);
        $element.find("." + VALIDATOR_CLASS).each(function(_, validatorContainer) {
            _validator2.default.getInstance((0, _renderer2.default)(validatorContainer))._initGroupRegistration()
        });
        $element.find("." + VALIDATION_SUMMARY_CLASS).each(function(_, summaryContainer) {
            _validation_summary2.default.getInstance((0, _renderer2.default)(summaryContainer))._initGroupRegistration()
        });
        this.callBase()
    },
    validate: function() {
        return _validation_engine2.default.validateGroup(this)
    },
    reset: function() {
        return _validation_engine2.default.resetGroup(this)
    },
    _dispose: function() {
        _validation_engine2.default.removeGroup(this);
        this.$element().removeClass(VALIDATION_ENGINE_CLASS);
        this.callBase()
    }
});
(0, _component_registrator2.default)("dxValidationGroup", ValidationGroup);
module.exports = ValidationGroup;
module.exports.default = module.exports;
