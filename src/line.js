"use strict";

FLOW.Line = class Line {
    constructor(propertyA, propertyB)
    {
        this.chart = propertyA.block.chart;
        if (propertyA.output)
        {
            this.propertyA = propertyA;
            this.propertyB = propertyB;
        }
        else {
            this.propertyA = propertyB;
            this.propertyB = propertyA;
        }
        this.color = this.propertyA.color;
        this.path = this.chart.draw.path("M0,0 C0,0 0,0 0,0").attr({stroke:`rgba(${this.color.r},${this.color.g},${this.color.b},0.7)`, fill: "none"}).stroke({width: "2px"});
        this.pathMask = this.chart.draw.path("M0,0 C0,0 0,0 0,0").attr({fill: "none"}).stroke({color: "transparent", width: "10px", linecap: "round"});




        this.update();

        this.pathMask.mouseover((e) => {
            this.pathMask.stroke({color: `rgba(${this.color.r},${this.color.g},${this.color.b},0.1)`, width: "10px"});
        });

        this.pathMask.mouseout((e) => {
            this.pathMask.stroke({color: "transparent", width: "10px"});
        });

        this.pathMask.click((e) => {
            this.destroy();
        });

        this.pathMask.back();
        this.path.back();
    }

    update()
    {
        let tx = this.propertyB.globalX;
        let ty = this.propertyB.globalY;

        let sx = this.propertyA.globalX, sy = this.propertyA.globalY;

        let d = Math.sqrt(Math.pow(tx - sx, 2) + Math.pow(ty - sy, 2));

        let dist = Math.max((tx - sx) / 2, 40);

        let C1 = (sx + dist) + "," + sy;
        let C2 = (tx - dist) + "," + ty;

        let plot = "M" + sx + "," + sy + " C" + C1 + " " + C2 + " " + tx + "," + ty;
        this.path.plot(plot);
        this.pathMask.plot(plot);
    }

    destroy()
    {
        this.propertyA.disconnect(this.propertyB);
        this.propertyA.block.removeLine(this);
        this.propertyB.block.removeLine(this);
        this.path.remove();
        this.pathMask.remove();
    }

    match(a, b)
    {
        return (a === this.propertyA && b === this.propertyB) || (b === this.propertyA && a === this.propertyB);
    }
};
