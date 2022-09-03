/**
 * DevExtreme (ui/file_manager/ui.file_manager.command_manager.js)
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
exports.FileManagerCommandManager = void 0;
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
var _extend = require("../../core/utils/extend");
var _type = require("../../core/utils/type");

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function")
    }
}
var FileManagerCommandManager = exports.FileManagerCommandManager = function() {
    function FileManagerCommandManager(permissions) {
        _classCallCheck(this, FileManagerCommandManager);
        this._actions = {};
        this._permissions = permissions || {};
        this._initCommands()
    }
    _createClass(FileManagerCommandManager, [{
        key: "_initCommands",
        value: function() {
            var _this = this;
            this._commands = [{
                name: "create",
                text: "New folder",
                icon: "plus",
                enabled: this._permissions.create,
                noFileItemRequired: true
            }, {
                name: "rename",
                text: "Rename",
                enabled: this._permissions.rename,
                isSingleFileItemCommand: true
            }, {
                name: "move",
                text: "Move",
                enabled: this._permissions.move
            }, {
                name: "copy",
                text: "Copy",
                enabled: this._permissions.copy
            }, {
                name: "delete",
                text: "Delete",
                icon: "trash",
                enabled: this._permissions.remove
            }, {
                name: "download",
                text: "Download",
                icon: "download",
                enabled: false
            }, {
                name: "upload",
                text: "Upload files",
                icon: "upload",
                enabled: this._permissions.upload,
                noFileItemRequired: true
            }, {
                name: "refresh",
                text: "Refresh",
                icon: "refresh",
                enabled: true,
                noFileItemRequired: true
            }, {
                name: "thumbnails",
                text: "Thumbnails View",
                enabled: true,
                noFileItemRequired: true
            }, {
                name: "details",
                text: "Details View",
                enabled: true,
                noFileItemRequired: true
            }, {
                name: "clear",
                text: "Clear selection",
                icon: "remove",
                enabled: true
            }, {
                name: "showDirsPanel",
                icon: "menu",
                enabled: false,
                noFileItemRequired: true
            }];
            this._commandMap = {};
            this._commands.forEach(function(command) {
                _this._commandMap[command.name] = command
            })
        }
    }, {
        key: "registerActions",
        value: function(actions) {
            this._actions = (0, _extend.extend)(this._actions, actions)
        }
    }, {
        key: "executeCommand",
        value: function(command, arg) {
            var commandName = (0, _type.isString)(command) ? command : command.name;
            var action = this._actions[commandName];
            if (action) {
                action(arg)
            }
        }
    }, {
        key: "setCommandEnabled",
        value: function(commandName, enabled) {
            var command = this.getCommandByName(commandName);
            if (command) {
                command.enabled = enabled
            }
        }
    }, {
        key: "getCommandByName",
        value: function(name) {
            return this._commandMap[name]
        }
    }, {
        key: "isCommandAvailable",
        value: function(commandName, items) {
            var command = this.getCommandByName(commandName);
            if (!command || !command.enabled) {
                return false
            }
            if (command.noFileItemRequired) {
                return true
            }
            var itemsLength = items && items.length || 0;
            if (0 === itemsLength || items.some(function(item) {
                    return item.isRoot() || item.isParentFolder
                })) {
                return false
            }
            return !command.isSingleFileItemCommand || 1 === itemsLength
        }
    }]);
    return FileManagerCommandManager
}();
