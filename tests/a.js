"use strict";
function t()
{
    let test = {
        strings: {
            hello: "hello",
            world: "world"
        },
        combine: function (a, b) { return a + b; }
    };

    test.begin = () => {
        for (let i = 0; i<100000000; i++)
        {
            let a = test.combine(test.strings.hello, test.strings.world);
            let b = a.length;
            let c = b;
        }
    };

    test.begin2 = () => {
        for (let i = 0; i<100000000; i++)
        {
            let c = test.combine(test.strings.hello, test.strings.world).length;
        }
    };


    let a = null, b = null, c = null;

    a = performance.now();
    test.begin();
    b = performance.now();
    test.begin2();
    c = performance.now();


    console.log("spread took", (b - a).toFixed(5));
    console.log("collapsed took", (c - b).toFixed(5));
}
