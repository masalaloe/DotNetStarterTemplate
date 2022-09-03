/**
 * DevExtreme (ui/file_manager/ui.file_manager.toolbar.js)
 * Version: 19.1.7
 * Build date: Fri Oct 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
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
var _get = function get(object, property, receiver) {
    if (null === object) {
        object = Function.prototype
    }
    var desc = Object.getOwnPropertyDescriptor(object, property);
    if (void 0 === desc) {
        var parent = Object.getPrototypeOf(object);
        if (null === parent) {
            return
        } else {
            return get(parent, property, receiver)
        }
    } else {
        if ("value" in desc) {
            return desc.value
        } else {
            var getter = desc.get;
            if (void 0 === getter) {
                return
            }
            return getter.call(receiver)
        }
    }
};
var _renderer = require("../../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _extend = require("../../core/utils/extend");
var _type = require("../../core/utils/type");
var _common = require("../../core/utils/common");
var _ui = require("../widget/ui.widget");
var _ui2 = _interopRequireDefault(_ui);
var _toolbar = require("../toolbar");
var _toolbar2 = _interopRequireDefault(_toolbar);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function")
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    }
    return call && ("object" === typeof call || "function" === typeof call) ? call : self
}

function _inherits(subClass, superClass) {
    if ("function" !== typeof superClass && null !== superClass) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass)
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass) {
        Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass
    }
}
var FILE_MANAGER_TOOLBAR_CLASS = "dx-filemanager-toolbar";
var FILE_MANAGER_GENERAL_TOOLBAR_CLASS = "dx-filemanager-general-toolbar";
var FILE_MANAGER_FILE_TOOLBAR_CLASS = "dx-filemanager-file-toolbar";
var FILE_MANAGER_TOOLBAR_SEPARATOR_ITEM_CLASS = FILE_MANAGER_TOOLBAR_CLASS + "-separator-item";
var FILE_MANAGER_TOOLBAR_VIEWMODE_ITEM_CLASS = FILE_MANAGER_TOOLBAR_CLASS + "-viewmode-item";
var DEFAULT_TOOLBAR_FILE_ITEMS = [{
    commandName: "download",
    location: "before",
    compactMode: {
        showText: "inMenu",
        locateInMenu: "auto"
    }
}, {
    commandName: "separator",
    location: "before"
}, {
    commandName: "move",
    location: "before",
    compactMode: {
        locateInMenu: "auto"
    }
}, {
    commandName: "copy",
    location: "before",
    compactMode: {
        locateInMenu: "auto"
    }
}, {
    commandName: "rename",
    location: "before",
    compactMode: {
        locateInMenu: "auto"
    }
}, {
    commandName: "separator",
    location: "before"
}, {
    commandName: "delete",
    location: "before",
    compactMode: {
        showText: "inMenu"
    }
}, {
    commandName: "clear",
    location: "after",
    locateInMenu: "never",
    compactMode: {
        showText: "inMenu"
    }
}];
var DEFAULT_TOOLBAR_GENERAL_ITEMS = [{
    commandName: "showDirsPanel",
    location: "before"
}, {
    commandName: "create",
    location: "before",
    compactMode: {
        showText: "inMenu",
        locateInMenu: "auto"
    }
}, {
    commandName: "upload",
    location: "before",
    compactMode: {
        showText: "inMenu",
        locateInMenu: "auto"
    }
}, {
    commandName: "refresh",
    location: "after",
    showText: "inMenu",
    compactMode: {
        showText: "inMenu",
        locateInMenu: "auto"
    }
}, {
    commandName: "separator",
    location: "after"
}, {
    commandName: "viewMode",
    location: "after"
}];
var ALWAYS_VISIBLE_TOOLBAR_ITEMS = ["separator", "viewMode"];
var FileManagerToolbar = function(_Widget) {
    _inherits(FileManagerToolbar, _Widget);

    function FileManagerToolbar() {
        _classCallCheck(this, FileManagerToolbar);
        return _possibleConstructorReturn(this, (FileManagerToolbar.__proto__ || Object.getPrototypeOf(FileManagerToolbar)).apply(this, arguments))
    }
    _createClass(FileManagerToolbar, [{
        key: "_initMarkup",
        value: function() {
            this._commandManager = this.option("commandManager");
            this._generalToolbarVisible = true;
            this._generalToolbar = this._createToolbar(DEFAULT_TOOLBAR_GENERAL_ITEMS);
            this._fileToolbar = this._createToolbar(DEFAULT_TOOLBAR_FILE_ITEMS, true);
            this.$element().addClass(FILE_MANAGER_TOOLBAR_CLASS + " " + FILE_MANAGER_GENERAL_TOOLBAR_CLASS)
        }
    }, {
        key: "_render",
        value: function() {
            _get(FileManagerToolbar.prototype.__proto__ || Object.getPrototypeOf(FileManagerToolbar.prototype), "_render", this).call(this);
            var toolbar = this._getVisibleToolbar();
            this._checkCompactMode(toolbar)
        }
    }, {
        key: "_dimensionChanged",
        value: function(dimension) {
            if (!dimension || "height" !== dimension) {
                var toolbar = this._getVisibleToolbar();
                this._checkCompactMode(toolbar)
            }
        }
    }, {
        key: "_getVisibleToolbar",
        value: function() {
            return this._generalToolbarVisible ? this._generalToolbar : this._fileToolbar
        }
    }, {
        key: "_createToolbar",
        value: function(items, hidden) {
            var toolbarItems = this._getToolbarItems(items);
            var $toolbar = (0, _renderer2.default)("<div>").appendTo(this.$element());
            var result = this._createComponent($toolbar, _toolbar2.default, {
                items: toolbarItems,
                visible: !hidden
            });
            result.compactMode = false;
            return result
        }
    }, {
        key: "_getToolbarItems",
        value: function(items) {
            var _this2 = this;
            var groupHasItems = false;
            return items.map(function(item) {
                var commandName = (0, _type.isString)(item) ? item : item.commandName;
                var config = _this2._getItemConfigByCommandName(commandName);
                if (!(0, _type.isObject)(item)) {
                    item = {
                        commandName: commandName
                    }
                }
                var preparedItem = (0, _extend.extend)(true, config, item);
                if ("separator" === commandName) {
                    preparedItem.visible = groupHasItems;
                    groupHasItems = false
                } else {
                    preparedItem.available = _this2._isCommandAvailable(commandName);
                    var itemVisible = preparedItem.available && (0, _common.ensureDefined)(preparedItem.visible, true);
                    preparedItem.visible = itemVisible;
                    groupHasItems = groupHasItems || itemVisible
                }
                return preparedItem
            })
        }
    }, {
        key: "_getItemConfigByCommandName",
        value: function(commandName) {
            var command = this._commandManager.getCommandByName(commandName);
            if (command) {
                return this._createCommandItem(command)
            }
            switch (commandName) {
                case "separator":
                    return this._createSeparatorItem();
                case "viewMode":
                    return this._createViewModeItem()
            }
            return {}
        }
    }, {
        key: "_createCommandItem",
        value: function(command) {
            var _this3 = this;
            return {
                widget: "dxButton",
                options: {
                    text: command.text,
                    commandText: command.text,
                    icon: command.icon,
                    stylingMode: "text",
                    onClick: function(e) {
                        return _this3._executeCommand(command)
                    }
                }
            }
        }
    }, {
        key: "_createSeparatorItem",
        value: function() {
            return {
                template: function(data, index, element) {
                    (0, _renderer2.default)(element).addClass(FILE_MANAGER_TOOLBAR_SEPARATOR_ITEM_CLASS)
                }
            }
        }
    }, {
        key: "_createViewModeItem",
        value: function() {
            var _this4 = this;
            var commandItems = ["thumbnails", "details"].map(function(name) {
                var _commandManager$getCo = _this4._commandManager.getCommandByName(name),
                    text = _commandManager$getCo.text;
                return {
                    name: name,
                    text: text
                }
            });
            var selectedIndex = "thumbnails" === this.option("itemViewMode") ? 0 : 1;
            return {
                cssClass: FILE_MANAGER_TOOLBAR_VIEWMODE_ITEM_CLASS,
                widget: "dxSelectBox",
                options: {
                    items: commandItems,
                    value: commandItems[selectedIndex],
                    displayExpr: "text",
                    stylingMode: "filled",
                    onValueChanged: function(e) {
                        return _this4._executeCommand(e.value.name)
                    }
                }
            }
        }
    }, {
        key: "_checkCompactMode",
        value: function(toolbar) {
            if (toolbar.compactMode) {
                this._toggleCompactMode(toolbar, false)
            }
            var toolbarWidth = toolbar.$element().width();
            var itemsWidth = toolbar._getItemsWidth();
            var useCompactMode = toolbarWidth < itemsWidth;
            if (toolbar.compactMode !== useCompactMode) {
                if (!toolbar.compactMode) {
                    this._toggleCompactMode(toolbar, useCompactMode)
                }
                toolbar.compactMode = useCompactMode
            } else {
                if (toolbar.compactMode) {
                    this._toggleCompactMode(toolbar, true)
                }
            }
        }
    }, {
        key: "_toggleCompactMode",
        value: function(toolbar, useCompactMode) {
            var _this5 = this;
            toolbar.beginUpdate();
            var items = toolbar.option("items");
            items.forEach(function(item, index) {
                if (item.compactMode) {
                    var optionsSource = null;
                    if (useCompactMode) {
                        item.saved = _this5._getCompactModeOptions(item, item.available);
                        optionsSource = item.compactMode
                    } else {
                        optionsSource = item.saved
                    }
                    var options = _this5._getCompactModeOptions(optionsSource, item.available);
                    toolbar.option("items[" + index + "]", options)
                }
            });
            toolbar.endUpdate()
        }
    }, {
        key: "_getCompactModeOptions",
        value: function(_ref, available) {
            var visible = _ref.visible,
                showText = _ref.showText,
                locateInMenu = _ref.locateInMenu;
            return {
                visible: available && (0, _common.ensureDefined)(visible, true),
                showText: (0, _common.ensureDefined)(showText, "always"),
                locateInMenu: (0, _common.ensureDefined)(locateInMenu, "never")
            }
        }
    }, {
        key: "_ensureAvailableCommandsVisible",
        value: function(toolbar, fileItems) {
            var _this6 = this;
            toolbar.beginUpdate();
            var groupHasItems = false;
            var items = toolbar.option("items");
            items.forEach(function(item, index) {
                var itemVisible = item.available;
                var showItem = false;
                if ("separator" === item.commandName) {
                    showItem = groupHasItems;
                    groupHasItems = false
                } else {
                    item.available = _this6._isCommandAvailable(item.commandName, fileItems);
                    showItem = item.available;
                    groupHasItems = groupHasItems || showItem
                }
                if (showItem !== itemVisible) {
                    var optionName = "items[" + index + "].visible";
                    toolbar.option(optionName, showItem)
                }
            });
            toolbar.endUpdate()
        }
    }, {
        key: "_fileToolbarHasEffectiveItems",
        value: function(fileItems) {
            var _this7 = this;
            var items = this._fileToolbar.option("items");
            return items.some(function(_ref2) {
                var commandName = _ref2.commandName;
                return "clear" !== commandName && _this7._commandManager.isCommandAvailable(commandName, fileItems)
            })
        }
    }, {
        key: "_executeCommand",
        value: function(command) {
            this._commandManager.executeCommand(command)
        }
    }, {
        key: "_isCommandAvailable",
        value: function(commandName, fileItems) {
            return ALWAYS_VISIBLE_TOOLBAR_ITEMS.indexOf(commandName) > -1 || this._commandManager.isCommandAvailable(commandName, fileItems)
        }
    }, {
        key: "_getDefaultOptions",
        value: function() {
            return (0, _extend.extend)(_get(FileManagerToolbar.prototype.__proto__ || Object.getPrototypeOf(FileManagerToolbar.prototype), "_getDefaultOptions", this).call(this), {
                commandManager: null,
                itemViewMode: "details"
            })
        }
    }, {
        key: "_optionChanged",
        value: function(args) {
            var name = args.name;
            switch (name) {
                case "commandManager":
                case "itemViewMode":
                    this.repaint();
                    break;
                default:
                    _get(FileManagerToolbar.prototype.__proto__ || Object.getPrototypeOf(FileManagerToolbar.prototype), "_optionChanged", this).call(this, args)
            }
        }
    }, {
        key: "update",
        value: function(fileItems) {
            fileItems = (0, _common.ensureDefined)(fileItems, []);
            var showGeneralToolbar = 0 === fileItems.length || !this._fileToolbarHasEffectiveItems(fileItems);
            if (this._generalToolbarVisible !== showGeneralToolbar) {
                this._generalToolbar.option("visible", showGeneralToolbar);
                this._fileToolbar.option("visible", !showGeneralToolbar);
                this._generalToolbarVisible = showGeneralToolbar;
                this.$element().toggleClass(FILE_MANAGER_GENERAL_TOOLBAR_CLASS, showGeneralToolbar);
                this.$element().toggleClass(FILE_MANAGER_FILE_TOOLBAR_CLASS, !showGeneralToolbar)
            }
            var toolbar = this._getVisibleToolbar();
            this._ensureAvailableCommandsVisible(toolbar, fileItems);
            this._checkCompactMode(toolbar)
        }
    }]);
    return FileManagerToolbar
}(_ui2.default);
module.exports = FileManagerToolbar;
