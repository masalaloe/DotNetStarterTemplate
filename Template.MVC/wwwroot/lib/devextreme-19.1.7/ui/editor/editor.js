/**
 * DevExtreme (ui/editor/editor.js)
 * Version: 19.1.7
 * Build date: Fri Oct 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../../core/renderer"),
    dataUtils = require("../../core/element_data"),
    Callbacks = require("../../core/utils/callbacks"),
    commonUtils = require("../../core/utils/common"),
    windowUtils = require("../../core/utils/window"),
    Guid = require("../../core/guid"),
    getDefaultAlignment = require("../../core/utils/position").getDefaultAlignment,
    extend = require("../../core/utils/extend").extend,
    Widget = require("../widget/ui.widget"),
    ValidationMixin = require("../validation/validation_mixin"),
    Overlay = require("../overlay");
var READONLY_STATE_CLASS = "dx-state-readonly",
    INVALID_CLASS = "dx-invalid",
    INVALID_MESSAGE = "dx-invalid-message",
    INVALID_MESSAGE_CONTENT = "dx-invalid-message-content",
    INVALID_MESSAGE_AUTO = "dx-invalid-message-auto",
    INVALID_MESSAGE_ALWAYS = "dx-invalid-message-always",
    VALIDATION_TARGET = "dx-validation-target",
    VALIDATION_MESSAGE_MIN_WIDTH = 100;
var Editor = Widget.inherit({
    ctor: function() {
        this.showValidationMessageTimeout = null;
        this.callBase.apply(this, arguments)
    },
    _init: function() {
        this.callBase();
        this.validationRequest = Callbacks();
        this._initInnerOptionCache("validationTooltipOptions");
        var $element = this.$element();
        if ($element) {
            dataUtils.data($element[0], VALIDATION_TARGET, this)
        }
    },
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            value: null,
            name: "",
            onValueChanged: null,
            readOnly: false,
            isValid: true,
            validationError: null,
            validationMessageMode: "auto",
            validationBoundary: void 0,
            validationMessageOffset: {
                h: 0,
                v: 0
            },
            validationTooltipOptions: {}
        })
    },
    _attachKeyboardEvents: function() {
        if (this.option("readOnly")) {
            return
        }
        this.callBase();
        if (this._keyboardProcessor) {
            this._attachChildKeyboardEvents()
        }
    },
    _attachChildKeyboardEvents: commonUtils.noop,
    _setOptionsByReference: function() {
        this.callBase();
        extend(this._optionsByReference, {
            validationError: true
        })
    },
    _createValueChangeAction: function() {
        this._valueChangeAction = this._createActionByOption("onValueChanged", {
            excludeValidators: ["disabled", "readOnly"]
        })
    },
    _suppressValueChangeAction: function() {
        this._valueChangeActionSuppressed = true
    },
    _resumeValueChangeAction: function() {
        this._valueChangeActionSuppressed = false
    },
    _initMarkup: function() {
        this._toggleReadOnlyState();
        this._setSubmitElementName(this.option("name"));
        this.callBase();
        this._renderValidationState()
    },
    _raiseValueChangeAction: function(value, previousValue) {
        if (!this._valueChangeAction) {
            this._createValueChangeAction()
        }
        this._valueChangeAction(this._valueChangeArgs(value, previousValue))
    },
    _valueChangeArgs: function(value, previousValue) {
        return {
            value: value,
            previousValue: previousValue,
            event: this._valueChangeEventInstance
        }
    },
    _saveValueChangeEvent: function(e) {
        this._valueChangeEventInstance = e
    },
    _focusInHandler: function(e) {
        var _this = this;
        var isValidationMessageShownOnFocus = "auto" === this.option("validationMessageMode");
        if (this._canValueBeChangedByClick() && isValidationMessageShownOnFocus) {
            this._$validationMessage && this._$validationMessage.removeClass(INVALID_MESSAGE_AUTO);
            clearTimeout(this.showValidationMessageTimeout);
            this.showValidationMessageTimeout = setTimeout(function() {
                return _this._$validationMessage && _this._$validationMessage.addClass(INVALID_MESSAGE_AUTO)
            }, 150)
        }
        return this.callBase(e)
    },
    _canValueBeChangedByClick: function() {
        return false
    },
    _renderValidationState: function() {
        var isValid = this.option("isValid"),
            validationError = this.option("validationError"),
            validationMessageMode = this.option("validationMessageMode"),
            $element = this.$element();
        $element.toggleClass(INVALID_CLASS, !isValid);
        this.setAria("invalid", !isValid || void 0);
        if (!windowUtils.hasWindow()) {
            return
        }
        if (this._$validationMessage) {
            this._$validationMessage.remove();
            this.setAria("describedby", null);
            this._$validationMessage = null
        }
        if (!isValid && validationError && validationError.message) {
            this._$validationMessage = $("<div>").addClass(INVALID_MESSAGE).html(validationError.message).appendTo($element);
            var validationTarget = this._getValidationMessageTarget();
            this._validationMessage = this._createComponent(this._$validationMessage, Overlay, extend({
                integrationOptions: {},
                templatesRenderAsynchronously: false,
                target: validationTarget,
                shading: false,
                width: "auto",
                height: "auto",
                container: $element,
                position: this._getValidationMessagePosition("below"),
                closeOnOutsideClick: false,
                closeOnTargetScroll: false,
                animation: null,
                visible: true,
                propagateOutsideClick: true,
                _checkParentVisibility: false
            }, this._getInnerOptionsCache("validationTooltipOptions")));
            this._$validationMessage.toggleClass(INVALID_MESSAGE_AUTO, "auto" === validationMessageMode).toggleClass(INVALID_MESSAGE_ALWAYS, "always" === validationMessageMode);
            var messageId = "dx-" + new Guid;
            this._validationMessage.$content().addClass(INVALID_MESSAGE_CONTENT).attr("id", messageId);
            this.setAria("describedby", messageId);
            this._setValidationMessageMaxWidth();
            this._bindInnerWidgetOptions(this._validationMessage, "validationTooltipOptions")
        }
    },
    _setValidationMessageMaxWidth: function() {
        if (!this._validationMessage) {
            return
        }
        if (0 === this._getValidationMessageTarget().outerWidth()) {
            this._validationMessage.option("maxWidth", "100%");
            return
        }
        var validationMessageMaxWidth = Math.max(VALIDATION_MESSAGE_MIN_WIDTH, this._getValidationMessageTarget().outerWidth());
        this._validationMessage.option("maxWidth", validationMessageMaxWidth)
    },
    _getValidationMessageTarget: function() {
        return this.$element()
    },
    _getValidationMessagePosition: function(positionRequest) {
        var rtlEnabled = this.option("rtlEnabled"),
            messagePositionSide = getDefaultAlignment(rtlEnabled),
            messageOriginalOffset = this.option("validationMessageOffset"),
            messageOffset = {
                h: messageOriginalOffset.h,
                v: messageOriginalOffset.v
            },
            verticalPositions = "below" === positionRequest ? [" top", " bottom"] : [" bottom", " top"];
        if (rtlEnabled) {
            messageOffset.h = -messageOffset.h
        }
        if ("below" !== positionRequest) {
            messageOffset.v = -messageOffset.v
        }
        return {
            offset: messageOffset,
            boundary: this.option("validationBoundary"),
            my: messagePositionSide + verticalPositions[0],
            at: messagePositionSide + verticalPositions[1],
            collision: "none flip"
        }
    },
    _toggleReadOnlyState: function() {
        this.$element().toggleClass(READONLY_STATE_CLASS, !!this.option("readOnly"));
        this.setAria("readonly", this.option("readOnly") || void 0)
    },
    _dispose: function() {
        var element = this.$element()[0];
        dataUtils.data(element, VALIDATION_TARGET, null);
        clearTimeout(this.showValidationMessageTimeout);
        this.callBase()
    },
    _setSubmitElementName: function(name) {
        var $submitElement = this._getSubmitElement();
        if (!$submitElement) {
            return
        }
        if (name.length > 0) {
            $submitElement.attr("name", name)
        } else {
            $submitElement.removeAttr("name")
        }
    },
    _getSubmitElement: function() {
        return null
    },
    _optionChanged: function(args) {
        switch (args.name) {
            case "onValueChanged":
                this._createValueChangeAction();
                break;
            case "isValid":
            case "validationError":
            case "validationBoundary":
            case "validationMessageMode":
                this._renderValidationState();
                break;
            case "validationTooltipOptions":
                this._innerOptionChanged(this._validationMessage, args);
                break;
            case "readOnly":
                this._toggleReadOnlyState();
                this._refreshFocusState();
                break;
            case "value":
                if (!this._valueChangeActionSuppressed) {
                    this._raiseValueChangeAction(args.value, args.previousValue);
                    this._saveValueChangeEvent(void 0)
                }
                if (args.value != args.previousValue) {
                    this.validationRequest.fire({
                        value: args.value,
                        editor: this
                    })
                }
                break;
            case "width":
                this.callBase(args);
                this._setValidationMessageMaxWidth();
                break;
            case "name":
                this._setSubmitElementName(args.value);
                break;
            default:
                this.callBase(args)
        }
    },
    reset: function() {
        var defaultOptions = this._getDefaultOptions();
        this.option("value", defaultOptions.value)
    }
}).include(ValidationMixin);
module.exports = Editor;
