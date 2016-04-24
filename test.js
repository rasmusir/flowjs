"use strict";
FLOW.define("test", (def) => {

    let handler = (run) => {
        window.setTimeout(function () {
            run();
        }, 1000);
    };

    let customFunction = (a1, a2) => {
        console.warn(a1 + " " + a2);
    };

    let combine = (a, b) => {
        return a + b;
    };

    def.event("begin", handler);
    def.function("log", console.log.bind(console), {name: "text", type: FLOW.DATATYPES.STRING});
    def.function("warn", customFunction, {name: "text", type: FLOW.DATATYPES.STRING}, {name: "text", type: FLOW.DATATYPES.STRING});
    def.function("combine", combine,
                {name: "text", type: FLOW.DATATYPES.STRING},
                {name: "text", type: FLOW.DATATYPES.STRING},
                {name: "text", type: FLOW.DATATYPES.STRING, output: true});
    def.variable("hello", "hello", FLOW.DATATYPES.STRING);
    def.variable("world", "world", FLOW.DATATYPES.STRING);
});
