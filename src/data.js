"use strict";

FLOW.DATATYPES = {
    UNKNOWN: 0,
    NUMBER : 1,
    STRING : 2,
    ARRAY : 3,
    OBJECT : 4
};

FLOW.Data = class Data
{
    constructor()
    {
        this.datatype = FLOW.DATATYPE.UNKNOWN;
        this.value = null;
    }
};
