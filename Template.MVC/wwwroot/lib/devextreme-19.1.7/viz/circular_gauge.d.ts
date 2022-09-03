/**
* DevExtreme (viz/circular_gauge.d.ts)
* Version: 19.1.7
* Build date: Fri Oct 11 2019
*
* Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import DevExpress from '../bundles/dx.all';

declare global {
interface JQuery {
    dxCircularGauge(): JQuery;
    dxCircularGauge(options: "instance"): DevExpress.viz.dxCircularGauge;
    dxCircularGauge(options: string): any;
    dxCircularGauge(options: string, ...params: any[]): any;
    dxCircularGauge(options: DevExpress.viz.dxCircularGaugeOptions): JQuery;
}
}
export default DevExpress.viz.dxCircularGauge;
export type Options = DevExpress.viz.dxCircularGaugeOptions;

/** @deprecated use Options instead */
export type IOptions = DevExpress.viz.dxCircularGaugeOptions;