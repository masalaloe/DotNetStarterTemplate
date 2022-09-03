/**
 * DevExtreme (ui/widget/template_engine_registry.js)
 * Version: 19.1.7
 * Build date: Fri Oct 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _type = require("../../core/utils/type");
var _errors = require("../../core/errors");
var _errors2 = _interopRequireDefault(_errors);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var templateEngines = {};
var currentTemplateEngine = void 0;
var registerTemplateEngine = function(name, templateEngine) {
    templateEngines[name] = templateEngine
};
var setTemplateEngine = function(templateEngine) {
    if ((0, _type.isString)(templateEngine)) {
        currentTemplateEngine = templateEngines[templateEngine];
        if (!currentTemplateEngine) {
            throw _errors2.default.Error("E0020", templateEngine)
        }
    } else {
        currentTemplateEngine = templateEngine
    }
};
var getCurrentTemplateEngine = function() {
    return currentTemplateEngine
};
module.exports.setTemplateEngine = setTemplateEngine;
module.exports.getCurrentTemplateEngine = getCurrentTemplateEngine;
module.exports.registerTemplateEngine = registerTemplateEngine;
