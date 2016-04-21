"use strict";

FLOW.Line = class Line {
    constructor(propertyA, propertyB)
    {
        this.chart = propertyA.block.chart;
        this.path = this.chart.draw.path("M0,0 C0,0 0,0 0,0").attr({stroke:"rgba(100,255,255,0.5)", fill: "none"}).stroke({width: "2px"});
        this.pathMask = this.chart.draw.path("M0,0 C0,0 0,0 0,0").attr({fill: "none"}).stroke({color: "transparent", width: "10px"});
        this.propertyA = propertyA;
        this.propertyB = propertyB;
        this.update();

        this.pathMask.mouseover((e) => {
            this.pathMask.stroke({color: "rgba(255, 255, 255, 0.1)", width: "10px"});
        });

        this.pathMask.mouseout((e) => {
            this.pathMask.stroke({color: "transparent", width: "10px"});
        });

        this.pathMask.click((e) => {
            this.destroy();
        });
    }

    update()
    {
        let tx = this.propertyB.globalX;
        let ty = this.propertyB.globalY;

        let sx = this.propertyA.globalX, sy = this.propertyA.globalY;

        let dist = (tx - sx) / 2;

        let C1 = (sx + dist) + "," + sy;
        let C2 = (sx + dist) + "," + ty;

        let plot = "M" + sx + "," + sy + " C" + C1 + " " + C2 + " " + tx + "," + ty;
        this.path.plot(plot);
        this.pathMask.plot(plot);
    }

    destroy()
    {
        this.propertyA.block.removeLine(this);
        this.propertyB.block.removeLine(this);
        this.path.remove();
        this.pathMask.remove();
    }
};
