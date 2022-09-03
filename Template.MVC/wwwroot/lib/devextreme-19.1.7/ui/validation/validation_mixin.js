/**
 * DevExtreme (ui/validation/validation_mixin.js)
 * Version: 19.1.7
 * Build date: Fri Oct 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var ValidationMixin = {
    _findGroup: function() {
        var $dxGroup, group = this.option("validationGroup");
        if (!group) {
            $dxGroup = this.$element().parents(".dx-validationgroup").first();
            if ($dxGroup.length) {
                group = $dxGroup.dxValidationGroup("instance")
            } else {
                group = this._modelByElement(this.$element())
            }
        }
        return group
    }
};
module.exports = ValidationMixin;
