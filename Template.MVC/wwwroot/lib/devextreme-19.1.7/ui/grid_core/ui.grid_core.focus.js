/**
 * DevExtreme (ui/grid_core/ui.grid_core.focus.js)
 * Version: 19.1.7
 * Build date: Fri Oct 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _renderer = require("../../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _uiGrid_core = require("./ui.grid_core.modules");
var _uiGrid_core2 = _interopRequireDefault(_uiGrid_core);
var _iterator = require("../../core/utils/iterator");
var _uiGrid_core3 = require("./ui.grid_core.utils");
var _common = require("../../core/utils/common");
var _type = require("../../core/utils/type");
var _deferred = require("../../core/utils/deferred");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var ROW_FOCUSED_CLASS = "dx-row-focused",
    FOCUSED_ROW_SELECTOR = ".dx-row." + ROW_FOCUSED_CLASS,
    DATA_GRID_TABLE_SELECTOR = ".dx-datagrid-table",
    CELL_FOCUS_DISABLED_CLASS = "dx-cell-focus-disabled";
exports.FocusController = _uiGrid_core2.default.ViewController.inherit(function() {
    return {
        init: function() {
            this._dataController = this.getController("data");
            this._keyboardController = this.getController("keyboardNavigation");
            this.component._optionsByReference.focusedRowKey = true
        },
        optionChanged: function(args) {
            if ("focusedRowIndex" === args.name) {
                this._focusRowByIndex(args.value);
                args.handled = true
            } else {
                if ("focusedRowKey" === args.name) {
                    this._focusRowByKey(args.value);
                    args.handled = true
                } else {
                    if ("focusedColumnIndex" === args.name) {
                        args.handled = true
                    } else {
                        if ("focusedRowEnabled" === args.name) {
                            args.handled = true
                        } else {
                            if ("skipFocusedRowNavigation" === args.name) {
                                args.handled = true
                            } else {
                                this.callBase(args)
                            }
                        }
                    }
                }
            }
        },
        _focusRowByIndex: function(index) {
            if (!this.option("focusedRowEnabled")) {
                return
            }
            index = void 0 !== index ? index : this.option("focusedRowIndex");
            if (index < 0) {
                this._resetFocusedRow()
            } else {
                this._focusRowByIndexCore(index)
            }
        },
        _focusRowByIndexCore: function(index) {
            var _this = this;
            var dataController = this.getController("data"),
                pageSize = dataController.pageSize(),
                setKeyByIndex = function() {
                    if (_this._isValidFocusedRowIndex(index)) {
                        var rowIndex = Math.min(index - dataController.getRowIndexOffset(), dataController.items().length - 1),
                            focusedRowKey = dataController.getKeyByRowIndex(rowIndex);
                        if (void 0 !== focusedRowKey && !_this.isRowFocused(focusedRowKey)) {
                            _this.option("focusedRowKey", focusedRowKey)
                        }
                    }
                };
            if (pageSize >= 0) {
                if (!this._isLocalRowIndex(index)) {
                    var pageIndex = Math.floor(index / dataController.pageSize());
                    (0, _deferred.when)(dataController.pageIndex(pageIndex), dataController.waitReady()).done(function() {
                        setKeyByIndex()
                    })
                } else {
                    setKeyByIndex()
                }
            }
        },
        _isLocalRowIndex: function(index) {
            var dataController = this.getController("data"),
                isVirtualScrolling = this.getController("keyboardNavigation")._isVirtualScrolling();
            if (isVirtualScrolling) {
                var pageIndex = Math.floor(index / dataController.pageSize()),
                    virtualItems = dataController.virtualItemsCount(),
                    virtualItemsBegin = virtualItems ? virtualItems.begin : -1,
                    visibleRowsCount = dataController.getVisibleRows().length + dataController.getRowIndexOffset(),
                    visiblePagesCount = Math.ceil(visibleRowsCount / dataController.pageSize());
                return virtualItemsBegin <= index && visiblePagesCount > pageIndex
            }
            return true
        },
        _setFocusedRowKeyByIndex: function(index) {
            var dataController = this.getController("data");
            if (this._isValidFocusedRowIndex(index)) {
                var rowIndex = Math.min(index - dataController.getRowIndexOffset(), dataController.items().length - 1),
                    focusedRowKey = dataController.getKeyByRowIndex(rowIndex);
                if (void 0 !== focusedRowKey && !this.isRowFocused(focusedRowKey)) {
                    this.option("focusedRowKey", focusedRowKey)
                }
            }
        },
        _focusRowByKey: function(key) {
            if (void 0 === key) {
                this._resetFocusedRow()
            } else {
                this._navigateToRow(key, true)
            }
        },
        _resetFocusedRow: function() {
            if (void 0 === this.option("focusedRowKey") && this.option("focusedRowIndex") < 0) {
                return
            }
            this.option("focusedRowKey", void 0);
            this.getController("keyboardNavigation").setFocusedRowIndex(-1);
            this.option("focusedRowIndex", -1);
            this.getController("data").updateItems({
                changeType: "updateFocusedRow",
                focusedRowKey: void 0
            })
        },
        _isValidFocusedRowIndex: function(rowIndex) {
            var dataController = this.getController("data"),
                row = dataController.getVisibleRows()[rowIndex];
            return !row || "data" === row.rowType || "group" === row.rowType
        },
        publicMethods: function() {
            return ["navigateToRow", "isRowFocused"]
        },
        navigateToRow: function(key) {
            this._navigateToRow(key)
        },
        _navigateToRow: function(key, needFocusRow) {
            var that = this,
                dataController = this.getController("data"),
                rowIndex = this.option("focusedRowIndex"),
                isVirtualRowRenderingMode = "virtual" === that.option("scrolling.rowRenderingMode"),
                result = new _deferred.Deferred,
                navigateInRowsView = function(key, result) {
                    if (needFocusRow) {
                        that._triggerUpdateFocusedRow(key, result)
                    } else {
                        var rowsView = that.getView("rowsView"),
                            _rowIndex = that.getController("data").getRowIndexByKey(key),
                            rowElement = rowsView.getRow(_rowIndex);
                        rowsView._scrollToElement(rowElement)
                    }
                },
                navigateTo = function(key, result) {
                    if (isVirtualRowRenderingMode) {
                        setTimeout(function() {
                            that._navigateToVirtualRow(key, result, needFocusRow)
                        })
                    } else {
                        navigateInRowsView(key, result)
                    }
                };
            that.option("skipFocusedRowNavigation", !needFocusRow);
            if (void 0 === key || !dataController.dataSource()) {
                return result.reject().promise()
            }
            var rowIndexByKey = that._getFocusedRowIndexByKey(key),
                isPaginate = dataController.getDataSource().paginate();
            if (!isPaginate || rowIndex >= 0 && rowIndex === rowIndexByKey) {
                navigateTo(key, result)
            } else {
                dataController.getPageIndexByKey(key).done(function(pageIndex) {
                    if (pageIndex < 0) {
                        result.resolve(-1);
                        return
                    }
                    if (pageIndex === dataController.pageIndex()) {
                        dataController.reload().done(function() {
                            if (that.isRowFocused(key)) {
                                result.resolve(that._getFocusedRowIndexByKey(key))
                            } else {
                                navigateInRowsView(key, result)
                            }
                        }).fail(result.reject)
                    } else {
                        dataController.pageIndex(pageIndex).done(function() {
                            navigateTo(key, result)
                        }).fail(result.reject)
                    }
                }).always(function() {
                    return that.option("skipFocusedRowNavigation", false)
                }).fail(result.reject)
            }
            return result.promise()
        },
        _navigateToVirtualRow: function(key, result, needFocusRow) {
            var that = this,
                dataController = this.getController("data"),
                rowsScrollController = dataController._rowsScrollController,
                rowIndex = (0, _uiGrid_core3.getIndexByKey)(key, dataController.items(true)),
                scrollable = that.getView("rowsView").getScrollable();
            if (rowsScrollController && scrollable && rowIndex >= 0) {
                var focusedRowIndex = rowIndex + dataController.getRowIndexOffset() - dataController.getRowIndexDelta(),
                    offset = rowsScrollController.getItemOffset(focusedRowIndex);
                if (needFocusRow) {
                    var triggerUpdateFocusedRow = function triggerUpdateFocusedRow() {
                        that.component.off("contentReady", triggerUpdateFocusedRow);
                        that._triggerUpdateFocusedRow(key, result)
                    };
                    that.component.on("contentReady", triggerUpdateFocusedRow)
                }
                scrollable.scrollTo({
                    y: offset
                })
            }
        },
        _triggerUpdateFocusedRow: function(key, result) {
            var dataController = this.getController("data"),
                focusedRowIndex = this._getFocusedRowIndexByKey(key);
            if (this._isValidFocusedRowIndex(focusedRowIndex)) {
                this.getController("keyboardNavigation").setFocusedRowIndex(focusedRowIndex);
                if (this.option("focusedRowEnabled")) {
                    dataController.updateItems({
                        changeType: "updateFocusedRow",
                        focusedRowKey: key
                    })
                } else {
                    var rowIndex = dataController.getRowIndexByKey(key),
                        rowsView = this.getView("rowsView");
                    rowsView._scrollToElement(rowsView.getRow(rowIndex))
                }
                result && result.resolve(focusedRowIndex)
            } else {
                result && result.resolve(-1)
            }
        },
        _getFocusedRowIndexByKey: function(key) {
            var dataController = this.getController("data"),
                rowIndex = dataController.getRowIndexByKey(key);
            return rowIndex >= 0 ? rowIndex + dataController.getRowIndexOffset() : -1
        },
        _focusRowByKeyOrIndex: function() {
            var _this2 = this;
            var focusedRowKey = this.option("focusedRowKey"),
                currentFocusedRowIndex = this.option("focusedRowIndex"),
                keyboardController = this.getController("keyboardNavigation"),
                dataController = this.getController("data");
            if (void 0 !== focusedRowKey) {
                var visibleRowIndex = dataController.getRowIndexByKey(focusedRowKey);
                if (visibleRowIndex >= 0) {
                    if (keyboardController._isVirtualScrolling()) {
                        currentFocusedRowIndex = visibleRowIndex + dataController.getRowIndexOffset()
                    }
                    keyboardController.setFocusedRowIndex(currentFocusedRowIndex);
                    this._triggerUpdateFocusedRow(focusedRowKey)
                } else {
                    this._navigateToRow(focusedRowKey, true).done(function(focusedRowIndex) {
                        if (currentFocusedRowIndex >= 0 && focusedRowIndex < 0) {
                            _this2._focusRowByIndex()
                        }
                    })
                }
            } else {
                if (currentFocusedRowIndex >= 0) {
                    this.getController("focus")._focusRowByIndex(currentFocusedRowIndex)
                }
            }
        },
        isRowFocused: function(key) {
            var focusedRowKey = this.option("focusedRowKey");
            if (void 0 !== focusedRowKey) {
                return (0, _common.equalByValue)(key, this.option("focusedRowKey"))
            }
        },
        updateFocusedRow: function(change) {
            var $focusedRow, $tableElement, that = this,
                focusedRowIndex = that._dataController.getRowIndexByKey(change.focusedRowKey),
                rowsView = that.getView("rowsView");
            (0, _iterator.each)(rowsView.getTableElements(), function(index, element) {
                $tableElement = (0, _renderer2.default)(element);
                that._clearPreviousFocusedRow($tableElement, focusedRowIndex);
                var isMainTable = 0 === index;
                $focusedRow = that._prepareFocusedRow(change.items[focusedRowIndex], $tableElement, focusedRowIndex);
                if (isMainTable) {
                    that.getController("keyboardNavigation")._fireFocusedRowChanged($focusedRow)
                }
            })
        },
        _clearPreviousFocusedRow: function($tableElement, focusedRowIndex) {
            var isNotMasterDetailFocusedRow = function(_, focusedRow) {
                var $focusedRowTable = (0, _renderer2.default)(focusedRow).closest(DATA_GRID_TABLE_SELECTOR);
                return $tableElement.is($focusedRowTable)
            };
            var $prevRowFocusedElement = $tableElement.find(FOCUSED_ROW_SELECTOR).filter(isNotMasterDetailFocusedRow);
            $prevRowFocusedElement.removeClass(ROW_FOCUSED_CLASS).removeClass(CELL_FOCUS_DISABLED_CLASS).removeAttr("tabindex");
            $prevRowFocusedElement.children("td").removeAttr("tabindex");
            if (0 !== focusedRowIndex) {
                var $firstRow = (0, _renderer2.default)(this.getView("rowsView").getRowElement(0));
                $firstRow.removeClass(CELL_FOCUS_DISABLED_CLASS).removeAttr("tabIndex")
            }
        },
        _prepareFocusedRow: function(changedItem, $tableElement, focusedRowIndex) {
            var $row, tabIndex = this.option("tabindex") || 0,
                rowsView = this.getView("rowsView");
            if (changedItem && ("data" === changedItem.rowType || "group" === changedItem.rowType)) {
                $row = (0, _renderer2.default)(rowsView._getRowElements($tableElement).eq(focusedRowIndex));
                $row.addClass(ROW_FOCUSED_CLASS).attr("tabindex", tabIndex);
                rowsView._scrollToElement($row)
            }
            return $row
        }
    }
}());
module.exports = {
    defaultOptions: function() {
        return {
            focusedRowEnabled: false,
            focusedRowKey: void 0,
            focusedRowIndex: -1,
            focusedColumnIndex: -1
        }
    },
    controllers: {
        focus: exports.FocusController
    },
    extenders: {
        controllers: {
            keyboardNavigation: {
                init: function() {
                    var rowIndex = this.option("focusedRowIndex"),
                        columnIndex = this.option("focusedColumnIndex");
                    this.createAction("onFocusedRowChanging", {
                        excludeValidators: ["disabled", "readOnly"]
                    });
                    this.createAction("onFocusedRowChanged", {
                        excludeValidators: ["disabled", "readOnly"]
                    });
                    this.createAction("onFocusedCellChanging", {
                        excludeValidators: ["disabled", "readOnly"]
                    });
                    this.createAction("onFocusedCellChanged", {
                        excludeValidators: ["disabled", "readOnly"]
                    });
                    this.callBase();
                    this.setRowFocusType();
                    this._focusedCellPosition = {};
                    if ((0, _type.isDefined)(rowIndex)) {
                        this._focusedCellPosition.rowIndex = this.option("focusedRowIndex")
                    }
                    if ((0, _type.isDefined)(columnIndex)) {
                        this._focusedCellPosition.columnIndex = this.option("focusedColumnIndex")
                    }
                },
                setFocusedRowIndex: function(rowIndex) {
                    this.callBase(rowIndex);
                    var visibleRow = this.getController("data").getVisibleRows()[rowIndex];
                    if (!visibleRow || !visibleRow.isNewRow) {
                        this.option("focusedRowIndex", rowIndex)
                    }
                },
                setFocusedColumnIndex: function(columnIndex) {
                    this.callBase(columnIndex);
                    this.option("focusedColumnIndex", columnIndex)
                },
                _escapeKeyHandler: function(eventArgs, isEditing) {
                    if (isEditing || !this.option("focusedRowEnabled")) {
                        this.callBase(eventArgs, isEditing);
                        return
                    }
                    if (this.isCellFocusType()) {
                        this.setRowFocusType();
                        this._focus(this._getCellElementFromTarget(eventArgs.originalEvent.target), true)
                    }
                },
                _updateFocusedCellPosition: function($cell, direction) {
                    var prevRowIndex = this.option("focusedRowIndex"),
                        prevColumnIndex = this.option("focusedColumnIndex");
                    if (this.callBase($cell, direction)) {
                        this._fireFocusedCellChanged($cell, prevColumnIndex, prevRowIndex)
                    }
                }
            },
            editorFactory: {
                renderFocusOverlay: function($element, hideBorder) {
                    var $cell, keyboardController = this.getController("keyboardNavigation"),
                        focusedRowEnabled = this.option("focusedRowEnabled"),
                        editingController = this.getController("editing"),
                        isRowElement = "row" === keyboardController._getElementType($element);
                    if (!focusedRowEnabled || !keyboardController.isRowFocusType() || editingController.isEditing()) {
                        this.callBase($element, hideBorder)
                    } else {
                        if (focusedRowEnabled) {
                            if (isRowElement && !$element.hasClass(ROW_FOCUSED_CLASS)) {
                                $cell = keyboardController.getFirstValidCellInRow($element);
                                keyboardController.focus($cell)
                            }
                        }
                    }
                }
            },
            columns: {
                getSortDataSourceParameters: function() {
                    var _this3 = this;
                    var result = this.callBase.apply(this, arguments),
                        dataController = this.getController("data"),
                        dataSource = dataController._dataSource,
                        store = dataController.store(),
                        key = store && store.key(),
                        remoteOperations = dataSource && dataSource.remoteOperations() || {},
                        isLocalOperations = Object.keys(remoteOperations).every(function(operationName) {
                            return !remoteOperations[operationName]
                        });
                    if (this.option("focusedRowEnabled") && key) {
                        key = Array.isArray(key) ? key : [key];
                        var notSortedKeys = key.filter(function(key) {
                            return !_this3.columnOption(key, "sortOrder")
                        });
                        if (notSortedKeys.length) {
                            result = result || [];
                            if (isLocalOperations) {
                                result.push({
                                    selector: dataSource.getDataIndexGetter(),
                                    desc: false
                                })
                            } else {
                                notSortedKeys.forEach(function(notSortedKey) {
                                    return result.push({
                                        selector: notSortedKey,
                                        desc: false
                                    })
                                })
                            }
                        }
                    }
                    return result
                }
            },
            data: {
                _applyChange: function(change) {
                    if (change && "updateFocusedRow" === change.changeType) {
                        return
                    }
                    return this.callBase.apply(this, arguments)
                },
                _fireChanged: function(e) {
                    var isPartialUpdateWithDeleting, skipFocusedRowNavigation = this.option("skipFocusedRowNavigation");
                    if (this.option("focusedRowEnabled") && !skipFocusedRowNavigation && this._dataSource) {
                        var isPartialUpdate = "update" === e.changeType && e.repaintChangesOnly;
                        isPartialUpdateWithDeleting = isPartialUpdate && e.changeTypes && e.changeTypes.indexOf("remove") >= 0;
                        if (isPartialUpdateWithDeleting) {
                            this.callBase(e)
                        }
                        if ("refresh" === e.changeType || isPartialUpdateWithDeleting) {
                            this.processUpdateFocusedRow()
                        }
                    }
                    if (!isPartialUpdateWithDeleting) {
                        this.callBase(e)
                    }
                },
                processUpdateFocusedRow: function() {
                    var prevPageIndex = this._prevPageIndex,
                        pageIndex = this.pageIndex(),
                        prevRenderingPageIndex = this._prevRenderingPageIndex || 0,
                        renderingPageIndex = this._rowsScrollController ? this._rowsScrollController.pageIndex() : 0,
                        operationTypes = this._dataSource.operationTypes() || {},
                        focusController = this.getController("focus"),
                        reload = operationTypes.reload,
                        isVirtualScrolling = this.getController("keyboardNavigation")._isVirtualScrolling(),
                        focusedRowKey = this.option("focusedRowKey"),
                        paging = void 0 !== prevPageIndex && prevPageIndex !== pageIndex,
                        pagingByRendering = renderingPageIndex !== prevRenderingPageIndex;
                    this._prevPageIndex = pageIndex;
                    this._prevRenderingPageIndex = renderingPageIndex;
                    if (reload && void 0 !== focusedRowKey) {
                        focusController._navigateToRow(focusedRowKey, true).done(function(focusedRowIndex) {
                            if (focusedRowIndex < 0) {
                                focusController._focusRowByIndex()
                            }
                        })
                    } else {
                        if (paging) {
                            if (!isVirtualScrolling && this.option("focusedRowIndex") >= 0) {
                                focusController._focusRowByIndex()
                            }
                        } else {
                            if (!pagingByRendering) {
                                focusController._focusRowByKeyOrIndex()
                            }
                        }
                    }
                },
                getPageIndexByKey: function(key) {
                    var that = this,
                        d = new _deferred.Deferred;
                    that.getGlobalRowIndexByKey(key).done(function(globalIndex) {
                        d.resolve(globalIndex >= 0 ? Math.floor(globalIndex / that.pageSize()) : -1)
                    }).fail(d.reject);
                    return d.promise()
                },
                getGlobalRowIndexByKey: function(key) {
                    if (this._dataSource.group()) {
                        return this._calculateGlobalRowIndexByGroupedData(key)
                    }
                    return this._calculateGlobalRowIndexByFlatData(key)
                },
                _calculateGlobalRowIndexByFlatData: function(key, groupFilter, useGroup) {
                    var that = this,
                        deferred = new _deferred.Deferred,
                        dataSource = that._dataSource,
                        filter = that._generateFilterByKey(key);
                    dataSource.load({
                        filter: that._concatWithCombinedFilter(filter),
                        skip: 0,
                        take: 1
                    }).done(function(data) {
                        if (data.length > 0) {
                            filter = that._generateOperationFilterByKey(key, data[0], useGroup);
                            dataSource.load({
                                filter: that._concatWithCombinedFilter(filter, groupFilter),
                                skip: 0,
                                take: 1,
                                requireTotalCount: true
                            }).done(function(_, extra) {
                                deferred.resolve(extra.totalCount)
                            })
                        } else {
                            deferred.resolve(-1)
                        }
                    });
                    return deferred.promise()
                },
                _concatWithCombinedFilter: function(filter, groupFilter) {
                    var combinedFilter = this.getCombinedFilter();
                    return (0, _uiGrid_core3.combineFilters)([filter, combinedFilter, groupFilter])
                },
                _generateBooleanFilter: function(selector, value, sortInfo) {
                    var result = void 0;
                    if (false === value) {
                        result = [selector, "=", sortInfo.desc ? true : null]
                    } else {
                        if (true === value ? !sortInfo.desc : sortInfo.desc) {
                            result = [selector, "<>", value]
                        }
                    }
                    return result
                },
                _generateOperationFilterByKey: function(key, rowData, useGroup) {
                    var booleanFilter, that = this,
                        dataSource = that._dataSource,
                        filter = that._generateFilterByKey(key, "<"),
                        sort = that._columnsController.getSortDataSourceParameters(!dataSource.remoteOperations().filtering);
                    if (useGroup) {
                        var group = that._columnsController.getGroupDataSourceParameters(!dataSource.remoteOperations().filtering);
                        if (group) {
                            sort = sort ? group.concat(sort) : group
                        }
                    }
                    if (sort) {
                        sort.slice().reverse().forEach(function(sortInfo) {
                            var getter, value, selector = sortInfo.selector;
                            if ("function" === typeof selector) {
                                getter = selector
                            } else {
                                getter = that._columnsController.columnOption(selector, "selector")
                            }
                            value = getter ? getter(rowData) : rowData[selector];
                            filter = [
                                [selector, "=", value], "and", filter
                            ];
                            if (null === value || (0, _type.isBoolean)(value)) {
                                booleanFilter = that._generateBooleanFilter(selector, value, sortInfo);
                                if (booleanFilter) {
                                    filter = [booleanFilter, "or", filter]
                                }
                            } else {
                                filter = [
                                    [selector, sortInfo.desc ? ">" : "<", value], "or", filter
                                ]
                            }
                        })
                    }
                    return filter
                },
                _generateFilterByKey: function(key, operation) {
                    var keyPart, dataSourceKey = this._dataSource.key(),
                        filter = [];
                    if (!operation) {
                        operation = "="
                    }
                    if (Array.isArray(dataSourceKey)) {
                        for (var i = 0; i < dataSourceKey.length; ++i) {
                            keyPart = key[dataSourceKey[i]];
                            if (keyPart) {
                                if (filter.length > 0) {
                                    filter.push("and")
                                }
                                filter.push([dataSourceKey[i], operation, keyPart])
                            }
                        }
                    } else {
                        filter = [dataSourceKey, operation, key]
                    }
                    return filter
                }
            }
        },
        views: {
            rowsView: {
                _createRow: function(row) {
                    var $row = this.callBase(row);
                    if (this.option("focusedRowEnabled") && row) {
                        if (this.getController("focus").isRowFocused(row.key)) {
                            $row.addClass(ROW_FOCUSED_CLASS)
                        }
                    }
                    return $row
                },
                _checkRowKeys: function(options) {
                    this.callBase.apply(this, arguments);
                    if (this.option("focusedRowEnabled") && this.option("dataSource")) {
                        var store = this._dataController.store();
                        if (store && !store.key()) {
                            this._dataController.fireError("E1042", "Row focusing")
                        }
                    }
                },
                _update: function(change) {
                    if ("updateFocusedRow" === change.changeType) {
                        if (this.option("focusedRowEnabled")) {
                            this.getController("focus").updateFocusedRow(change)
                        }
                    } else {
                        this.callBase(change)
                    }
                },
                updateFocusElementTabIndex: function($cellElements) {
                    if (this.option("focusedRowEnabled")) {
                        this._setFocusedRowElementTabIndex()
                    } else {
                        this.callBase($cellElements)
                    }
                },
                _setFocusedRowElementTabIndex: function() {
                    var that = this,
                        focusedRowKey = that.option("focusedRowKey"),
                        tabIndex = that.option("tabIndex"),
                        rowIndex = that._dataController.getRowIndexByKey(focusedRowKey),
                        columnIndex = that.option("focusedColumnIndex"),
                        $cellElements = that.getCellElements(rowIndex >= 0 ? rowIndex : 0),
                        $row = $cellElements.eq(0).parent(),
                        dataSource = that.component.getController("data")._dataSource,
                        operationTypes = dataSource && dataSource.operationTypes();
                    if ($row.length) {
                        that._scrollToFocusOnResize = that._scrollToFocusOnResize || function() {
                            that._scrollToElement($row);
                            that.resizeCompleted.remove(that._scrollToFocusOnResize)
                        };
                        $row.attr("tabIndex", tabIndex);
                        if (rowIndex >= 0) {
                            if (columnIndex < 0) {
                                columnIndex = 0
                            }
                            rowIndex += that.getController("data").getRowIndexOffset();
                            that.getController("keyboardNavigation").setFocusedCellPosition(rowIndex, columnIndex);
                            if (operationTypes && !operationTypes.paging) {
                                that.resizeCompleted.remove(that._scrollToFocusOnResize);
                                that.resizeCompleted.add(that._scrollToFocusOnResize)
                            }
                        }
                    }
                },
                _scrollToElement: function(element) {
                    var scrollable = this.getScrollable();
                    scrollable && scrollable.scrollToElement(element)
                }
            }
        }
    }
};
