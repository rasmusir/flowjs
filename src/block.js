"use strict";

FLOW.Block = class Block {
    constructor(chart)
    {
        this.chart = chart;
        this.group = chart.draw.group();
        this.mask = this.group.mask();
        this.height = 90;
        this.width = 130;
        this.titleHeight = 24;
        this.mask.rect(this.width, this.height).attr({fill: "#fff"});
        this.block = this.group.rect(this.width, this.height).attr({fill: "rgba(255,255,255,0.85)", stroke: "rgba(0,0,0,0.1)"}).stroke({width: "1px"});
        this.titleBar = this.group.rect(this.width, this.titleHeight).attr({fill: "rgb(120,220,220)"});
        this.block.maskWith(this.mask);
        this.left = [];
        this.right = [];
        this.next = new FLOW.NextProperty(this, this.width - 12, this.titleHeight + 10);
        this.trigger = new FLOW.TriggerProperty(this, 8, this.titleHeight + 10);

        this.lines = [];

        this.group.mousedown((e) => {
            this.group.front();
            this.chart.startMove(this, e);
        });

        this.group.filter((add) => {
            let blur = add.offset(0, 2).in(add.sourceAlpha).gaussianBlur(5).componentTransfer({a: {slope: 0.5, type: "linear"}});
            add.blend(add.source, blur);

        });
    }

    get x() { return this._x; }
    get y() { return this._y; }

    set x(x) {
        this._x = x;
        this._move();
    }

    set y(y) {
        this._y = y;
        this._move();
    }

    _move()
    {
        this.group.move(this._x, this._y);
        this.lines.forEach((l) => {
            l.update();
        });
    }

    setNext(next)
    {
        this.next = next;
    }

    setPrevious(previous)
    {
        this.previous = previous;
    }

    connect(propertyA, propertyB)
    {
        let line = new FLOW.Line(propertyA, propertyB);
        this.lines.push(line);
        propertyB.block.lines.push(line);
    }

    removeLine(line)
    {
        let index = this.lines.indexOf(line);
        if ( index > -1)
        {
            this.lines.splice(index, 1);
        }
    }
};
