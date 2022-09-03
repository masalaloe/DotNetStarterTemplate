/**
 * DevExtreme (ui/widget/template.js)
 * Version: 19.1.7
 * Build date: Fri Oct 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _renderer = require("../../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _ui = require("./ui.template_base");
var _ui2 = _interopRequireDefault(_ui);
var _dom = require("../../core/utils/dom");
var _template_engine_registry = require("./template_engine_registry");
require("./template_engines");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}(0, _template_engine_registry.registerTemplateEngine)("default", {
    compile: function(element) {
        return (0, _dom.normalizeTemplateElement)(element)
    },
    render: function(template, model, index) {
        return template.clone()
    }
});
(0, _template_engine_registry.setTemplateEngine)("default");
var Template = _ui2.default.inherit({
    ctor: function(element) {
        this._element = element
    },
    _renderCore: function(options) {
        var transclude = options.transclude;
        if (!transclude && !this._compiledTemplate) {
            this._compiledTemplate = (0, _template_engine_registry.getCurrentTemplateEngine)().compile(this._element)
        }
        return (0, _renderer2.default)("<div>").append(transclude ? this._element : (0, _template_engine_registry.getCurrentTemplateEngine)().render(this._compiledTemplate, options.model, options.index)).contents()
    },
    source: function() {
        return (0, _renderer2.default)(this._element).clone()
    }
});
module.exports = Template;
