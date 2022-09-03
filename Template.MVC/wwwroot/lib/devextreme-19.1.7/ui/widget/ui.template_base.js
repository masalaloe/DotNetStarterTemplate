/**
 * DevExtreme (ui/widget/ui.template_base.js)
 * Version: 19.1.7
 * Build date: Fri Oct 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../../core/renderer"),
    domAdapter = require("../../core/dom_adapter"),
    Callbacks = require("../../core/utils/callbacks"),
    domUtils = require("../../core/utils/dom"),
    Class = require("../../core/class"),
    abstract = Class.abstract;
var renderedCallbacks = Callbacks({
    syncStrategy: true
});
var TemplateBase = Class.inherit({
    render: function(options) {
        options = options || {};
        var onRendered = options.onRendered;
        delete options.onRendered;
        var $result = this._renderCore(options);
        this._ensureResultInContainer($result, options.container);
        renderedCallbacks.fire($result, options.container);
        onRendered && onRendered();
        return $result
    },
    _ensureResultInContainer: function($result, container) {
        if (!container) {
            return
        }
        var $container = $(container);
        var resultInContainer = domUtils.contains($container.get(0), $result.get(0));
        $container.append($result);
        if (resultInContainer) {
            return
        }
        var resultInBody = domAdapter.getBody().contains($container.get(0));
        if (!resultInBody) {
            return
        }
        domUtils.triggerShownEvent($result)
    },
    _renderCore: abstract
});
module.exports = TemplateBase;
module.exports.renderedCallbacks = renderedCallbacks;
