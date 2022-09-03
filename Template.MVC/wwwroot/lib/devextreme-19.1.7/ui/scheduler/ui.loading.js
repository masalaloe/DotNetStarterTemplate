/**
 * DevExtreme (ui/scheduler/ui.loading.js)
 * Version: 19.1.7
 * Build date: Fri Oct 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../../core/renderer"),
    viewPortUtils = require("../../core/utils/view_port"),
    LoadPanel = require("../load_panel"),
    Deferred = require("../../core/utils/deferred").Deferred;
var loading = null;
var createLoadPanel = function(options) {
    return new LoadPanel($("<div>").appendTo(options && options.container || viewPortUtils.value()), options)
};
var removeLoadPanel = function() {
    if (!loading) {
        return
    }
    loading.$element().remove();
    loading = null
};
exports.show = function(options) {
    removeLoadPanel();
    loading = createLoadPanel(options);
    return loading.show()
};
exports.hide = function() {
    if (!loading) {
        return (new Deferred).resolve()
    }
    return loading.hide().done(removeLoadPanel).promise()
};
