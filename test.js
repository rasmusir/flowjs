"use strict";
FLOW.define("common", (d) => {

    d.function("console.log(*:value)");

    d.pattern("Store(n:in) n:value", `
        let $value = $in;
    `);

    d.pattern("For(n:count) t:do,n:i", `
        for (let $i = 0; $i < $count; $i++)
        {
            $do
        }
    `);

    d.pattern("Run() t:code", `
        function main()
        {
            $code
        }
    `, {omittNext: true, omittTrigger: true});

    d.pattern("TryCatch() t:try,t:catch,o:error,t:finally", `
        try
        {
            $try
        }
        catch ($error)
        {
            $catch
        }
        finally
        {
            $finally
        }
    `);

    d.pattern("ForEachKVP(o:object) t:do,o:key,o:value", `
        for (let $key in $object) {
            let $value = $object[$key];
            $do
        }
    `);

    d.pattern("ForEach(a:array) t:do, o:object", `
        $array.forEach(($object) => {
            $do
        });
    `);

    d.method("s:string.toUpperCase() s:result");
    d.property("s:string.length n:length");
}, {prefix: ""});

FLOW.define("Math", (define) => {
    define.method("min(n:a, n:b) n:min");
    define.method("max(n:a, n:b) n:max");
    define.method("random() n:number");
    define.method("round(n:number) n:result");
    define.pattern("x20(n:a) n:product", `let $product = $a*20;`);
}, {prefix:"Math."});

FLOW.define("Array", (define) => {
    define.pattern("length(a:array) n:length", `$array.length`, {omittNext: true, omittTrigger: true});
});

FLOW.define("dom", (define) => {

    define.prepend(`
        ['forEach', 'map', 'filter', 'reduce', 'reduceRight', 'every', 'some'].forEach(
        function(p) {
            NodeList.prototype[p] = HTMLCollection.prototype[p] = Array.prototype[p];
        });
    `);

    define.type("node", {r: 100, g: 200, b: 255});

    define.pattern("body() node:body", "document.body", {omittNext: true, omittTrigger: true});
    define.pattern("firstChild(node:node) node:result", "$node.firstChild", {omittNext: true, omittTrigger: true});
    define.pattern("forEachChild(node:node) t:do,node:child", `
        let $child_chdrn = $node.children;
        for (let i = 0; i < $child_chdrn.length; i++)
        {
            let $child = $child_chdrn[i];
            $do
        }
    `);

    define.pattern("children(node:node) a:array", `$node.children`, {omittNext: true, omittTrigger: true});
}, {prefix: ""});

FLOW.define("Space", (define) => {

    define.type("vector", {r: 255, g: 255, b: 0});

    define.pattern("createVector(n:x, n:y, n:z) vector:newVector", `let $newVector = {x: $x, y: $y, z: $z};`);

});
