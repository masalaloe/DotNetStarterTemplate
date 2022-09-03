/**
 * DevExtreme (ui/diagram/ui.diagram.contextmenu.js)
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
var _ui = require("../widget/ui.widget");
var _ui2 = _interopRequireDefault(_ui);
var _context_menu = require("../context_menu");
var _context_menu2 = _interopRequireDefault(_context_menu);
var _uiDiagram = require("./ui.diagram.commands");
var _uiDiagram2 = _interopRequireDefault(_uiDiagram);
var _diagram_bar = require("./diagram_bar");
var _diagram_bar2 = _interopRequireDefault(_diagram_bar);

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
var DiagramContextMenu = function(_Widget) {
    _inherits(DiagramContextMenu, _Widget);

    function DiagramContextMenu() {
        _classCallCheck(this, DiagramContextMenu);
        return _possibleConstructorReturn(this, (DiagramContextMenu.__proto__ || Object.getPrototypeOf(DiagramContextMenu)).apply(this, arguments))
    }
    _createClass(DiagramContextMenu, [{
        key: "_init",
        value: function() {
            _get(DiagramContextMenu.prototype.__proto__ || Object.getPrototypeOf(DiagramContextMenu.prototype), "_init", this).call(this);
            this._createOnVisibleChangedAction();
            this.bar = new ContextMenuBar(this);
            this._tempState = void 0;
            this._commandToIndexMap = {}
        }
    }, {
        key: "_initMarkup",
        value: function() {
            var _this2 = this;
            _get(DiagramContextMenu.prototype.__proto__ || Object.getPrototypeOf(DiagramContextMenu.prototype), "_initMarkup", this).call(this);
            var items = _uiDiagram2.default.getContextMenu();
            var $contextMenu = (0, _renderer2.default)("<div>").appendTo(this.$element());
            this._contextMenuInstance = this._createComponent($contextMenu, _context_menu2.default, {
                target: this.option("container"),
                dataSource: items,
                displayExpr: "text",
                onItemClick: function(_ref) {
                    var itemData = _ref.itemData;
                    return _this2._onItemClick(itemData.command)
                },
                onShowing: function(e) {
                    _this2._tempState = true;
                    _this2._onVisibleChangedAction({
                        visible: true,
                        component: _this2
                    });
                    delete _this2._tempState
                },
                onHiding: function(e) {
                    _this2._tempState = false;
                    _this2._onVisibleChangedAction({
                        visible: false,
                        component: _this2
                    });
                    delete _this2._tempState
                }
            });
            items.forEach(function(item, index) {
                return _this2._commandToIndexMap[item.command] = index
            })
        }
    }, {
        key: "_onItemClick",
        value: function(command) {
            this.bar.raiseBarCommandExecuted(command);
            this._contextMenuInstance.hide()
        }
    }, {
        key: "_setItemEnabled",
        value: function(key, enabled) {
            if (key in this._commandToIndexMap) {
                this._contextMenuInstance.option("items[" + this._commandToIndexMap[key] + "].disabled", !enabled)
            }
        }
    }, {
        key: "_setEnabled",
        value: function(enabled) {
            this._contextMenuInstance.option("disabled", !enabled)
        }
    }, {
        key: "isVisible",
        value: function() {
            if (void 0 !== this._tempState) {
                return this._tempState
            }
            return !!this._contextMenuInstance.option("visible")
        }
    }, {
        key: "_createOnVisibleChangedAction",
        value: function() {
            this._onVisibleChangedAction = this._createActionByOption("onVisibleChanged")
        }
    }, {
        key: "_optionChanged",
        value: function(args) {
            switch (args.name) {
                case "onVisibleChanged":
                    this._createOnVisibleChangedAction();
                    break;
                default:
                    _get(DiagramContextMenu.prototype.__proto__ || Object.getPrototypeOf(DiagramContextMenu.prototype), "_optionChanged", this).call(this, args)
            }
        }
    }]);
    return DiagramContextMenu
}(_ui2.default);
var ContextMenuBar = function(_DiagramBar) {
    _inherits(ContextMenuBar, _DiagramBar);

    function ContextMenuBar() {
        _classCallCheck(this, ContextMenuBar);
        return _possibleConstructorReturn(this, (ContextMenuBar.__proto__ || Object.getPrototypeOf(ContextMenuBar)).apply(this, arguments))
    }
    _createClass(ContextMenuBar, [{
        key: "getCommandKeys",
        value: function() {
            return _uiDiagram2.default.getContextMenu().map(function(c) {
                return c.command
            })
        }
    }, {
        key: "setItemEnabled",
        value: function(key, enabled) {
            this._owner._setItemEnabled(key, enabled)
        }
    }, {
        key: "setEnabled",
        value: function(enabled) {
            this._owner._setEnabled(enabled)
        }
    }, {
        key: "isVisible",
        value: function() {
            return this._owner.isVisible()
        }
    }]);
    return ContextMenuBar
}(_diagram_bar2.default);
module.exports = DiagramContextMenu;
