/**
 * DevExtreme (ui/text_box/ui.text_editor.mask.strategy.default.js)
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
var _uiText_editorMaskStrategy = require("./ui.text_editor.mask.strategy.base");
var _uiText_editorMaskStrategy2 = _interopRequireDefault(_uiText_editorMaskStrategy);
var _utils = require("../../events/utils");
var _promise = require("../../core/polyfills/promise");
var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}

function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i]
        }
        return arr2
    } else {
        return Array.from(arr)
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
var BACKSPACE_INPUT_TYPE = "deleteContentBackward";
var EMPTY_CHAR = " ";
var DefaultMaskStrategy = function(_BaseMaskStrategy) {
    _inherits(DefaultMaskStrategy, _BaseMaskStrategy);

    function DefaultMaskStrategy() {
        _classCallCheck(this, DefaultMaskStrategy);
        return _possibleConstructorReturn(this, (DefaultMaskStrategy.__proto__ || Object.getPrototypeOf(DefaultMaskStrategy)).apply(this, arguments))
    }
    _createClass(DefaultMaskStrategy, [{
        key: "_getStrategyName",
        value: function() {
            return "default"
        }
    }, {
        key: "getHandleEventNames",
        value: function() {
            return [].concat(_toConsumableArray(_get(DefaultMaskStrategy.prototype.__proto__ || Object.getPrototypeOf(DefaultMaskStrategy.prototype), "getHandleEventNames", this).call(this)), ["keyPress"])
        }
    }, {
        key: "_keyPressHandler",
        value: function(event) {
            if (this._keyPressHandled) {
                return
            }
            this._keyPressHandled = true;
            if (this.editor._isControlKeyFired(event)) {
                return
            }
            var editor = this.editor;
            editor._maskKeyHandler(event, function() {
                return editor._handleKey((0, _utils.getChar)(event))
            })
        }
    }, {
        key: "_inputHandler",
        value: function(event) {
            if (this._backspaceInputHandled(event.originalEvent && event.originalEvent.inputType)) {
                this._handleBackspaceInput(event)
            }
            if (this._keyPressHandled) {
                return
            }
            this._keyPressHandled = true;
            var inputValue = this.editorInput().val();
            var caret = this.editorCaret();
            if (!caret.end) {
                return
            }
            caret.start = caret.end - 1;
            var oldValue = inputValue.substring(0, caret.start) + inputValue.substring(caret.end);
            var char = inputValue[caret.start];
            this.editorInput().val(oldValue);
            this._inputHandlerTimer = setTimeout(function() {
                var _this2 = this;
                this._caret({
                    start: caret.start,
                    end: caret.start
                });
                this._maskKeyHandler(event, function() {
                    return _this2._handleKey(char)
                })
            }.bind(this.editor))
        }
    }, {
        key: "_backspaceHandler",
        value: function(event) {
            var _this3 = this;
            var editor = this.editor;
            this._keyPressHandled = true;
            var afterBackspaceHandler = function(needAdjustCaret, callBack) {
                if (needAdjustCaret) {
                    editor._direction(_this3.DIRECTION.FORWARD);
                    editor._adjustCaret()
                }
                var currentCaret = _this3.editorCaret();
                return new _promise2.default(function(resolve) {
                    clearTimeout(_this3._backspaceHandlerTimeout);
                    _this3._backspaceHandlerTimeout = setTimeout(function() {
                        callBack(currentCaret);
                        resolve()
                    })
                })
            };
            editor._maskKeyHandler(event, function() {
                if (editor._hasSelection()) {
                    return afterBackspaceHandler(true, function(currentCaret) {
                        editor._displayMask(currentCaret);
                        editor._maskRulesChain.reset()
                    })
                }
                if (editor._tryMoveCaretBackward()) {
                    return afterBackspaceHandler(false, function(currentCaret) {
                        _this3.editorCaret(currentCaret)
                    })
                }
                editor._handleKey(EMPTY_CHAR, _this3.DIRECTION.BACKWARD);
                return afterBackspaceHandler(true, function(currentCaret) {
                    editor._displayMask(currentCaret);
                    editor._maskRulesChain.reset()
                })
            })
        }
    }, {
        key: "_backspaceInputHandled",
        value: function(inputType) {
            return inputType === BACKSPACE_INPUT_TYPE && !this._keyPressHandled
        }
    }, {
        key: "_handleBackspaceInput",
        value: function(event) {
            var _editorCaret = this.editorCaret(),
                start = _editorCaret.start,
                end = _editorCaret.end;
            this.editorCaret({
                start: start + 1,
                end: end + 1
            });
            this._backspaceHandler(event)
        }
    }, {
        key: "clean",
        value: function() {
            _get(DefaultMaskStrategy.prototype.__proto__ || Object.getPrototypeOf(DefaultMaskStrategy.prototype), "clean", this).call(this);
            clearTimeout(this._inputHandlerTimer)
        }
    }]);
    return DefaultMaskStrategy
}(_uiText_editorMaskStrategy2.default);
exports.default = DefaultMaskStrategy;
