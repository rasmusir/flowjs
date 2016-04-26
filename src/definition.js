"use strict";

FLOW.Definition = class Definition
{
    constructor(name)
    {
        this.name = name;
        this.functions = [];
        this.variables = [];
        this.events = [];
    }

    function(name, f, ...args)
    {
        let pd = [];
        args.forEach((arg) => {
            pd.push(new FLOW.PropertyDescriptor(arg.name, arg.type, arg.output, arg.max));
        });
        this.functions[name] = {name: name, f: f, args: pd};
    }

    variable(name, ...vars)
    {
        let pd = [];
        for (let i = 0; i < vars.length; i += 2)
        {
            let value = vars[i];
            let type = vars[i + 1];
            pd.push(new FLOW.PropertyDescriptor(value, type, true, -1, value));
            this.variables[name] = {name: name, args: pd, v: true};
        }
    }

    event(name, handler)
    {
        this.events[name] = {name: name, e: handler};
    }

    get(name)
    {
        let f = this.functions[name];
        if (f)
        {
            return f;
        }
        let v = this.variables[name];
        if (v)
        {
            return v;
        }
        let e = this.events[name];
        if (e)
        {
            return e;
        }
        return null;
    }
};

FLOW._definitions = [];

FLOW.getDefinition = function getDefinition(namespace) {
    let d = FLOW._definitions[namespace];
    if (d)
    {
        return d;
    }
    return null;
};

FLOW.define = function (name, f) {
    let d = new FLOW.Definition(name);
    FLOW._definitions[name] = d;
    f(d);
};
