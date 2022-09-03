/**
 * DevExtreme (integration/jquery/renderer.js)
 * Version: 19.1.7
 * Build date: Fri Oct 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var jQuery = require("jquery");
var rendererBase = require("../../core/renderer_base");
var useJQuery = require("./use_jquery")();
if (useJQuery) {
    rendererBase.set(jQuery)
}
