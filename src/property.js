"use strict";

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
        this.color = FLOW.PROPERTYCOLORS[o.type || 0] || FLOW.PROPERTYCOLORS.get(o.type);
        this.pattern = FLOW.PROPERTYPATTERNS[o.type || 0] || FLOW.PROPERTYPATTERNS[0];
        this.connections = 0;
        this.maxConnections = o.maxConnections || -1;
        this.output = o.output;
        this.type = o.type;
        this.targets = [];
        this.text = this.block.group.plain(this.name).attr("fill", `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.7)`);
        if (this.output)
        {
            this.text.center(this.x - this.text.length() / 2 - this.radius - 3, this.y);
        }
        else
        {
            this.text.center(this.x + this.text.length() / 2 + this.radius + 3, this.y);
        }
        if (!stop)
        {
            this.connector = this.block.group.circle().radius(this.radius).center(this.x, this.y).attr({fill: "transparent", stroke: `rgba(${this.color.r},${this.color.g},${this.color.b},1)`}).stroke({width: "2px"});
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
            || property.block === this.block
            || (this.type === FLOW.DATATYPES.TRIGGER && property.type === FLOW.DATATYPES.ANY)
            || (property.type === FLOW.DATATYPES.TRIGGER && this.type === FLOW.DATATYPES.ANY)
            || (property.type !== this.type && (property.type !== FLOW.DATATYPES.ANY && this.type !== FLOW.DATATYPES.ANY))
            || this.block.hasLine(property, this))
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

    destroy()
    {
        this.remove();
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
    constructor(block, o, main)
    {
        super(block, {x: o.x, y: o.y, maxConnections: 1, name:o.name, output: true}, true);
        this.type = FLOW.DATATYPES.TRIGGER;
        this.radius = 8;
        this.output = true;
        this.trigger = null;
        this.main = main || false;
        this.connector = this.block.group.path("M0,0 L4,0 L8,4 L4,8 L0,8 L0,0").center(this.x, this.y).attr({fill: "transparent", stroke: `rgba(${this.color.r},${this.color.g},${this.color.b},0.8)`}).stroke({width: "2px", linecap: "round", linejoin:"round"});
        this.init();
    }

    connect(property)
    {
        let s = super.connect(property);
        if (s)
        {
            this.trigger = property;
            if (this.main)
            {
                this.block.nextBlock = property.block;
            }
            property.block.triggerBlock = this.block;
            this.block.out++;
            property.block.in++;
        }
        return s;
    }

    disconnect(property)
    {
        this.trigger = null;
        if (this.main)
        {
            this.block.nextBlock = null;
        }
        property.block.triggerBlock = null;
        this.block.out--;
        property.block.in--;
        super.disconnect(property);
    }

    run()
    {
        this.trigger.run();
    }
};

FLOW.TriggerProperty = class TriggerProperty extends FLOW.Property{
    constructor(block, o)
    {
        super(block, {x: o.x, y: o.y, maxConnections: -1, name: " "}, true);
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
