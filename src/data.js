"use strict";

FLOW.DATATYPES = {
    TRIGGER: 0,
    NUMBER : 1,
    STRING : 2,
    ARRAY : 3,
    OBJECT : 4,
    ANY : 5,
    CUSTOM: []
};

FLOW.DATATYPES.define = function (name, color)
{
    FLOW.DATATYPES.CUSTOM[name] = color;
};

FLOW.DATATYPES.get = function (name)
{
    if (FLOW.DATATYPES.CUSTOM[name])
    {
        return name;
    }
    return FLOW.DATATYPES.OBJECT;
};

FLOW.PROPERTYCOLORS = [
    {r: 255, g: 255, b: 255}, //Trigger
    {r: 255, g: 160, b: 100}, //Number
    {r: 100, g: 255, b: 100}, //String
    {r: 100, g: 100, b: 255}, //Array
    {r: 255, g: 255, b: 150}, //Object
    {r: 255, g: 255, b: 255} //Any
];

FLOW.PROPERTYCOLORS.get = function (type)
{
    if (typeof (type) === "string" && FLOW.DATATYPES.CUSTOM[type])
    {
        return FLOW.DATATYPES.CUSTOM[type];
    }
    return FLOW.PROPERTYCOLORS[type];
};

FLOW.PROPERTYPATTERNS = {
    0: [0]
};
