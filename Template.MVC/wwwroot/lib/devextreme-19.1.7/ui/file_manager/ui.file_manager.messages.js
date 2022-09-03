/**
 * DevExtreme (ui/file_manager/ui.file_manager.messages.js)
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
exports.FileManagerMessages = void 0;
var _message = require("../../localization/message");
var _message2 = _interopRequireDefault(_message);
var _uiFile_manager = require("./ui.file_manager.common");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var FileManagerMessages = exports.FileManagerMessages = {
    get: function(errorId, args) {
        switch (errorId) {
            case _uiFile_manager.ErrorCode.NoAccess:
                return _message2.default.format("dxFileManager-errorNoAccess");
            case _uiFile_manager.ErrorCode.FileExists:
                return _message2.default.format("dxFileManager-errorFileExistsFormat", args);
            case _uiFile_manager.ErrorCode.FileNotFound:
                return _message2.default.format("dxFileManager-errorFileNotFoundFormat", args);
            case _uiFile_manager.ErrorCode.DirectoryExists:
                return _message2.default.format("dxFileManager-errorDirectoryExistsFormat", args)
        }
        return _message2.default.format("dxFileManager-errorDefault")
    }
};
module.exports.ErrorCode = _uiFile_manager.ErrorCode;
