/**
 * DevExtreme (ui/text_box/ui.text_editor.mask.strategy.base.js)
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
var _events_engine = require("../../events/core/events_engine");
var _events_engine2 = _interopRequireDefault(_events_engine);
var _utils = require("../../events/utils");
var _array = require("../../core/utils/array");
var _dom = require("../../core/utils/dom");

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
var MASK_EVENT_NAMESPACE = "dxMask";
var BLUR_EVENT = "blur beforedeactivate";
var EMPTY_CHAR = " ";
var BaseMaskStrategy = function() {
    function BaseMaskStrategy(editor) {
        _classCallCheck(this, BaseMaskStrategy);
        this.editor = editor;
        this.DIRECTION = {
            FORWARD: "forward",
            BACKWARD: "backward"
        };
        this.NAME = this._getStrategyName()
    }
    _createClass(BaseMaskStrategy, [{
        key: "_getStrategyName",
        value: function() {
            return "base"
        }
    }, {
        key: "editorOption",
        value: function() {
            var _editor;
            return (_editor = this.editor).option.apply(_editor, arguments)
        }
    }, {
        key: "editorInput",
        value: function() {
            return this.editor._input()
        }
    }, {
        key: "editorCaret",
        value: function(newCaret) {
            if (!newCaret) {
                return this.editor._caret()
            }
            this.editor._caret(newCaret)
        }
    }, {
        key: "getHandler",
        value: function(handlerName) {
            var handler = this["_" + handlerName + "Handler"] || function() {};
            return handler.bind(this)
        }
    }, {
        key: "attachEvents",
        value: function() {
            var _this = this;
            var $input = this.editorInput();
            this.getHandleEventNames().forEach(function(eventName) {
                var subscriptionName = (0, _utils.addNamespace)(eventName.toLowerCase(), MASK_EVENT_NAMESPACE);
                _events_engine2.default.on($input, subscriptionName, _this.getEventHandler(eventName))
            });
            this._attachChangeEventHandlers()
        }
    }, {
        key: "getHandleEventNames",
        value: function() {
            return ["focusIn", "focusOut", "keyDown", "input", "paste", "cut", "drop"]
        }
    }, {
        key: "getEventHandler",
        value: function(eventName) {
            return this["_" + eventName + "Handler"].bind(this)
        }
    }, {
        key: "detachEvents",
        value: function() {
            _events_engine2.default.off(this.editorInput(), "." + MASK_EVENT_NAMESPACE)
        }
    }, {
        key: "_attachChangeEventHandlers",
        value: function() {
            if ((0, _array.inArray)("change", this.editorOption("valueChangeEvent").split(" ")) === -1) {
                return
            }
            _events_engine2.default.on(this.editorInput(), (0, _utils.addNamespace)(BLUR_EVENT, MASK_EVENT_NAMESPACE), function(e) {
                this._suppressCaretChanging(this._changeHandler, [e]);
                this._changeHandler(e)
            }.bind(this.editor))
        }
    }, {
        key: "_focusInHandler",
        value: function() {
            this.editor._showMaskPlaceholder();
            this.editor._direction(this.DIRECTION.FORWARD);
            if (!this.editor._isValueEmpty() && this.editorOption("isValid")) {
                this.editor._adjustCaret()
            } else {
                var caret = this.editor._maskRulesChain.first();
                this._caretTimeout = setTimeout(function() {
                    this._caret({
                        start: caret,
                        end: caret
                    })
                }.bind(this.editor), 0)
            }
        }
    }, {
        key: "_focusOutHandler",
        value: function(event) {
            this.editor._changeHandler(event);
            if ("onFocus" === this.editorOption("showMaskMode") && this.editor._isValueEmpty()) {
                this.editorOption("text", "");
                this.editor._renderDisplayText("")
            }
        }
    }, {
        key: "_cutHandler",
        value: function(event) {
            var caret = this.editorCaret();
            var selectedText = this.editorInput().val().substring(caret.start, caret.end);
            this.editor._maskKeyHandler(event, function() {
                return (0, _dom.clipboardText)(event, selectedText)
            })
        }
    }, {
        key: "_dropHandler",
        value: function() {
            this._clearDragTimer();
            this._dragTimer = setTimeout(function() {
                this.option("value", this._convertToValue(this._input().val()))
            }.bind(this.editor))
        }
    }, {
        key: "_clearDragTimer",
        value: function() {
            clearTimeout(this._dragTimer)
        }
    }, {
        key: "_keyDownHandler",
        value: function() {
            this._keyPressHandled = false
        }
    }, {
        key: "_pasteHandler",
        value: function(event) {
            var editor = this.editor;
            this._keyPressHandled = true;
            var caret = this.editorCaret();
            editor._maskKeyHandler(event, function() {
                var pastingText = (0, _dom.clipboardText)(event);
                var restText = editor._maskRulesChain.text().substring(caret.end);
                var accepted = editor._handleChain({
                    text: pastingText,
                    start: caret.start,
                    length: pastingText.length
                });
                var newCaret = caret.start + accepted;
                editor._handleChain({
                    text: restText,
                    start: newCaret,
                    length: restText.length
                });
                editor._caret({
                    start: newCaret,
                    end: newCaret
                })
            })
        }
    }, {
        key: "runWithoutEventProcessing",
        value: function(action) {
            var keyPressHandled = this._keyPressHandled;
            this._keyPressHandled = true;
            action();
            this._keyPressHandled = keyPressHandled
        }
    }, {
        key: "_backspaceHandler",
        value: function() {}
    }, {
        key: "_delHandler",
        value: function(event) {
            var editor = this.editor;
            this._keyPressHandled = true;
            editor._maskKeyHandler(event, function() {
                return !editor._hasSelection() && editor._handleKey(EMPTY_CHAR)
            })
        }
    }, {
        key: "clean",
        value: function() {
            this._clearDragTimer();
            clearTimeout(this._backspaceHandlerTimeout);
            clearTimeout(this._caretTimeout)
        }
    }]);
    return BaseMaskStrategy
}();
exports.default = BaseMaskStrategy;
