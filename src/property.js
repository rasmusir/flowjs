"use strict";

FLOW.PROPERTYCOLORS = [
    {r: 255, g: 255, b: 255},
    {r: 255, g: 100, b: 100},
    {r: 100, g: 255, b: 100},
    {r: 100, g: 100, b: 255},
    {r: 255, g: 255, b: 100}
];

/**
 * PropertyDescriptor
 * @class
 * @param [string] name
 * @param [FLOW.DATATYPES] type
 */
FLOW.PropertyDescriptor = class PropertyDescriptor
{
    constructor(name, type, output, maxConnections)
    {
        this.name = name;
        this.type = FLOW.DATATYPES.UNKNOWN || type;
        this.output = output || false;
        this.maxConnections = maxConnections || 1;
    }
};

FLOW.Property = class Property {
    constructor(block, o, stop)
    {
        this.text = "noname";
        this.block = block;
        this.x = o.x;
        this.y = o.y;
        this.radius = 3;
        this.color = FLOW.PROPERTYCOLORS[o.type || 0];
        this.connections = 0;
        this.maxConnections = o.maxConnections || -1;
        this.output = o.output;
        this.type = o.type;
        if (!stop)
        {
            this.connector = this.block.group.circle().radius(this.radius).center(this.x, this.y).attr({fill: "transparent", stroke: `rgba(${this.color.r},${this.color.g},${this.color.b},0.8)`}).stroke({width: "2px"});
            this.init();
        }
    }

    get globalX() { return this.block.x + this.x; }
    get globalY() { return this.block.y + this.y; }
    get canConnect()
    {
        return this.maxConnections === -1 || this.connections < this.maxConnections;
    }

    set connected(v)
    {
        if (v)
        {
            this.connector.attr("fill", `rgba(${this.color.r},${this.color.g},${this.color.b},1)`);
        }
        else {
            this.connector.attr("fill", "transparent");
        }
    }

    init()
    {
        this.connector.mousedown((e) => {
            e.cancelBubble = true;
            this.block.chart.clickProperty(this);
        });
    }

    connect(property)
    {
        if (!this.canConnect || !property.canConnect || property.output === this.output
            || property.block === this.block || property.type !== this.type || this.block.hasLine(property, this))
        {
            return false;
        }
        this.block.connect(this, property);
        property.connected = true;
        this.connected = true;
        this.connections++;
        property.connections++;
        return true;
    }

    disconnect(property)
    {
        this.connections--;
        property.connections--;

        this.connected = this.connections !== 0;
        property.connected = property.connections !== 0;
    }

    remove()
    {
        this.connector.remove();
    }
};

FLOW.NextProperty = class NextProperty extends FLOW.Property{
    constructor(block, o)
    {
        super(block, {x: o.x, y: o.y, maxConnections: -1}, true);
        this.radius = 8;
        this.text = "Next";
        this.output = true;
        this.connector = this.block.group.path("M0,0 L4,0 L8,4 L4,8 L0,8 L0,0").center(this.x, this.y).attr({fill: "transparent", stroke: `rgba(${this.color.r},${this.color.g},${this.color.b},0.8)`}).stroke({width: "2px", linecap: "round", linejoin:"round"});
        this.init();
    }
};

FLOW.TriggerProperty = class TriggerProperty extends FLOW.Property{
    constructor(block, o)
    {
        super(block, {x: o.x, y: o.y, maxConnections: -1}, true);
        this.radius = 8;
        this.text = "Trigger";
        this.output = false;
        this.connector = this.block.group.path("M0,0 L4,0 L8,4 L4,8 L0,8 L0,0").center(this.x, this.y).attr({fill: "transparent", stroke: `rgba(${this.color.r},${this.color.g},${this.color.b},0.8)`}).stroke({width: "2px", linecap: "round", linejoin:"round"});
        this.init();
    }
};

FLOW.NumberProperty = class NumberProperty extends FLOW.Property
{
    //TODO Implement NumberProperty
};
