/**
* DevExtreme (viz/linear_gauge.d.ts)
* Version: 19.1.7
* Build date: Fri Oct 11 2019
*
* Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import DevExpress from '../bundles/dx.all';

declare global {
interface JQuery {
    dxLinearGauge(): JQuery;
    dxLinearGauge(options: "instance"): DevExpress.viz.dxLinearGauge;
    dxLinearGauge(options: string): any;
    dxLinearGauge(options: string, ...params: any[]): any;
    dxLinearGauge(options: DevExpress.viz.dxLinearGaugeOptions): JQuery;
}
}
export default DevExpress.viz.dxLinearGauge;
export type Options = DevExpress.viz.dxLinearGaugeOptions;

/** @deprecated use Options instead */
export type IOptions = DevExpress.viz.dxLinearGaugeOptions;