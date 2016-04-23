"use strict";

FLOW.Block = class Block {
    constructor(chart, name, ...propertyDescriptors)
    {
        propertyDescriptors = propertyDescriptors || [];
        this.chart = chart;
        this.group = chart.draw.group();
        this.titleHeight = 24;
        this.height = 0;
        this.width = 130;
        this.name = name;
        this.block = this.group.rect(this.width, this.height).attr({fill: "rgba(40,40,40,0.85)", stroke: "rgba(0,0,0,0.2)"}).stroke({width: "1px"});
        let gradient = this.chart.draw.gradient('linear', (stop) => {
            stop.at({ offset: 0, color: "rgba(255,255,255,0.4)" });
            stop.at({ offset: 0.1, color: "rgba(230,230,230,0.2)" });
            stop.at({ offset: 1, color: 'rgba(100,100,100,0.2)' });
        });
        gradient.from(0, 0).to(0, 1);
        this.titleBar = this.group.rect(this.width, this.titleHeight).attr({fill: gradient});
        this.title = this.group.text(this.name).center(this.width / 2, this.titleHeight / 2).attr("fill", "white");
        this.title.addClass("noselect");

        this.lines = [];
        this.next = new FLOW.NextProperty(this, {x: this.width - 10, y: 12});
        this.trigger = new FLOW.TriggerProperty(this, {x: 10, y: 12});

        this.outputs = [];
        this.inputs = [];
        let outputs = 0;
        let inputs = 0;
        let max = 0;
        let topOffset = this.titleHeight + 10;
        propertyDescriptors.forEach((pd) => {
            if (pd.output)
            {
                let y = outputs * 20;
                max = Math.max(y, max);
                this.outputs.push(new FLOW.Property(this, {maxConnections: pd.maxConnections, y: topOffset + y, x: this.width - 10, output: pd.output, type: pd.type}));
                outputs++;
            }
            else
            {
                let y = inputs * 20;
                max = Math.max(y, max);
                this.inputs.push(new FLOW.Property(this, {maxConnections: pd.maxConnections, y: topOffset + y, x: 10, output: pd.output, type: pd.type}));
                inputs++;
            }
        });

        this.height = topOffset + max + 10;
        this.block.size(this.width, this.height);

        this.group.mousedown((e) => {
            this.group.front();
            this.chart.startMove(this, e);
        });

        this.block.filter((add) => {
            let blur = add.offset(0, 2).in(add.sourceAlpha).gaussianBlur(5).componentTransfer({a: {slope: 0.3, type: "linear"}});
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

    hasLine(propertyA, propertyB)
    {
        for (let i = 0; i < this.lines.length; i++)
        {
            let l = this.lines[i];
            if (l.match(propertyA, propertyB))
            {
                return true;
            }
        }

        return false;
    }
};

FLOW.EventBlock = class EventBlock extends FLOW.Block
{
    constructor(chart, name, ...properties)
    {
        super(chart, name, ...properties);
        this.trigger.remove();
        let gradient = this.chart.draw.gradient('linear', (stop) => {
            stop.at({ offset: 0, color: "rgba(255,255,200,0.9)" });
            stop.at({ offset: 0.1, color: "rgba(230,230,100,0.5)" });
            stop.at({ offset: 1, color: 'rgba(100,100,50,0.5)' });
        });
        gradient.from(0, 0).to(0, 1);
        this.titleBar.attr("fill", gradient);
        delete this.trigger;
    }
};

FLOW.NumberBlock = class NumberBlock extends FLOW.Block
{
    constructor(chart, name)
    {
        //TODO Make ready for NumnerProperty
        super(chart, name);
        this.trigger.remove();
        this.next.remove();
        let gradient = this.chart.draw.gradient('linear', (stop) => {
            stop.at({ offset: 0, color: "rgba(255,200,200,0.9)" });
            stop.at({ offset: 0.1, color: "rgba(230,100,100,0.5)" });
            stop.at({ offset: 1, color: 'rgba(100,50,50,0.5)' });
        });
        gradient.from(0, 0).to(0, 1);
        this.titleBar.attr("fill", gradient);
        delete this.trigger;
    }
};
