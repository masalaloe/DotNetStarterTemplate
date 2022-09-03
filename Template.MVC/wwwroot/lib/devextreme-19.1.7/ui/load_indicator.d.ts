/**
* DevExtreme (ui/load_indicator.d.ts)
* Version: 19.1.7
* Build date: Fri Oct 11 2019
*
* Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import DevExpress from '../bundles/dx.all';

declare global {
interface JQuery {
    dxLoadIndicator(): JQuery;
    dxLoadIndicator(options: "instance"): DevExpress.ui.dxLoadIndicator;
    dxLoadIndicator(options: string): any;
    dxLoadIndicator(options: string, ...params: any[]): any;
    dxLoadIndicator(options: DevExpress.ui.dxLoadIndicatorOptions): JQuery;
}
}
export default DevExpress.ui.dxLoadIndicator;
export type Options = DevExpress.ui.dxLoadIndicatorOptions;

/** @deprecated use Options instead */
export type IOptions = DevExpress.ui.dxLoadIndicatorOptions;