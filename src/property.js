"use strict";

FLOW.PROPERTYCOLORS = [
    {r: 255, g: 255, b: 255},
    {r: 255, g: 100, b: 100},
    {r: 100, g: 255, b: 100},
    {r: 100, g: 100, b: 255},
    {r: 255, g: 255, b: 100},
    {r: 255, g: 255, b: 255}
];

/**
 * PropertyDescriptor
 * @class
 * @param [string] name
 * @param [FLOW.DATATYPES] type
 */
FLOW.PropertyDescriptor = class PropertyDescriptor
{
    constructor(name, type, output, maxConnections, value)
    {
        this.name = name;
        this.type = FLOW.DATATYPES.TRIGGER || type;
        this.output = output || false;
        this.maxConnections = maxConnections || (output ? -1 : 1);
        this.value = value || null;
    }
};

FLOW.Property = class Property {
    constructor(block, o, stop)
    {
        this.name = o.name || "noname";
        this.block = block;
        this.x = o.x;
        this.y = o.y;
        this.value = o.value || null;
        this.radius = 3;
        this.color = FLOW.PROPERTYCOLORS[o.type || 0];
        this.connections = 0;
        this.maxConnections = o.maxConnections || -1;
        this.output = o.output;
        this.type = o.type;
        this.targets = [];
        if (!stop)
        {
            this.text = this.block.group.plain(this.name).attr("fill", `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.2)`);
            if (this.output)
            {
                this.text.center(this.x - this.text.length() / 2 - this.radius - 3, this.y);
            }
            else
            {
                this.text.center(this.x + this.text.length() / 2 + this.radius + 3, this.y);
            }
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
            || property.block === this.block || (property.type !== this.type && (property.type !== FLOW.DATATYPES.ANY && this.type !== FLOW.DATATYPES.ANY)) || this.block.hasLine(property, this))
        {
            return false;
        }
        if (this.output)
        {
            property.source = this;
        }
        else {
            this.source = property;
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
        if (this.source === property)
        {
            this.source = null;
        }
        else if (property.source === this){
            property.source = null;
        }

        this.connections--;
        property.connections--;

        this.connected = this.connections !== 0;
        property.connected = property.connections !== 0;
    }

    remove()
    {
        this.connector.remove();
    }

    getValue()
    {
        if (this.source)
        {
            return this.source.getValue();
        }
        return this.value;
    }
};

FLOW.NextProperty = class NextProperty extends FLOW.Property{
    constructor(block, o)
    {
        super(block, {x: o.x, y: o.y, maxConnections: 1}, true);
        this.type = FLOW.DATATYPES.TRIGGER;
        this.radius = 8;
        this.text = "Next";
        this.output = true;
        this.triggers = [];
        this.connector = this.block.group.path("M0,0 L4,0 L8,4 L4,8 L0,8 L0,0").center(this.x, this.y).attr({fill: "transparent", stroke: `rgba(${this.color.r},${this.color.g},${this.color.b},0.8)`}).stroke({width: "2px", linecap: "round", linejoin:"round"});
        this.init();
    }

    connect(property)
    {
        let s = super.connect(property);
        if (s)
        {
            this.triggers.push(property);
        }
        return s;
    }

    disconnect(property)
    {
        this.triggers.splice(this.triggers.indexOf(property));
        super.disconnect(property);
    }

    run()
    {
        this.triggers.forEach((t) => {
            t.run();
        });
    }
};

FLOW.TriggerProperty = class TriggerProperty extends FLOW.Property{
    constructor(block, o)
    {
        super(block, {x: o.x, y: o.y, maxConnections: -1}, true);
        this.type = FLOW.DATATYPES.TRIGGER;
        this.radius = 8;
        this.text = "Trigger";
        this.output = false;
        this.connector = this.block.group.path("M0,0 L4,0 L8,4 L4,8 L0,8 L0,0").center(this.x, this.y).attr({fill: "transparent", stroke: `rgba(${this.color.r},${this.color.g},${this.color.b},0.8)`}).stroke({width: "2px", linecap: "round", linejoin:"round"});
        this.init();
    }

    connect(property)
    {
        return property.connect(this);
    }

    disconnect(property)
    {
        return property.disconnect(this);
    }

    run()
    {
        this.block.run();
    }
};

FLOW.NumberProperty = class NumberProperty extends FLOW.Property
{
    //TODO Implement NumberProperty
};
