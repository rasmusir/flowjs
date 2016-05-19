"use strict";

FLOW.Definition = (function () {

    let datatypes = {
        "s" : FLOW.DATATYPES.STRING,
        "n" : FLOW.DATATYPES.NUMBER,
        "*" : FLOW.DATATYPES.ANY,
        "t" : FLOW.DATATYPES.TRIGGER,
        "o" : FLOW.DATATYPES.OBJECT,
        "a" : FLOW.DATATYPES.ARRAY
    };

    function getDatatype (n)
    {
        if (datatypes[n] !== undefined) { return datatypes[n]; }
        return FLOW.DATATYPES.get(n);
    }

    class Definition
    {
        constructor(name, opt)
        {
            this.name = name;
            this.patterns = new Map();
            this.functions = [];
            this.properties = [];
            this.methods = [];
            this.opt = opt || {};
            this.prepends = [];
        }

        type(name, color)
        {
            FLOW.DATATYPES.define(name, color);
        }

        prepend(code)
        {
            this.prepends.push(code);
        }

        function(def, opt)
        {
            opt = opt || {};
            //splitting the definition into it's parts
            let fp = def.indexOf("("); //The first paranthesis
            let lp = def.indexOf(")"); //The second paranthesis
            let name = def.substr(0, fp).trim(); //The name of the function
            let args = def.substr(fp + 1, lp - fp - 1).split(",").map((s) => { return s.trim(); }); //Split the arguments into an array
            let rets = def.substr(lp + 1).split(",").map((s) => { return s.trim(); }).filter((s) => { return s.length>0; }); //Split the returns into an array

            let isExternal = name.indexOf(".") !== -1; //Is the function external or internal?

            // Create property descriptors for arguments and returns
            let argsDescriptors = [];
            args.forEach((arg) => {
                if (arg.length === 0) { return; }
                let split = arg.split(":").map((s) => { return s.trim(); });
                argsDescriptors.push(new FLOW.PropertyDescriptor(split[1], getDatatype(split[0]), false, 1));
            });
            let retsDescriptors = [];
            rets.forEach((ret) => {
                let split = ret.split(":").map((s) => { return s.trim(); });
                retsDescriptors.push(new FLOW.PropertyDescriptor(split[1], getDatatype(split[0]), true, -1));
            });

            // Finally saving the function definition
            this.functions[name] = new Function(name, argsDescriptors, retsDescriptors, isExternal, opt, this);
        }

        method(def)
        {
            this.function(def, {omittNext: true, omittTrigger: true});
        }

        property(def)
        {

        }

        pattern(def, pat, opt)
        {
            opt = opt || {};
            //splitting the definition into it's parts
            let fp = def.indexOf("("); //The first paranthesis
            let lp = def.indexOf(")"); //The second paranthesis
            let name = def.substr(0, fp).trim(); //The name of the function
            let args = def.substr(fp + 1, lp - fp - 1).split(",").map((s) => { return s.trim(); }); //Split the arguments into an array
            let rets = def.substr(lp + 1).split(",").map((s) => { return s.trim(); }).filter((s) => { return s.length>0; }); //Split the returns into an array

            // Create property descriptors for arguments and returns
            let argsDescriptors = [];
            args.forEach((arg) => {
                if (arg.length === 0) { return; }
                let split = arg.split(":").map((s) => { return s.trim(); });
                argsDescriptors.push(new FLOW.PropertyDescriptor(split[1], getDatatype(split[0]), false, 1));
            });
            let retsDescriptors = [];
            rets.forEach((ret) => {
                let split = ret.split(":").map((s) => { return s.trim(); });
                retsDescriptors.push(new FLOW.PropertyDescriptor(split[1], getDatatype(split[0]), true, -1));
            });

            // Finally saving the function definition
            this.patterns.set(name, new Pattern(name, argsDescriptors, retsDescriptors, pat, opt, this));
        }

        get(name)
        {
            let f = this.functions[name];
            if (f)
            {
                return f;
            }
            let p = this.patterns.get(name);
            if (p)
            {
                return p;
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
            this.patterns.forEach((v, k) => {
                if (regex.test(k))
                {
                    results.push(v);
                }
            });
            return results;
        }
    };

    class Function
    {
        constructor(name, args, returns, external, opt, def)
        {
            this.args = args;
            this.returns = returns;
            this.external = external;
            this.function = true;
            this.name = name;
            this.def = def;
            this.opt = opt;
        }
    }

    class Pattern extends Function
    {
        constructor(name, args, returns, pattern, opt, def)
        {
            super(name, args, returns, false, opt, def);
            this.pattern = pattern;
        }

        apply(args, rets)
        {
            let string = this.pattern;
            let argnames = this.args.map((a) => {
                return a.name;
            });
            if (argnames.length > 0)
            {


                let reg = new RegExp("\\$(" + argnames.join("|") + ")", "g");
                string = this.pattern.replace(reg, (matched) => {
                    return args[matched.substr(1)];
                });
            }
            let retnames = this.returns.map((a) => {
                return a.name;
            });
            if (retnames.length > 0)
            {

                let reg = new RegExp("\\$(" + retnames.join("|") + ")", "g");
                string = string.replace(reg, (matched) => {
                    return rets[matched.substr(1)];
                });
            }

            return string;
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

FLOW.define = function (name, f, opt) {
    let d = new FLOW.Definition(name, opt);
    FLOW._definitions[name] = d;
    f(d);
};
