"use strict";

FLOW.Property = class Property {
    constructor(block, x, y)
    {
        this.text = "noname";
        this.block = block;
        this.x = x;
        this.y = y;
        this.radius = 6;
        this.connector = this.block.mask.circle(this.radius).move(this.x, this.y).attr({fill: "rgba(0,0,0,1)"});
    }

    get globalX() { return this.block.x + this.x + this.radius / 2; }
    get globalY() { return this.block.y + this.y + this.radius / 2; }

    connect(property)
    {
        this.block.connect(this, property);
    }
};

FLOW.NextProperty = class NextProperty extends FLOW.Property{
    constructor(block, x, y)
    {
        super(block, x, y);
        this.text = "Next";
    }
};

FLOW.TriggerProperty = class TriggerProperty extends FLOW.Property{
    constructor(block, x, y)
    {
        super(block, x, y);
        this.text = "Trigger";
    }
};
