"use strict";

FLOW.Compiler = (function () {
    class Compiler
    {
        constructor(chart)
        {
            this.chart = chart;
            this.depth = 0;
            this.parts = [];
            this.name = "";
        }

        compile()
        {
            let entrypoint = this.findEntrypoint();
            if (!entrypoint)
            {
                (new FLOW.Toaster("No clear entrypoint found", true)).show();
                return;
            }
            let scope = new Scope(this, 0);
            let result = scope.compileBlock(entrypoint);


            let code = result.code;

            let preps = "";
            for (let d in FLOW._definitions)
            {
                FLOW._definitions[d].prepends.forEach((p) => {
                    preps += p.replace(/(\s+(?=\W))|(\B\s+)/g, "");
                });
            }

            code = '"use strict";' + preps + code + "if(main)main();";

            console.log(result);
            console.log(code);

            window.onerror = (m, f, l, c, e) => {
                let a = arguments;
                (new FLOW.Toaster("Something went wrong!", true)).show();
            };
            eval(code);
            window.onerror = null;
        }

        findEntrypoint()
        {
            for (let i = 0; i < this.chart.blocks.length; i++)
            {
                let block = this.chart.blocks[i];
                if (block.in === 0 && block.out > 0)
                {
                    return block;
                }
            }
        }
    }

    class Scope
    {
        constructor(parent, child)
        {
            this.parent = parent;
            this.parts = [];
            this.depth = this.parent.depth + 1;
            this.child = child;
            this.name = parent.name + String.fromCharCode(97 + child);
            this.vars = parent.vars || new Map();
        }

        compileBlock(block, mapping, inline)
        {
            mapping = mapping || {children:[], start:0, end:0};
            mapping.block = block;
            let func = block.function;
            let returns = func.returns;
            let args = func.args;
            let name = func.name;
            if (func.def.opt.prefix)
            {
                name = func.def.opt.prefix + name;
            }

            let avar = new Map();
            let vname = null;
            let string = "";

            if (returns.length > 0 && !inline)
            {
                vname = this.name + "_" + String.fromCharCode(97 + this.vars.size);
                this.vars.set(block.id, vname);
            }

            if (!func.pattern)
            {
                if (vname && !inline)
                {
                    string += "let " + vname + " = ";
                }
            }

            let dist = string.length + name.length + 1;

            for (let i = 0; i < block.inputs.length; i++)
            {
                let input = block.inputs[i];
                if (input.source)
                {
                    let sourcevname = this.vars.get(input.source.block.id);
                    if (sourcevname)
                    {
                        let child = {children:[], start: dist, end:0};
                        mapping.children.push(child);
                        let svn = sourcevname + (input.source.block.function.pattern ? "_" + input.source.name : "");
                        dist += svn.length;
                        avar[input.name] = svn;
                    }
                    else
                    {
                        let child = {children:[], start: dist, end:0};
                        mapping.children.push(child);
                        let res = this.compileBlock(input.source.block, child, true).code;
                        dist += res.length;
                        avar[input.name] = res;
                    }
                }
                else
                {
                    avar[input.name] = "null";
                    dist += 4;
                }
                dist++;
            }

            if (!func.pattern)
            {
                string += name + "(" + joinAssocArray(avar) + ")" + (!inline ? ";" : "") + "\n";
                dist += inline ? 0 : 1;
            }
            else
            {
                let rnames = [];
                vname = block.outputs.forEach((r) => {
                    if (r.type === FLOW.DATATYPES.TRIGGER)
                    {
                        let child = {children:[], start: dist, end:0};
                        mapping.children.push(child);
                        rnames[r.name] = r.trigger ? this.compileBlock(r.trigger.block, child).code : "/* no code */";
                    }
                    else
                    {
                        rnames[r.name] = vname + "_" + r.name;
                    }
                });
                string = func.apply(avar, rnames);
            }

            string = string.replace(/(\s+(?=\W))|(\B\s+)/g, "");
            mapping.end = mapping.start + string.length;

            if (block.nextBlock)
            {
                let child = {children:[], start: mapping.end + 1, end:0};
                mapping.children.push(child);
                string += this.compileBlock(block.nextBlock, child).code;
            }

            return {code: string, mappings: mapping};
        }
    }

    function joinAssocArray(a, s)
    {
        let keys = [];
        for (let key in a) {
            keys.push(a[key]);
        }
        return keys.join(s);
    }

    return Compiler;
})();
