"use strict";

FLOW.Definition = (function () {
    class Definition
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
            this.functions[name] = {name: name, f: f, args: pd, def: this};
        }

        variable(name, ...vars)
        {
            let pd = [];
            for (let i = 0; i < vars.length; i += 2)
            {
                let value = vars[i];
                let type = vars[i + 1];
                pd.push(new FLOW.PropertyDescriptor(value, type, true, -1, value));
                this.variables[name] = {name: name, args: pd, v: true, def: this};
            }
        }

        event(name, handler)
        {
            this.events[name] = {name: name, e: handler, def: this};
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

        find(name)
        {
            let results = [];
            let regex = new RegExp(`${name}`, "i");
            for (let pn in this.functions)
            {
                if (regex.test(pn))
                {
                    results.push(this.functions[pn]);
                }
            }
            for (let pn in this.events)
            {
                if (regex.test(pn))
                {
                    results.push(this.events[pn]);
                }
            }
            for (let pn in this.variables)
            {
                if (regex.test(pn))
                {
                    results.push(this.variables[pn]);
                }
            }
            return results;
        }
    };

    class Function
    {
        constructor(name, f)
        {
            this.inputs = [];
            this.outputs = [];
            this.f = f;
            this.name = name;
        }

        inputs(...arg)
        {
            return this;
        }
    }
    return Definition;
})();

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
