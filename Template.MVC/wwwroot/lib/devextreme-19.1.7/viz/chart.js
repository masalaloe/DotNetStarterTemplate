/**
 * DevExtreme (viz/chart.js)
 * Version: 19.1.7
 * Build date: Fri Oct 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _common = require("../core/utils/common");
var _extend2 = require("../core/utils/extend");
var _array = require("../core/utils/array");
var _iterator = require("../core/utils/iterator");
var _component_registrator = require("../core/component_registrator");
var _component_registrator2 = _interopRequireDefault(_component_registrator);
var _utils = require("./core/utils");
var _type = require("../core/utils/type");
var _math = require("../core/utils/math");
var _base_chart = require("./chart_components/base_chart");
var _layout_manager = require("./chart_components/layout_manager");
var _layout_manager2 = _interopRequireDefault(_layout_manager);
var _multi_axes_synchronizer = require("./chart_components/multi_axes_synchronizer");
var _multi_axes_synchronizer2 = _interopRequireDefault(_multi_axes_synchronizer);
var _advanced_chart = require("./chart_components/advanced_chart");
var _scroll_bar = require("./chart_components/scroll_bar");
var _scroll_bar2 = _interopRequireDefault(_scroll_bar);
var _crosshair = require("./chart_components/crosshair");
var _crosshair2 = _interopRequireDefault(_crosshair);
var _range_data_calculator = require("./series/helpers/range_data_calculator");
var _range_data_calculator2 = _interopRequireDefault(_range_data_calculator);
var _range = require("./translators/range");
var _range2 = _interopRequireDefault(_range);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        })
    } else {
        obj[key] = value
    }
    return obj
}
var DEFAULT_PANE_NAME = "default";
var VISUAL_RANGE = "VISUAL_RANGE";
var DEFAULT_PANES = [{
    name: DEFAULT_PANE_NAME,
    border: {}
}];
var _isArray = Array.isArray;

function getFirstAxisNameForPane(axes, paneName, defaultPane) {
    var result;
    for (var i = 0; i < axes.length; i++) {
        if (axes[i].pane === paneName || void 0 === axes[i].pane && paneName === defaultPane) {
            result = axes[i].name;
            break
        }
    }
    if (!result) {
        result = axes[0].name
    }
    return result
}

function changeVisibilityAxisGrids(axis, gridVisibility, minorGridVisibility) {
    var gridOpt = axis.getOptions().grid,
        minorGridOpt = axis.getOptions().minorGrid;
    gridOpt.visible = gridVisibility;
    minorGridOpt && (minorGridOpt.visible = minorGridVisibility)
}

function hideGridsOnNonFirstValueAxisForPane(axesForPane) {
    var axisShown = false,
        hiddenStubAxis = [],
        minorGridVisibility = axesForPane.some(function(axis) {
            var minorGridOptions = axis.getOptions().minorGrid;
            return minorGridOptions && minorGridOptions.visible
        }),
        gridVisibility = axesForPane.some(function(axis) {
            var gridOptions = axis.getOptions().grid;
            return gridOptions && gridOptions.visible
        });
    if (axesForPane.length > 1) {
        axesForPane.forEach(function(axis) {
            var gridOpt = axis.getOptions().grid;
            if (axisShown) {
                changeVisibilityAxisGrids(axis, false, false)
            } else {
                if (gridOpt && gridOpt.visible) {
                    if (axis.getTranslator().getBusinessRange().isEmpty()) {
                        changeVisibilityAxisGrids(axis, false, false);
                        hiddenStubAxis.push(axis)
                    } else {
                        axisShown = true;
                        changeVisibilityAxisGrids(axis, gridVisibility, minorGridVisibility)
                    }
                }
            }
        });
        !axisShown && hiddenStubAxis.length && changeVisibilityAxisGrids(hiddenStubAxis[0], gridVisibility, minorGridVisibility)
    }
}

function findAxisOptions(valueAxes, valueAxesOptions, axisName) {
    var result, axInd;
    for (axInd = 0; axInd < valueAxesOptions.length; axInd++) {
        if (valueAxesOptions[axInd].name === axisName) {
            result = valueAxesOptions[axInd];
            result.priority = axInd;
            break
        }
    }
    if (!result) {
        for (axInd = 0; axInd < valueAxes.length; axInd++) {
            if (valueAxes[axInd].name === axisName) {
                result = valueAxes[axInd].getOptions();
                result.priority = valueAxes[axInd].priority;
                break
            }
        }
    }
    return result
}

function findAxis(paneName, axisName, axes) {
    var axis, i;
    for (i = 0; i < axes.length; i++) {
        axis = axes[i];
        if (axis.name === axisName && axis.pane === paneName) {
            return axis
        }
    }
    if (paneName) {
        return findAxis(void 0, axisName, axes)
    }
}

function compareAxes(a, b) {
    return a.priority - b.priority
}

function doesPaneExist(panes, paneName) {
    var found = false;
    (0, _iterator.each)(panes, function(_, pane) {
        if (pane.name === paneName) {
            found = true;
            return false
        }
    });
    return found
}
var prepareSegmentRectPoints = function(left, top, width, height, borderOptions) {
    var maxSW = ~~((width < height ? width : height) / 2),
        sw = borderOptions.width || 0,
        newSW = sw < maxSW ? sw : maxSW;
    left += newSW / 2;
    top += newSW / 2;
    width -= newSW;
    height -= newSW;
    var segmentSequence, right = left + width,
        bottom = top + height,
        points = [],
        segments = [],
        visiblyOpt = 0,
        prevSegmentVisibility = 0;
    var allSegment = {
        top: [
            [left, top],
            [right, top]
        ],
        right: [
            [right, top],
            [right, bottom]
        ],
        bottom: [
            [right, bottom],
            [left, bottom]
        ],
        left: [
            [left, bottom],
            [left, top]
        ]
    };
    (0, _iterator.each)(allSegment, function(seg) {
        var visibility = !!borderOptions[seg];
        visiblyOpt = 2 * visiblyOpt + ~~visibility
    });
    switch (visiblyOpt) {
        case 13:
        case 9:
            segmentSequence = ["left", "top", "right", "bottom"];
            break;
        case 11:
            segmentSequence = ["bottom", "left", "top", "right"];
            break;
        default:
            segmentSequence = ["top", "right", "bottom", "left"]
    }(0, _iterator.each)(segmentSequence, function(_, seg) {
        var segmentVisibility = !!borderOptions[seg];
        if (!prevSegmentVisibility && segments.length) {
            points.push(segments);
            segments = []
        }
        if (segmentVisibility) {
            (0, _iterator.each)(allSegment[seg].slice(prevSegmentVisibility), function(_, segment) {
                segments = segments.concat(segment)
            })
        }
        prevSegmentVisibility = ~~segmentVisibility
    });
    segments.length && points.push(segments);
    1 === points.length && (points = points[0]);
    return {
        points: points,
        pathType: 15 === visiblyOpt ? "area" : "line"
    }
};

function accumulate(field, src1, src2, auxSpacing) {
    var val1 = src1[field] || 0,
        val2 = src2[field] || 0;
    return val1 + val2 + (val1 && val2 ? auxSpacing : 0)
}

function pickMax(field, src1, src2) {
    return pickMaxValue(src1[field], src2[field])
}

function pickMaxValue(val1, val2) {
    return Math.max(val1 || 0, val2 || 0)
}

function getAxisMargins(axis) {
    return axis.getMargins()
}

function getHorizontalAxesMargins(axes, getMarginsFunc) {
    return axes.reduce(function(margins, axis) {
        var axisMargins = getMarginsFunc(axis),
            paneMargins = margins.panes[axis.pane] = margins.panes[axis.pane] || {},
            spacing = axis.getMultipleAxesSpacing();
        paneMargins.top = accumulate("top", paneMargins, axisMargins, spacing);
        paneMargins.bottom = accumulate("bottom", paneMargins, axisMargins, spacing);
        paneMargins.left = pickMax("left", paneMargins, axisMargins);
        paneMargins.right = pickMax("right", paneMargins, axisMargins);
        margins.top = pickMax("top", paneMargins, margins);
        margins.bottom = pickMax("bottom", paneMargins, margins);
        margins.left = pickMax("left", paneMargins, margins);
        margins.right = pickMax("right", paneMargins, margins);
        return margins
    }, {
        panes: {}
    })
}

function getVerticalAxesMargins(axes) {
    return axes.reduce(function(margins, axis) {
        var axisMargins = axis.getMargins(),
            paneMargins = margins.panes[axis.pane] = margins.panes[axis.pane] || {},
            spacing = axis.getMultipleAxesSpacing();
        paneMargins.top = pickMax("top", paneMargins, axisMargins);
        paneMargins.bottom = pickMax("bottom", paneMargins, axisMargins);
        paneMargins.left = accumulate("left", paneMargins, axisMargins, spacing);
        paneMargins.right = accumulate("right", paneMargins, axisMargins, spacing);
        margins.top = pickMax("top", paneMargins, margins);
        margins.bottom = pickMax("bottom", paneMargins, margins);
        margins.left = pickMax("left", paneMargins, margins);
        margins.right = pickMax("right", paneMargins, margins);
        return margins
    }, {
        panes: {}
    })
}

function performActionOnAxes(axes, action, actionArgument1, actionArgument2, actionArgument3) {
    axes.forEach(function(axis) {
        axis[action](actionArgument1 && actionArgument1[axis.pane], actionArgument2 && actionArgument2[axis.pane] || actionArgument2, actionArgument3)
    })
}

function shrinkCanvases(isRotated, canvases, verticalMargins, horizontalMargins) {
    function getMargin(side, margins, pane) {
        var m = (isRotated ? ["left", "right"] : ["top", "bottom"]).indexOf(side) === -1 ? margins : margins.panes[pane] || {};
        return m[side]
    }

    function getMaxMargin(side, margins1, margins2, pane) {
        return pickMaxValue(getMargin(side, margins1, pane), getMargin(side, margins2, pane))
    }
    for (var pane in canvases) {
        canvases[pane].top = canvases[pane].originalTop + getMaxMargin("top", verticalMargins, horizontalMargins, pane);
        canvases[pane].bottom = canvases[pane].originalBottom + getMaxMargin("bottom", verticalMargins, horizontalMargins, pane);
        canvases[pane].left = canvases[pane].originalLeft + getMaxMargin("left", verticalMargins, horizontalMargins, pane);
        canvases[pane].right = canvases[pane].originalRight + getMaxMargin("right", verticalMargins, horizontalMargins, pane)
    }
    return canvases
}

function drawAxesWithTicks(axes, condition, canvases, panesBorderOptions) {
    if (condition) {
        performActionOnAxes(axes, "createTicks", canvases);
        _multi_axes_synchronizer2.default.synchronize(axes)
    }
    performActionOnAxes(axes, "draw", !condition && canvases, panesBorderOptions)
}

function shiftAxis(side1, side2) {
    var shifts = {};
    return function(axis) {
        var shift = shifts[axis.pane] = shifts[axis.pane] || {
                top: 0,
                left: 0,
                bottom: 0,
                right: 0
            },
            spacing = axis.getMultipleAxesSpacing(),
            margins = axis.getMargins();
        axis.shift(shift);
        shift[side1] = accumulate(side1, shift, margins, spacing);
        shift[side2] = accumulate(side2, shift, margins, spacing)
    }
}

function getCommonSize(side, margins) {
    var pane, paneMargins, size = 0;
    for (pane in margins.panes) {
        paneMargins = margins.panes[pane];
        size += "height" === side ? paneMargins.top + paneMargins.bottom : paneMargins.left + paneMargins.right
    }
    return size
}

function checkUsedSpace(sizeShortage, side, axes, getMarginFunc) {
    var size = 0;
    if (sizeShortage[side] > 0) {
        size = getCommonSize(side, getMarginFunc(axes, getAxisMargins));
        performActionOnAxes(axes, "hideTitle");
        sizeShortage[side] -= size - getCommonSize(side, getMarginFunc(axes, getAxisMargins))
    }
    if (sizeShortage[side] > 0) {
        performActionOnAxes(axes, "hideOuterElements")
    }
}

function axisAnimationEnabled(drawOptions, series) {
    var pointsCount = series.reduce(function(sum, s) {
        return sum += s.getPoints().length
    }, 0) / series.length;
    return drawOptions.animate && pointsCount <= drawOptions.animationPointsLimit
}
var dxChart = _advanced_chart.AdvancedChart.inherit({
    _themeSection: "chart",
    _fontFields: ["crosshair.label.font"],
    _setDeprecatedOptions: function() {
        this.callBase.apply(this, arguments);
        (0, _extend2.extend)(this._deprecatedOptions, {
            useAggregation: {
                since: "18.1",
                message: "Use the 'commonSeriesSettings.aggregation.enabled' or 'series.aggregation.enabled' option instead"
            },
            "argumentAxis.min": {
                since: "18.2",
                message: "Use the 'argumentAxis.visualRange' option instead"
            },
            "argumentAxis.max": {
                since: "18.2",
                message: "Use the 'argumentAxis.visualRange' option instead"
            },
            "valueAxis.min": {
                since: "18.2",
                message: "Use the 'valueAxis.visualRange' option instead"
            },
            "valueAxis.max": {
                since: "18.2",
                message: "Use the 'valueAxis.visualRange' option instead"
            },
            zoomingMode: {
                since: "18.2",
                message: "Use the 'zoomAndPan' option instead"
            },
            scrollingMode: {
                since: "18.2",
                message: "Use the 'zoomAndPan' option instead"
            }
        })
    },
    _partialOptionChangesMap: {
        visualRange: VISUAL_RANGE,
        _customVisualRange: VISUAL_RANGE,
        strips: "REFRESH_AXES",
        constantLines: "REFRESH_AXES"
    },
    _partialOptionChangesPath: {
        argumentAxis: ["strips", "constantLines", "visualRange", "_customVisualRange"],
        valueAxis: ["strips", "constantLines", "visualRange", "_customVisualRange"]
    },
    _initCore: function() {
        this.paneAxis = {};
        this._panesClipRects = {};
        this.callBase()
    },
    _disposeCore: function() {
        var that = this,
            disposeObjectsInArray = this._disposeObjectsInArray,
            panesClipRects = that._panesClipRects;
        that.callBase();
        disposeObjectsInArray.call(panesClipRects, "fixed");
        disposeObjectsInArray.call(panesClipRects, "base");
        disposeObjectsInArray.call(panesClipRects, "wide");
        that._panesClipRects = null
    },
    _correctAxes: function() {
        this._correctValueAxes(true)
    },
    _getExtraOptions: _common.noop,
    _cleanPanesClipRects: function(clipArrayName) {
        var that = this,
            clipArray = that._panesClipRects[clipArrayName];
        (0, _iterator.each)(clipArray || [], function(_, clipRect) {
            clipRect && clipRect.dispose()
        });
        that._panesClipRects[clipArrayName] = []
    },
    _createPanes: function() {
        var defaultPane, that = this,
            panes = that.option("panes"),
            panesNameCounter = 0;
        if (!panes || _isArray(panes) && !panes.length) {
            panes = DEFAULT_PANES
        }
        that._cleanPanesClipRects("fixed");
        that._cleanPanesClipRects("base");
        that._cleanPanesClipRects("wide");
        defaultPane = that.option("defaultPane");
        panes = (0, _extend2.extend)(true, [], _isArray(panes) ? panes : [panes]);
        (0, _iterator.each)(panes, function(_, pane) {
            pane.name = !(0, _type.isDefined)(pane.name) ? DEFAULT_PANE_NAME + panesNameCounter++ : pane.name
        });
        if ((0, _type.isDefined)(defaultPane)) {
            if (!doesPaneExist(panes, defaultPane)) {
                that._incidentOccurred("W2101", [defaultPane]);
                defaultPane = panes[panes.length - 1].name
            }
        } else {
            defaultPane = panes[panes.length - 1].name
        }
        that.defaultPane = defaultPane;
        panes = that._isRotated() ? panes.reverse() : panes;
        return panes
    },
    _getAxisRenderingOptions: function() {
        return {
            axisType: "xyAxes",
            drawingType: "linear"
        }
    },
    _prepareAxisOptions: function(typeSelector, userOptions, rotated) {
        return {
            isHorizontal: "argumentAxis" === typeSelector !== rotated,
            containerColor: this._themeManager.getOptions("containerBackgroundColor")
        }
    },
    _checkPaneName: function(seriesTheme) {
        var paneList = (0, _utils.map)(this.panes, function(pane) {
            return pane.name
        });
        seriesTheme.pane = seriesTheme.pane || this.defaultPane;
        return (0, _array.inArray)(seriesTheme.pane, paneList) !== -1
    },
    _getValueAxis: function(paneName, axisName) {
        var axisOptions, axis, that = this,
            valueAxes = that._valueAxes,
            valueAxisOptions = that.option("valueAxis") || {},
            valueAxesOptions = _isArray(valueAxisOptions) ? valueAxisOptions : [valueAxisOptions],
            rotated = that._isRotated(),
            crosshairMargins = that._getCrosshairMargins();
        axisName = axisName || getFirstAxisNameForPane(valueAxes, paneName, that.defaultPane);
        axis = findAxis(paneName, axisName, valueAxes);
        if (!axis) {
            axisOptions = findAxisOptions(valueAxes, valueAxesOptions, axisName);
            if (!axisOptions) {
                that._incidentOccurred("W2102", [axisName]);
                axisOptions = {
                    name: axisName,
                    priority: valueAxes.length
                }
            }
            axis = that._createAxis(false, that._populateAxesOptions("valueAxis", axisOptions, {
                pane: paneName,
                name: axisName,
                optionPath: _isArray(valueAxisOptions) ? "valueAxis[" + axisOptions.priority + "]" : "valueAxis",
                crosshairMargin: rotated ? crosshairMargins.y : crosshairMargins.x
            }, rotated));
            axis.applyVisualRangeSetter(that._getVisualRangeSetter());
            valueAxes.push(axis)
        }
        axis.setPane(paneName);
        return axis
    },
    _correctValueAxes: function(needHideGrids) {
        var that = this,
            synchronizeMultiAxes = that._themeManager.getOptions("synchronizeMultiAxes"),
            valueAxes = that._valueAxes,
            paneWithAxis = {};
        that.series.forEach(function(series) {
            var axis = series.getValueAxis();
            paneWithAxis[axis.pane] = true
        });
        that.panes.forEach(function(pane) {
            var paneName = pane.name;
            if (!paneWithAxis[paneName]) {
                that._getValueAxis(paneName)
            }
            if (needHideGrids && synchronizeMultiAxes) {
                hideGridsOnNonFirstValueAxisForPane(valueAxes.filter(function(axis) {
                    return axis.pane === paneName
                }))
            }
        });
        that._valueAxes = valueAxes.filter(function(axis) {
            if (!axis.pane) {
                axis.setPane(that.defaultPane)
            }
            return doesPaneExist(that.panes, axis.pane)
        }).sort(compareAxes);
        var defaultAxis = this.getValueAxis();
        that._valueAxes.forEach(function(axis) {
            var optionPath = axis.getOptions().optionPath;
            if (optionPath) {
                var axesWithSamePath = that._valueAxes.filter(function(a) {
                    return a.getOptions().optionPath === optionPath
                });
                if (axesWithSamePath.length > 1) {
                    if (axesWithSamePath.some(function(a) {
                            return a === defaultAxis
                        })) {
                        axesWithSamePath.forEach(function(a) {
                            if (a !== defaultAxis) {
                                a.getOptions().optionPath = null
                            }
                        })
                    } else {
                        axesWithSamePath.forEach(function(a, i) {
                            if (0 !== i) {
                                a.getOptions().optionPath = null
                            }
                        })
                    }
                }
            }
        })
    },
    _getSeriesForPane: function(paneName) {
        var paneSeries = [];
        (0, _iterator.each)(this.series, function(_, oneSeries) {
            if (oneSeries.pane === paneName) {
                paneSeries.push(oneSeries)
            }
        });
        return paneSeries
    },
    _createPanesBorderOptions: function() {
        var commonBorderOptions = this._themeManager.getOptions("commonPaneSettings").border,
            panesBorderOptions = {};
        this.panes.forEach(function(pane) {
            return panesBorderOptions[pane.name] = (0, _extend2.extend)(true, {}, commonBorderOptions, pane.border)
        });
        return panesBorderOptions
    },
    _createScrollBar: function() {
        var that = this,
            scrollBarOptions = that._themeManager.getOptions("scrollBar") || {},
            scrollBarGroup = that._scrollBarGroup;
        if (scrollBarOptions.visible) {
            scrollBarOptions.rotated = that._isRotated();
            that._scrollBar = (that._scrollBar || new _scroll_bar2.default.ScrollBar(that._renderer, scrollBarGroup)).update(scrollBarOptions)
        } else {
            scrollBarGroup.linkRemove();
            that._scrollBar && that._scrollBar.dispose();
            that._scrollBar = null
        }
    },
    _prepareToRender: function(drawOptions) {
        var panesBorderOptions = this._createPanesBorderOptions();
        this._createPanesBackground();
        this._appendAxesGroups();
        this._adjustViewport();
        return panesBorderOptions
    },
    _adjustViewport: function() {
        var that = this;
        var series = that._getVisibleSeries();
        var argumentAxis = that.getArgumentAxis();
        var useAggregation = series.some(function(s) {
            return s.useAggregation()
        });
        var adjustOnZoom = that._themeManager.getOptions("adjustOnZoom");
        var alignToBounds = !argumentAxis.dataVisualRangeIsReduced();
        if (!useAggregation && !adjustOnZoom) {
            return
        }
        that._valueAxes.forEach(function(axis) {
            return axis.adjust(alignToBounds)
        })
    },
    _recreateSizeDependentObjects: function(isCanvasChanged) {
        var that = this,
            series = that._getVisibleSeries(),
            useAggregation = series.some(function(s) {
                return s.useAggregation()
            }),
            zoomChanged = that._isZooming();
        if (!useAggregation) {
            return
        }
        that._argumentAxes.forEach(function(axis) {
            axis.updateCanvas(that._canvas)
        });
        series.forEach(function(series) {
            if (series.useAggregation() && (isCanvasChanged || zoomChanged || !series._useAllAggregatedPoints)) {
                series.createPoints()
            }
        });
        that._processSeriesFamilies()
    },
    _isZooming: function() {
        var that = this;
        var argumentAxis = that.getArgumentAxis();
        if (!argumentAxis || !argumentAxis.getTranslator()) {
            return false
        }
        var businessRange = argumentAxis.getTranslator().getBusinessRange();
        var zoomRange = argumentAxis.getViewport();
        var min = zoomRange ? zoomRange.min : 0;
        var max = zoomRange ? zoomRange.max : 0;
        if ("logarithmic" === businessRange.axisType) {
            min = (0, _utils.getLog)(min, businessRange.base);
            max = (0, _utils.getLog)(max, businessRange.base)
        }
        var viewportDistance = "discrete" === businessRange.axisType ? (0, _utils.getCategoriesInfo)(businessRange.categories, min, max).categories.length : Math.abs(max - min);
        var precision = (0, _math.getPrecision)(viewportDistance);
        precision = precision > 1 ? Math.pow(10, precision - 2) : 1;
        var zoomChanged = Math.round((that._zoomLength - viewportDistance) * precision) / precision !== 0;
        that._zoomLength = viewportDistance;
        return zoomChanged
    },
    _handleSeriesDataUpdated: function() {
        var that = this,
            viewport = new _range2.default.Range;
        that.series.forEach(function(s) {
            viewport.addRange(s.getArgumentRange())
        });
        that._argumentAxes.forEach(function(axis) {
            axis.updateCanvas(that._canvas);
            axis.setBusinessRange(viewport, that._axesReinitialized)
        });
        that.callBase()
    },
    _isLegendInside: function() {
        return this._legend && "inside" === this._legend.getPosition()
    },
    _isRotated: function() {
        return this._themeManager.getOptions("rotated")
    },
    _getLayoutTargets: function() {
        return this.panes
    },
    _applyClipRects: function(panesBorderOptions) {
        var i, that = this,
            canvasClipRectID = that._getCanvasClipRectID();
        that._drawPanesBorders(panesBorderOptions);
        that._createClipRectsForPanes();
        for (i = 0; i < that._argumentAxes.length; i++) {
            that._argumentAxes[i].applyClipRects(that._getElementsClipRectID(that._argumentAxes[i].pane), canvasClipRectID)
        }
        for (i = 0; i < that._valueAxes.length; i++) {
            that._valueAxes[i].applyClipRects(that._getElementsClipRectID(that._valueAxes[i].pane), canvasClipRectID)
        }
        that._fillPanesBackground()
    },
    _updateLegendPosition: function(drawOptions, legendHasInsidePosition) {
        var that = this;
        if (drawOptions.drawLegend && that._legend && legendHasInsidePosition) {
            var panes = that.panes,
                newCanvas = (0, _extend2.extend)({}, panes[0].canvas),
                layoutManager = new _layout_manager2.default.LayoutManager;
            newCanvas.right = panes[panes.length - 1].canvas.right;
            newCanvas.bottom = panes[panes.length - 1].canvas.bottom;
            layoutManager.setOptions({
                width: 0,
                height: 0
            });
            layoutManager.layoutElements([that._legend], newCanvas, _common.noop, [{
                canvas: newCanvas
            }], void 0)
        }
    },
    _allowLegendInsidePosition: function() {
        return true
    },
    _applyExtraSettings: function(series) {
        var that = this,
            paneIndex = that._getPaneIndex(series.pane),
            panesClipRects = that._panesClipRects,
            wideClipRect = panesClipRects.wide[paneIndex];
        series.setClippingParams(panesClipRects.base[paneIndex].id, wideClipRect && wideClipRect.id, that._getPaneBorderVisibility(paneIndex))
    },
    _updatePanesCanvases: function(drawOptions) {
        if (!drawOptions.recreateCanvas) {
            return
        }(0, _utils.updatePanesCanvases)(this.panes, this._canvas, this._isRotated())
    },
    _renderScaleBreaks: function() {
        this._valueAxes.concat(this._argumentAxes).forEach(function(axis) {
            axis.drawScaleBreaks()
        })
    },
    _applyPointMarkersAutoHiding: function() {
        var that = this;
        if (!that._themeManager.getOptions("autoHidePointMarkers")) {
            that.series.forEach(function(s) {
                return s.autoHidePointMarkers = false
            });
            return
        }
        that.panes.forEach(function(pane) {
            var series = that.series.filter(function(s) {
                return s.pane === pane.name && s.usePointsToDefineAutoHiding()
            });
            var argAxis = that.getArgumentAxis();
            var argVisualRange = argAxis.visualRange();
            var argTranslator = argAxis.getTranslator();
            var argAxisType = argAxis.getOptions().type;
            var argViewPortFilter = _range_data_calculator2.default.getViewPortFilter(argVisualRange || {});
            var points = [];
            var overloadedSeries = {};
            series.forEach(function(s) {
                var valAxis = s.getValueAxis();
                var valVisualRange = valAxis.visualRange();
                var valTranslator = valAxis.getTranslator();
                var seriesIndex = that.series.indexOf(s);
                var valViewPortFilter = _range_data_calculator2.default.getViewPortFilter(valVisualRange || {});
                overloadedSeries[seriesIndex] = {};
                series.forEach(function(sr) {
                    return overloadedSeries[seriesIndex][that.series.indexOf(sr)] = 0
                });
                var seriesPoints = [];
                s.getPoints().filter(function(p) {
                    return p.getOptions().visible && argViewPortFilter(p.argument) && (valViewPortFilter(p.getMinValue(true)) || valViewPortFilter(p.getMaxValue(true)))
                }).forEach(function(p) {
                    var tp = {
                        seriesIndex: seriesIndex,
                        argument: p.argument,
                        value: p.getMaxValue(true),
                        size: p.bubbleSize || p.getOptions().size
                    };
                    if (p.getMinValue(true) !== p.getMaxValue(true)) {
                        var mp = (0, _extend2.extend)({}, tp);
                        mp.value = p.getMinValue(true);
                        mp.x = argTranslator.to(mp.argument, 1);
                        mp.y = valTranslator.to(mp.value, 1);
                        seriesPoints.push(mp)
                    }
                    tp.x = argTranslator.to(tp.argument, 1);
                    tp.y = valTranslator.to(tp.value, 1);
                    seriesPoints.push(tp)
                });
                overloadedSeries[seriesIndex].pointsCount = seriesPoints.length;
                overloadedSeries[seriesIndex].total = 0;
                overloadedSeries[seriesIndex].continuousSeries = 0;
                points = points.concat(seriesPoints)
            });
            var sortingCallback = "discrete" === argAxisType ? function(p1, p2) {
                return argVisualRange.categories.indexOf(p1.argument) - argVisualRange.categories.indexOf(p2.argument)
            } : function(p1, p2) {
                return p1.argument - p2.argument
            };
            points.sort(sortingCallback);
            var isContinuousSeries = false;
            for (var i = 0; i < points.length - 1; i++) {
                var curPoint = points[i];
                var size = curPoint.size;
                if ((0, _type.isDefined)(curPoint.x) && (0, _type.isDefined)(curPoint.y)) {
                    for (var j = i + 1; j < points.length; j++) {
                        var nextPoint = points[j];
                        var next_x = (0, _type.isDefined)(nextPoint) ? nextPoint.x : null;
                        var next_y = (0, _type.isDefined)(nextPoint) ? nextPoint.y : null;
                        if (!(0, _type.isDefined)(next_x) || Math.abs(curPoint.x - next_x) >= size) {
                            isContinuousSeries &= j !== i + 1;
                            break
                        } else {
                            var distance = (0, _type.isDefined)(next_x) && (0, _type.isDefined)(next_y) && Math.sqrt(Math.pow(curPoint.x - next_x, 2) + Math.pow(curPoint.y - next_y, 2));
                            if (distance && distance < size) {
                                overloadedSeries[curPoint.seriesIndex][nextPoint.seriesIndex]++;
                                overloadedSeries[curPoint.seriesIndex].total++;
                                if (!isContinuousSeries) {
                                    overloadedSeries[curPoint.seriesIndex].continuousSeries++;
                                    isContinuousSeries = true
                                }
                            }
                        }
                    }
                }
            }
            series.forEach(function(s) {
                var seriesIndex = that.series.indexOf(s);
                s.autoHidePointMarkers = false;
                var tickCount = argAxis.getTicksValues().majorTicksValues.length;
                if (s.autoHidePointMarkersEnabled() && ("discrete" === argAxisType || overloadedSeries[seriesIndex].pointsCount > tickCount)) {
                    for (var index in overloadedSeries[seriesIndex]) {
                        var _i = parseInt(index);
                        if (isNaN(_i) || overloadedSeries[seriesIndex].total / overloadedSeries[seriesIndex].continuousSeries < 3) {
                            continue
                        }
                        if (_i === seriesIndex) {
                            if (2 * overloadedSeries[_i][_i] >= overloadedSeries[_i].pointsCount) {
                                s.autoHidePointMarkers = true;
                                break
                            }
                        } else {
                            if (overloadedSeries[seriesIndex].total >= overloadedSeries[seriesIndex].pointsCount) {
                                s.autoHidePointMarkers = true;
                                break
                            }
                        }
                    }
                }
            })
        })
    },
    _renderAxes: function(drawOptions, panesBorderOptions) {
        function calculateTitlesWidth(axes) {
            return axes.map(function(axis) {
                if (!axis.getTitle) {
                    return 0
                }
                var title = axis.getTitle();
                return title ? title.bBox.width : 0
            })
        }
        var that = this,
            rotated = that._isRotated(),
            synchronizeMultiAxes = that._themeManager.getOptions("synchronizeMultiAxes"),
            extendedArgAxes = (that._scrollBar ? [that._scrollBar] : []).concat(that._argumentAxes),
            verticalAxes = rotated ? extendedArgAxes : that._valueAxes,
            horizontalAxes = rotated ? that._valueAxes : extendedArgAxes,
            allAxes = verticalAxes.concat(horizontalAxes);
        that._updatePanesCanvases(drawOptions);
        var panesCanvases = that.panes.reduce(function(canvases, pane) {
                canvases[pane.name] = (0, _extend2.extend)({}, pane.canvas);
                return canvases
            }, {}),
            cleanPanesCanvases = (0, _extend2.extend)(true, {}, panesCanvases);
        if (!drawOptions.adjustAxes) {
            drawAxesWithTicks(verticalAxes, !rotated && synchronizeMultiAxes, panesCanvases, panesBorderOptions);
            drawAxesWithTicks(horizontalAxes, rotated && synchronizeMultiAxes, panesCanvases, panesBorderOptions);
            performActionOnAxes(allAxes, "prepareAnimation");
            that._renderScaleBreaks();
            return false
        }
        if (that._scrollBar) {
            that._scrollBar.setPane(that.panes)
        }
        var vAxesMargins = {
                panes: {}
            },
            hAxesMargins = getHorizontalAxesMargins(horizontalAxes, function(axis) {
                return axis.estimateMargins(panesCanvases[axis.pane])
            });
        panesCanvases = shrinkCanvases(rotated, panesCanvases, vAxesMargins, hAxesMargins);
        drawAxesWithTicks(verticalAxes, !rotated && synchronizeMultiAxes, panesCanvases, panesBorderOptions);
        vAxesMargins = getVerticalAxesMargins(verticalAxes);
        panesCanvases = shrinkCanvases(rotated, panesCanvases, vAxesMargins, hAxesMargins);
        drawAxesWithTicks(horizontalAxes, rotated && synchronizeMultiAxes, panesCanvases, panesBorderOptions);
        hAxesMargins = getHorizontalAxesMargins(horizontalAxes, getAxisMargins);
        panesCanvases = shrinkCanvases(rotated, panesCanvases, vAxesMargins, hAxesMargins);
        var oldTitlesWidth = calculateTitlesWidth(verticalAxes);
        performActionOnAxes(allAxes, "updateSize", panesCanvases, axisAnimationEnabled(drawOptions, that._getVisibleSeries()));
        horizontalAxes.forEach(shiftAxis("top", "bottom"));
        verticalAxes.forEach(shiftAxis("left", "right"));
        that._renderScaleBreaks();
        that.panes.forEach(function(pane) {
            (0, _extend2.extend)(pane.canvas, panesCanvases[pane.name])
        });
        that._valueAxes.forEach(function(axis) {
            axis.setInitRange()
        });
        verticalAxes.forEach(function(axis, i) {
            if (axis.hasWrap && axis.hasWrap()) {
                var title = axis.getTitle();
                var newTitleWidth = title ? title.bBox.width : 0;
                var offset = newTitleWidth - oldTitlesWidth[i];
                if ("right" === axis.getOptions().position) {
                    vAxesMargins.right += offset
                } else {
                    vAxesMargins.left += offset;
                    that.panes.forEach(function(_ref) {
                        var name = _ref.name;
                        return vAxesMargins.panes[name].left += offset
                    })
                }
                panesCanvases = shrinkCanvases(rotated, panesCanvases, vAxesMargins, hAxesMargins);
                performActionOnAxes(allAxes, "updateSize", panesCanvases, false, false);
                oldTitlesWidth = calculateTitlesWidth(verticalAxes)
            }
        });
        return cleanPanesCanvases
    },
    _shrinkAxes: function(sizeShortage, panesCanvases) {
        if (!sizeShortage || !panesCanvases) {
            return
        }
        this._renderer.stopAllAnimations(true);
        var that = this,
            rotated = that._isRotated(),
            extendedArgAxes = (that._scrollBar ? [that._scrollBar] : []).concat(that._argumentAxes),
            verticalAxes = rotated ? extendedArgAxes : that._valueAxes,
            horizontalAxes = rotated ? that._valueAxes : extendedArgAxes,
            allAxes = verticalAxes.concat(horizontalAxes);
        if (sizeShortage.width || sizeShortage.height) {
            checkUsedSpace(sizeShortage, "height", horizontalAxes, getHorizontalAxesMargins);
            checkUsedSpace(sizeShortage, "width", verticalAxes, getVerticalAxesMargins);
            performActionOnAxes(allAxes, "updateSize", panesCanvases);
            panesCanvases = shrinkCanvases(rotated, panesCanvases, getVerticalAxesMargins(verticalAxes), getHorizontalAxesMargins(horizontalAxes, getAxisMargins));
            performActionOnAxes(allAxes, "updateSize", panesCanvases);
            horizontalAxes.forEach(shiftAxis("top", "bottom"));
            verticalAxes.forEach(shiftAxis("left", "right"));
            that.panes.forEach(function(pane) {
                (0, _extend2.extend)(pane.canvas, panesCanvases[pane.name])
            })
        }
    },
    _getPanesParameters: function() {
        var i, that = this,
            panes = that.panes,
            params = [];
        for (i = 0; i < panes.length; i++) {
            if (that._getPaneBorderVisibility(i)) {
                params.push({
                    coords: panes[i].borderCoords,
                    clipRect: that._panesClipRects.fixed[i]
                })
            }
        }
        return params
    },
    _createCrosshairCursor: function() {
        var that = this,
            options = that._themeManager.getOptions("crosshair") || {},
            argumentAxis = that.getArgumentAxis(),
            axes = !that._isRotated() ? [
                [argumentAxis], that._valueAxes
            ] : [that._valueAxes, [argumentAxis]],
            parameters = {
                canvas: that._getCommonCanvas(),
                panes: that._getPanesParameters(),
                axes: axes
            };
        if (!options || !options.enabled) {
            return
        }
        if (!that._crosshair) {
            that._crosshair = new _crosshair2.default.Crosshair(that._renderer, options, parameters, that._crosshairCursorGroup)
        } else {
            that._crosshair.update(options, parameters)
        }
        that._crosshair.render()
    },
    _getCommonCanvas: function() {
        var i, canvas, commonCanvas, panes = this.panes;
        for (i = 0; i < panes.length; i++) {
            canvas = panes[i].canvas;
            if (!commonCanvas) {
                commonCanvas = (0, _extend2.extend)({}, canvas)
            } else {
                commonCanvas.right = canvas.right;
                commonCanvas.bottom = canvas.bottom
            }
        }
        return commonCanvas
    },
    _createPanesBackground: function() {
        var backgroundColor, rect, i, that = this,
            defaultBackgroundColor = that._themeManager.getOptions("commonPaneSettings").backgroundColor,
            renderer = that._renderer,
            rects = [];
        that._panesBackgroundGroup.clear();
        for (i = 0; i < that.panes.length; i++) {
            backgroundColor = that.panes[i].backgroundColor || defaultBackgroundColor;
            if (!backgroundColor || "none" === backgroundColor) {
                rects.push(null);
                continue
            }
            rect = renderer.rect(0, 0, 0, 0).attr({
                fill: backgroundColor,
                "stroke-width": 0
            }).append(that._panesBackgroundGroup);
            rects.push(rect)
        }
        that.panesBackground = rects
    },
    _fillPanesBackground: function() {
        var bc, that = this;
        (0, _iterator.each)(that.panes, function(i, pane) {
            bc = pane.borderCoords;
            if (null !== that.panesBackground[i]) {
                that.panesBackground[i].attr({
                    x: bc.left,
                    y: bc.top,
                    width: bc.width,
                    height: bc.height
                })
            }
        })
    },
    _calcPaneBorderCoords: function(pane) {
        var canvas = pane.canvas,
            bc = pane.borderCoords = pane.borderCoords || {};
        bc.left = canvas.left;
        bc.top = canvas.top;
        bc.right = canvas.width - canvas.right;
        bc.bottom = canvas.height - canvas.bottom;
        bc.width = Math.max(bc.right - bc.left, 0);
        bc.height = Math.max(bc.bottom - bc.top, 0)
    },
    _drawPanesBorders: function(panesBorderOptions) {
        var that = this,
            rotated = that._isRotated();
        that._panesBorderGroup.linkRemove().clear();
        (0, _iterator.each)(that.panes, function(i, pane) {
            var bc, segmentRectParams, borderOptions = panesBorderOptions[pane.name],
                attr = {
                    fill: "none",
                    stroke: borderOptions.color,
                    "stroke-opacity": borderOptions.opacity,
                    "stroke-width": borderOptions.width,
                    dashStyle: borderOptions.dashStyle,
                    "stroke-linecap": "square"
                };
            that._calcPaneBorderCoords(pane, rotated);
            if (!borderOptions.visible) {
                return
            }
            bc = pane.borderCoords;
            segmentRectParams = prepareSegmentRectPoints(bc.left, bc.top, bc.width, bc.height, borderOptions);
            that._renderer.path(segmentRectParams.points, segmentRectParams.pathType).attr(attr).append(that._panesBorderGroup)
        });
        that._panesBorderGroup.linkAppend()
    },
    _createClipRect: function(clipArray, index, left, top, width, height) {
        var that = this,
            clipRect = clipArray[index];
        if (!clipRect) {
            clipRect = that._renderer.clipRect(left, top, width, height);
            clipArray[index] = clipRect
        } else {
            clipRect.attr({
                x: left,
                y: top,
                width: width,
                height: height
            })
        }
    },
    _createClipRectsForPanes: function() {
        var that = this,
            canvas = that._canvas;
        (0, _iterator.each)(that.panes, function(i, pane) {
            var needWideClipRect = false,
                bc = pane.borderCoords,
                left = bc.left,
                top = bc.top,
                width = bc.width,
                height = bc.height,
                panesClipRects = that._panesClipRects;
            that._createClipRect(panesClipRects.fixed, i, left, top, width, height);
            that._createClipRect(panesClipRects.base, i, left, top, width, height);
            (0, _iterator.each)(that.series, function(_, series) {
                if (series.pane === pane.name && (series.isFinancialSeries() || series.areErrorBarsVisible())) {
                    needWideClipRect = true
                }
            });
            if (needWideClipRect) {
                if (that._isRotated()) {
                    top = 0;
                    height = canvas.height
                } else {
                    left = 0;
                    width = canvas.width
                }
                that._createClipRect(panesClipRects.wide, i, left, top, width, height)
            } else {
                panesClipRects.wide[i] = null
            }
        })
    },
    _getPaneIndex: function(paneName) {
        var paneIndex;
        (0, _iterator.each)(this.panes, function(index, pane) {
            if (pane.name === paneName) {
                paneIndex = index;
                return false
            }
        });
        return paneIndex
    },
    _getPaneBorderVisibility: function(paneIndex) {
        var commonPaneBorderVisible = this._themeManager.getOptions("commonPaneSettings").border.visible,
            pane = this.panes[paneIndex] || {},
            paneBorder = pane.border || {};
        return "visible" in paneBorder ? paneBorder.visible : commonPaneBorderVisible
    },
    _getElementsClipRectID: function(paneName) {
        return this._panesClipRects.fixed[this._getPaneIndex(paneName)].id
    },
    _getCanvasForPane: function(paneName) {
        var i, panes = this.panes,
            panesNumber = panes.length;
        for (i = 0; i < panesNumber; i++) {
            if (panes[i].name === paneName) {
                return panes[i].canvas
            }
        }
    },
    _getTrackerSettings: function() {
        var that = this,
            themeManager = that._themeManager;
        return (0, _extend2.extend)(this.callBase(), {
            chart: that,
            rotated: that._isRotated(),
            crosshair: that._getCrosshairOptions().enabled ? that._crosshair : null,
            stickyHovering: themeManager.getOptions("stickyHovering")
        })
    },
    _resolveLabelOverlappingStack: function() {
        var that = this,
            isRotated = that._isRotated(),
            shiftDirection = isRotated ? function(box, length) {
                return {
                    x: box.x - length,
                    y: box.y
                }
            } : function(box, length) {
                return {
                    x: box.x,
                    y: box.y - length
                }
            };
        (0, _iterator.each)(that._getStackPoints(), function(_, stacks) {
            (0, _iterator.each)(stacks, function(_, points) {
                _base_chart.overlapping.resolveLabelOverlappingInOneDirection(points, that._getCommonCanvas(), isRotated, shiftDirection, function(a, b) {
                    var coordPosition = isRotated ? 1 : 0;
                    var figureCenter1 = a.labels[0].getFigureCenter()[coordPosition];
                    var figureCenter12 = b.labels[0].getFigureCenter()[coordPosition];
                    if (figureCenter1 - figureCenter12 === 0) {
                        return (a.value() - b.value()) * (a.labels[0].getPoint().series.getValueAxis().getTranslator().isInverted() ? -1 : 1)
                    }
                    return 0
                })
            })
        })
    },
    _getStackPoints: function() {
        var stackPoints = {},
            visibleSeries = this._getVisibleSeries();
        (0, _iterator.each)(visibleSeries, function(_, singleSeries) {
            var points = singleSeries.getPoints(),
                stackName = singleSeries.getStackName() || null;
            (0, _iterator.each)(points, function(_, point) {
                var argument = point.argument;
                if (!stackPoints[argument]) {
                    stackPoints[argument] = {}
                }
                if (!stackPoints[argument][stackName]) {
                    stackPoints[argument][stackName] = []
                }
                stackPoints[argument][stackName].push(point)
            })
        });
        return stackPoints
    },
    _getCrosshairOptions: function() {
        return this._getOption("crosshair")
    },
    _parseVisualRangeOption: function(fullName, value) {
        var that = this;
        var name = fullName.split(/[.[]/)[0];
        var index = fullName.match(/\d+/g);
        if (fullName.indexOf("visualRange") > 0) {
            that._setCustomVisualRange("argumentAxis" === name, (0, _type.isDefined)(index) ? parseInt(index[0]) : index, value)
        } else {
            if (("object" === (0, _type.type)(value) || "array" === (0, _type.type)(value)) && name.indexOf("Axis") > 0 && JSON.stringify(value).indexOf("visualRange") > 0) {
                if ((0, _type.isDefined)(value.visualRange)) {
                    that._setCustomVisualRange("argumentAxis" === name, (0, _type.isDefined)(index) ? parseInt(index[0]) : index, value.visualRange)
                } else {
                    if (_isArray(value)) {
                        value.forEach(function(a, i) {
                            return that._setCustomVisualRange("argumentAxis" === name, i, a.visualRange)
                        })
                    }
                }
            }
        }
    },
    _setCustomVisualRange: function(isArgumentAxis, index, value) {
        var that = this;
        var axesName = isArgumentAxis ? "argumentAxis" : "valueAxis";
        var options = that._options[axesName];
        if (!options) {
            return
        }
        if (isArgumentAxis || !(0, _type.isDefined)(index)) {
            options._customVisualRange = value
        } else {
            options[index]._customVisualRange = value
        }
        that._axesReinitialized = true
    },
    zoomArgument: function(min, max) {
        var that = this;
        if (!that._initialized || !(0, _type.isDefined)(min) && !(0, _type.isDefined)(max)) {
            return
        }
        that.getArgumentAxis().visualRange([min, max])
    },
    resetVisualRange: function() {
        var that = this;
        that._argumentAxes.forEach(function(axis) {
            axis.resetVisualRange(that.getArgumentAxis() !== axis)
        });
        that._valueAxes.forEach(function(axis) {
            return axis.resetVisualRange(false)
        });
        that._requestChange([VISUAL_RANGE])
    },
    _getVisualRangeSetter: function() {
        var chart = this;
        return function(axis, _ref2) {
            var skipEventRising = _ref2.skipEventRising,
                range = _ref2.range;
            if (axis.getOptions().optionPath) {
                chart._parseVisualRangeOption(axis.getOptions().optionPath + ".visualRange", range);
                axis.setCustomVisualRange(range)
            }
            axis.skipEventRising = skipEventRising;
            if (axis.isArgumentAxis) {
                if (axis !== chart.getArgumentAxis()) {
                    return
                }
                chart._argumentAxes.filter(function(a) {
                    return a !== axis
                }).forEach(function(a) {
                    return a.visualRange(range, {
                        start: true,
                        end: true
                    })
                })
            }
            if (chart._applyingChanges) {
                chart._change_VISUAL_RANGE()
            } else {
                chart._requestChange([VISUAL_RANGE])
            }
        }
    },
    getVisibleArgumentBounds: function() {
        var translator = this._argumentAxes[0].getTranslator(),
            range = translator.getBusinessRange(),
            isDiscrete = "discrete" === range.axisType,
            categories = range.categories;
        return {
            minVisible: isDiscrete ? range.minVisible || categories[0] : range.minVisible,
            maxVisible: isDiscrete ? range.maxVisible || categories[categories.length - 1] : range.maxVisible
        }
    },
    _change_VISUAL_RANGE: function() {
        var that = this;
        that._recreateSizeDependentObjects(false);
        if (!that._changes.has("FULL_RENDER")) {
            that._doRender({
                force: true,
                drawTitle: false,
                drawLegend: false,
                adjustAxes: this.option("adjustAxesOnZoom") || false,
                animate: false
            });
            that._raiseZoomEndHandlers()
        }
    },
    _change_FULL_RENDER: function() {
        this.callBase();
        if (this._changes.has(VISUAL_RANGE)) {
            this._raiseZoomEndHandlers()
        }
    },
    _raiseZoomEndHandlers: function() {
        this._argumentAxes.forEach(function(axis) {
            return axis.handleZoomEnd()
        });
        this._valueAxes.forEach(function(axis) {
            return axis.handleZoomEnd()
        })
    },
    _notifyOptionChanged: function(option, value, previousValue) {
        this.callBase.apply(this, arguments);
        if (!this._optionChangedLocker) {
            this._parseVisualRangeOption(option, value)
        }
    },
    _setOptionsByReference: function() {
        this.callBase();
        (0, _extend2.extend)(this._optionsByReference, {
            "argumentAxis.visualRange": true,
            "valueAxis.visualRange": true
        })
    },
    option: function option() {
        var option = this.callBase.apply(this, arguments);
        if ("array" === (0, _type.type)(this._options.valueAxis)) {
            for (var i = 0; i < this._options.valueAxis.length; i++) {
                var optionPath = "valueAxis[" + i + "].visualRange";
                this._optionsByReference[optionPath] = true
            }
        }
        return option
    },
    _optionChanged: function(arg) {
        var that = this;
        if (!that._optionChangedLocker) {
            if (arg.fullName.indexOf("visualRange") > 0) {
                var axisPath = void 0;
                if (arg.fullName) {
                    axisPath = arg.fullName.slice(0, arg.fullName.indexOf("."))
                }
                var visualRange = arg.value;
                var options = {
                    skipEventRising: true
                };
                var pathElements = arg.fullName.split(".");
                var destElem = pathElements[pathElements.length - 1];
                if ("endValue" === destElem || "startValue" === destElem) {
                    options = {
                        allowPartialUpdate: true
                    };
                    visualRange = _defineProperty({}, destElem, arg.value)
                }
                var axis = [that.getArgumentAxis()].concat(that._valueAxes).filter(function(a) {
                    return a.getOptions().optionPath === axisPath
                })[0];
                if (axis) {
                    axis.visualRange(visualRange, options)
                }
            } else {
                if (that.getPartialChangeOptionsName(arg).indexOf("visualRange") > -1) {
                    if ("argumentAxis" === arg.name) {
                        that.getArgumentAxis().visualRange(arg.value.visualRange)
                    } else {
                        if ("valueAxis" === arg.name) {
                            if ("object" === (0, _type.type)(arg.value)) {
                                that._valueAxes[0].visualRange(arg.value.visualRange)
                            } else {
                                arg.value.forEach(function(v, index) {
                                    if ((0, _type.isDefined)(v.visualRange) && (0, _type.isDefined)(that._valueAxes[index])) {
                                        that._valueAxes[index].visualRange(arg.value[index].visualRange)
                                    }
                                })
                            }
                        }
                    }
                }
            }
        }
        that.callBase(arg)
    },
    _notify: function() {
        var that = this;
        that.callBase();
        if (true === that.option("disableTwoWayBinding")) {
            return
        }
        var argumentVisualRange = (0, _utils.convertVisualRangeObject)(this._argumentAxes[0].visualRange(), !_isArray(that.option("argumentAxis.visualRange")));
        if (!this._argumentAxes[0].skipEventRising || !rangesAreEqual(argumentVisualRange, that.option("argumentAxis.visualRange"))) {
            that.option("argumentAxis.visualRange", argumentVisualRange)
        } else {
            this._argumentAxes[0].skipEventRising = null
        }
        that._valueAxes.forEach(function(axis) {
            if (axis.getOptions().optionPath) {
                var path = axis.getOptions().optionPath + ".visualRange";
                var visualRange = (0, _utils.convertVisualRangeObject)(axis.visualRange(), !_isArray(that.option(path)));
                if (!axis.skipEventRising || !rangesAreEqual(visualRange, that.option(path))) {
                    that.option(path, visualRange)
                } else {
                    axis.skipEventRising = null
                }
            }
        })
    }
});

function rangesAreEqual(range, rangeFromOptions) {
    if (_isArray(rangeFromOptions)) {
        return range.length === rangeFromOptions.length && range.every(function(item, i) {
            return item === rangeFromOptions[i]
        })
    } else {
        return range.startValue === rangeFromOptions.startValue && range.endValue === rangeFromOptions.endValue
    }
}
dxChart.addPlugin(require("./chart_components/shutter_zoom"));
dxChart.addPlugin(require("./chart_components/zoom_and_pan"));
dxChart.addPlugin(require("./core/annotations").plugins.core);
dxChart.addPlugin(require("./core/annotations").plugins.chart);
(0, _component_registrator2.default)("dxChart", dxChart);
module.exports = dxChart;
module.exports.default = module.exports;
