/**
 * DevExtreme (viz/sankey/tooltip.js)
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
exports.setTooltipCustomOptions = setTooltipCustomOptions;
var _extend = require("../../core/utils/extend").extend,
    isFunction = require("../../core/utils/type").isFunction,
    defaultCustomizeLinkTooltip = function(info) {
        return {
            html: "<strong>" + info.source + " > " + info.target + "</strong><br/>Weight: " + info.weight
        }
    },
    defaultCustomizeNodeTooltip = function(info) {
        return {
            html: "<strong>" + info.title + "</strong><br/>Incoming weight: " + info.weightIn + "<br/>Outgoing weight: " + info.weightOut
        }
    },
    generateCustomCallback = function(customCallback, defaultCallback) {
        return function(objectInfo) {
            var res = isFunction(customCallback) ? customCallback.call(objectInfo, objectInfo) : {};
            var hasOwnProperty = Object.prototype.hasOwnProperty.bind(res);
            if (!hasOwnProperty("html") && !hasOwnProperty("text")) {
                res = _extend(res, defaultCallback.call(objectInfo, objectInfo))
            }
            return res
        }
    };

function setTooltipCustomOptions(sankey) {
    sankey.prototype._setTooltipOptions = function() {
        var tooltip = this._tooltip,
            options = tooltip && this._getOption("tooltip");
        tooltip && tooltip.update(_extend({}, options, {
            customizeTooltip: function(args) {
                if ("node" === args.type) {
                    return generateCustomCallback(options.customizeNodeTooltip, defaultCustomizeNodeTooltip)(args.info)
                } else {
                    if ("link" === args.type) {
                        return generateCustomCallback(options.customizeLinkTooltip, defaultCustomizeLinkTooltip)(args.info)
                    }
                }
                return {}
            },
            enabled: options.enabled
        }))
    };
    sankey.prototype.hideTooltip = function() {
        this._tooltip && this._tooltip.hide()
    }
}
