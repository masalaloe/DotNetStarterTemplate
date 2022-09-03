/**
 * DevExtreme (ui/scheduler/tooltip_strategies/desktopTooltipStrategy.js)
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
exports.DesktopTooltipStrategy = void 0;
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
var _renderer = require("../../../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _tooltipStrategyBase = require("./tooltipStrategyBase");
var _tooltip = require("../../tooltip");
var _tooltip2 = _interopRequireDefault(_tooltip);
var _translator = require("../../../animation/translator");
var _translator2 = _interopRequireDefault(_translator);
var _drag = require("../../../events/drag");
var _drag2 = _interopRequireDefault(_drag);
var _events_engine = require("../../../events/core/events_engine");
var _events_engine2 = _interopRequireDefault(_events_engine);
var _function_template = require("../../widget/function_template");
var _function_template2 = _interopRequireDefault(_function_template);
var _support = require("../../../core/utils/support");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
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

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function")
    }
}
var APPOINTMENT_TOOLTIP_WRAPPER_CLASS = "dx-scheduler-appointment-tooltip-wrapper";
var ALL_DAY_PANEL_APPOINTMENT_CLASS = "dx-scheduler-all-day-appointment";
var SCROLLABLE_WRAPPER_CLASS_NAME = ".dx-scheduler-date-table-scrollable .dx-scrollable-wrapper";
var MAX_TOOLTIP_HEIGHT = 200;
var TooltipBehaviorBase = function() {
    function TooltipBehaviorBase(scheduler, target) {
        _classCallCheck(this, TooltipBehaviorBase);
        this.scheduler = scheduler;
        this.target = target
    }
    _createClass(TooltipBehaviorBase, [{
        key: "onListItemRendered",
        value: function(e) {}
    }, {
        key: "onListItemClick",
        value: function(e) {}
    }, {
        key: "getItemListTemplateName",
        value: function() {
            return "appointmentTooltipTemplate"
        }
    }, {
        key: "getItemListDefaultTemplateName",
        value: function() {
            return "appointmentTooltip"
        }
    }, {
        key: "createFunctionTemplate",
        value: function(template, data, targetData, index) {
            return (0, _tooltipStrategyBase.createDefaultTooltipTemplate)(template, data, targetData, index)
        }
    }]);
    return TooltipBehaviorBase
}();
var TooltipSingleAppointmentBehavior = function(_TooltipBehaviorBase) {
    _inherits(TooltipSingleAppointmentBehavior, _TooltipBehaviorBase);

    function TooltipSingleAppointmentBehavior() {
        _classCallCheck(this, TooltipSingleAppointmentBehavior);
        return _possibleConstructorReturn(this, (TooltipSingleAppointmentBehavior.__proto__ || Object.getPrototypeOf(TooltipSingleAppointmentBehavior)).apply(this, arguments))
    }
    _createClass(TooltipSingleAppointmentBehavior, [{
        key: "onListItemClick",
        value: function(e) {
            this.scheduler.showAppointmentPopup(e.itemData.data, false, e.itemData.currentData)
        }
    }, {
        key: "canRaiseClickEvent",
        value: function() {
            return false
        }
    }]);
    return TooltipSingleAppointmentBehavior
}(TooltipBehaviorBase);
var TooltipManyAppointmentsBehavior = function(_TooltipBehaviorBase2) {
    _inherits(TooltipManyAppointmentsBehavior, _TooltipBehaviorBase2);

    function TooltipManyAppointmentsBehavior() {
        _classCallCheck(this, TooltipManyAppointmentsBehavior);
        return _possibleConstructorReturn(this, (TooltipManyAppointmentsBehavior.__proto__ || Object.getPrototypeOf(TooltipManyAppointmentsBehavior)).apply(this, arguments))
    }
    _createClass(TooltipManyAppointmentsBehavior, [{
        key: "onListItemRendered",
        value: function(e) {
            var _this3 = this;
            if (this.scheduler._allowDragging()) {
                var appData = e.itemData.data;
                _events_engine2.default.on(e.itemElement, _drag2.default.start, function(e) {
                    return _this3._onAppointmentDragStart(appData, appData.settings, e)
                });
                _events_engine2.default.on(e.itemElement, _drag2.default.move, function(e) {
                    return _this3._onAppointmentDragMove(e, appData.allDay)
                });
                _events_engine2.default.on(e.itemElement, _drag2.default.end, function() {
                    return _this3._onAppointmentDragEnd(appData)
                })
            }
        }
    }, {
        key: "canRaiseClickEvent",
        value: function() {
            return true
        }
    }, {
        key: "createFunctionTemplate",
        value: function(template, data, targetData, index) {
            if (this._isEmptyDropDownAppointmentTemplate()) {
                return _get(TooltipManyAppointmentsBehavior.prototype.__proto__ || Object.getPrototypeOf(TooltipManyAppointmentsBehavior.prototype), "createFunctionTemplate", this).call(this, template, data, targetData, index)
            }
            return new _function_template2.default(function(options) {
                return template.render({
                    model: data,
                    index: index,
                    container: options.container
                })
            })
        }
    }, {
        key: "getItemListTemplateName",
        value: function() {
            return this._isEmptyDropDownAppointmentTemplate() ? "appointmentTooltipTemplate" : "dropDownAppointmentTemplate"
        }
    }, {
        key: "getItemListDefaultTemplateName",
        value: function() {
            return this._isEmptyDropDownAppointmentTemplate() ? "appointmentTooltip" : "dropDownAppointment"
        }
    }, {
        key: "_isEmptyDropDownAppointmentTemplate",
        value: function() {
            return "dropDownAppointment" === this.scheduler.option("dropDownAppointmentTemplate")
        }
    }, {
        key: "_onAppointmentDragStart",
        value: function(itemData, settings, eventArgs) {
            var appointmentInstance = this.scheduler.getAppointmentsInstance(),
                appointmentIndex = appointmentInstance.option("items").length;
            settings[0].isCompact = false;
            settings[0].virtual = false;
            appointmentInstance._currentAppointmentSettings = settings;
            appointmentInstance._renderItem(appointmentIndex, {
                itemData: itemData,
                settings: settings
            });
            var $items = appointmentInstance._findItemElementByItem(itemData);
            $items.length > 0 && this._prepareDragItem($items, settings, eventArgs);
            this.scheduler.hideAppointmentTooltip()
        }
    }, {
        key: "_onAppointmentDragMove",
        value: function(eventArgs, allDay) {
            var coordinates = {
                left: this._startPosition.left + eventArgs.offset.x,
                top: this._startPosition.top + eventArgs.offset.y
            };
            this.scheduler.getAppointmentsInstance().notifyObserver("correctAppointmentCoordinates", {
                coordinates: coordinates,
                allDay: allDay,
                isFixedContainer: false,
                callback: function(result) {
                    if (result) {
                        coordinates = result
                    }
                }
            });
            _translator2.default.move(this._$draggedItem, coordinates)
        }
    }, {
        key: "_onAppointmentDragEnd",
        value: function(itemData) {
            _events_engine2.default.trigger(this._$draggedItem, _drag2.default.end);
            this._removeFakeAppointmentIfDragEndOnCurrentCell(itemData)
        }
    }, {
        key: "_removeFakeAppointmentIfDragEndOnCurrentCell",
        value: function(itemData) {
            var appointments = this.scheduler.getAppointmentsInstance(),
                newCellIndex = this.scheduler._workSpace.getDroppableCellIndex(),
                oldCellIndex = this.scheduler._workSpace.getCellIndexByCoordinates(this._startPosition);
            newCellIndex === oldCellIndex && appointments._clearItem({
                itemData: itemData
            })
        }
    }, {
        key: "_prepareDragItem",
        value: function($items, settings, eventArgs) {
            var dragContainerOffset = this._getDragContainerOffset();
            this._$draggedItem = $items.length > 1 ? this._getRecurrencePart($items, settings[0].startDate) : $items[0];
            var scrollTop = this._$draggedItem.hasClass(ALL_DAY_PANEL_APPOINTMENT_CLASS) ? this.scheduler._workSpace.getAllDayHeight() : this.scheduler._workSpace.getScrollableScrollTop();
            this._startPosition = {
                top: eventArgs.pageY - dragContainerOffset.top - this._$draggedItem.height() / 2 + scrollTop,
                left: eventArgs.pageX - dragContainerOffset.left - this._$draggedItem.width() / 2
            };
            _translator2.default.move(this._$draggedItem, this._startPosition);
            _events_engine2.default.trigger(this._$draggedItem, _drag2.default.start)
        }
    }, {
        key: "_getDragContainerOffset",
        value: function() {
            return this.scheduler._$element.find(SCROLLABLE_WRAPPER_CLASS_NAME).offset()
        }
    }, {
        key: "_getRecurrencePart",
        value: function(appointments, startDate) {
            var result = void 0;
            for (var i = 0; i < appointments.length; i++) {
                var $appointment = appointments[i],
                    appointmentStartDate = $appointment.data("dxAppointmentStartDate");
                if (appointmentStartDate.getTime() === startDate.getTime()) {
                    result = $appointment
                }
            }
            return result
        }
    }]);
    return TooltipManyAppointmentsBehavior
}(TooltipBehaviorBase);
var DesktopTooltipStrategy = exports.DesktopTooltipStrategy = function(_TooltipStrategyBase) {
    _inherits(DesktopTooltipStrategy, _TooltipStrategyBase);

    function DesktopTooltipStrategy(scheduler) {
        _classCallCheck(this, DesktopTooltipStrategy);
        var _this4 = _possibleConstructorReturn(this, (DesktopTooltipStrategy.__proto__ || Object.getPrototypeOf(DesktopTooltipStrategy)).call(this, scheduler));
        _this4.skipHidingOnScroll = false;
        return _this4
    }
    _createClass(DesktopTooltipStrategy, [{
        key: "_showCore",
        value: function(target, dataList, isSingleBehavior) {
            this.behavior = this._createBehavior(isSingleBehavior, target);
            _get(DesktopTooltipStrategy.prototype.__proto__ || Object.getPrototypeOf(DesktopTooltipStrategy.prototype), "_showCore", this).call(this, target, dataList, isSingleBehavior);
            this.tooltip.option("position", this._getTooltipPosition(dataList));
            this.list.focus();
            this.list.option("focusedElement", null)
        }
    }, {
        key: "_createBehavior",
        value: function(isSingleBehavior, target) {
            return isSingleBehavior ? new TooltipSingleAppointmentBehavior(this.scheduler, target) : new TooltipManyAppointmentsBehavior(this.scheduler, target)
        }
    }, {
        key: "_getTooltipPosition",
        value: function(dataList) {
            return {
                my: "bottom",
                at: "top",
                of: this.target,
                collision: "fit flipfit",
                boundary: this._getBoundary(dataList),
                offset: this.scheduler.option("_appointmentTooltipOffset")
            }
        }
    }, {
        key: "_getBoundary",
        value: function(dataList) {
            return this._isAppointmentInAllDayPanel(dataList[0].data) ? this.scheduler.$element() : this.scheduler.getWorkSpaceScrollableContainer()
        }
    }, {
        key: "_isAppointmentInAllDayPanel",
        value: function(appointmentData) {
            var workSpace = this.scheduler._workSpace,
                itTakesAllDay = this.scheduler.appointmentTakesAllDay(appointmentData);
            return itTakesAllDay && workSpace.supportAllDayRow() && workSpace.option("showAllDayPanel")
        }
    }, {
        key: "_createFunctionTemplate",
        value: function(template, data, targetData, index) {
            return this.behavior.createFunctionTemplate(template, data, targetData, index)
        }
    }, {
        key: "_getItemListTemplateName",
        value: function() {
            return this.behavior.getItemListTemplateName()
        }
    }, {
        key: "_getItemListDefaultTemplateName",
        value: function() {
            return this.behavior.getItemListDefaultTemplateName()
        }
    }, {
        key: "_createListOption",
        value: function(target, dataList) {
            var result = _get(DesktopTooltipStrategy.prototype.__proto__ || Object.getPrototypeOf(DesktopTooltipStrategy.prototype), "_createListOption", this).call(this, target, dataList);
            result.showScrollbar = _support.touch ? "always" : "onHover";
            return result
        }
    }, {
        key: "_createTooltip",
        value: function(target) {
            var _this5 = this;
            this.$tooltip = this._createTooltipElement();
            return this.scheduler._createComponent(this.$tooltip, _tooltip2.default, {
                target: target,
                onShowing: this._onTooltipShowing.bind(this),
                closeOnTargetScroll: function() {
                    return _this5.skipHidingOnScroll
                },
                maxHeight: MAX_TOOLTIP_HEIGHT,
                rtlEnabled: this.scheduler.option("rtlEnabled")
            })
        }
    }, {
        key: "dispose",
        value: function() {
            clearTimeout(this.skipHidingOnScrollTimeId)
        }
    }, {
        key: "_onTooltipShowing",
        value: function() {
            var _this6 = this;
            clearTimeout(this.skipHidingOnScrollTimeId);
            this.skipHidingOnScroll = true;
            this.skipHidingOnScrollTimeId = setTimeout(function() {
                _this6.skipHidingOnScroll = false;
                clearTimeout(_this6.skipHidingOnScrollTimeId)
            }, 0)
        }
    }, {
        key: "_createTooltipElement",
        value: function() {
            return (0, _renderer2.default)("<div>").appendTo(this.scheduler.$element()).addClass(APPOINTMENT_TOOLTIP_WRAPPER_CLASS)
        }
    }, {
        key: "_onListItemRendered",
        value: function(e) {
            this.behavior.onListItemRendered(e)
        }
    }, {
        key: "_canRaiseClickEvent",
        value: function() {
            return this.behavior.canRaiseClickEvent()
        }
    }]);
    return DesktopTooltipStrategy
}(_tooltipStrategyBase.TooltipStrategyBase);
