/**
 * DevExtreme (bundles/modules/file_providers.js)
 * Version: 19.1.7
 * Build date: Fri Oct 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _core = require("./core");
var _core2 = _interopRequireDefault(_core);
var _webapi = require("../../ui/file_manager/file_provider/webapi");
var _webapi2 = _interopRequireDefault(_webapi);
var _onedrive = require("../../ui/file_manager/file_provider/onedrive");
var _onedrive2 = _interopRequireDefault(_onedrive);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
module.exports = _core2.default.FileProviders = _core2.default.FileProviders || {};
_core2.default.FileProviders.WebApi = _webapi2.default;
_core2.default.FileProviders.OneDrive = _onedrive2.default;
