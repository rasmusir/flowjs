"use strict";
FLOW.define("test", (def) => {

    let handler = (run) => {
        run();
    };

    let customFunction = (a1, a2) => {
        console.warn(a1 + " " + a2);
    };

    let combine = (a, b) => {
        return a + b;
    };

    let repeat = (trigger) => {
        for (let i = 0; i < 5; i++)
        {
            trigger.run();
        }
    };

    def.event("begin", handler);
    def.function("log", console.log.bind(console), {name: "object", type: FLOW.DATATYPES.ANY});
    def.function("warn", customFunction, {name: "text", type: FLOW.DATATYPES.STRING}, {name: "text", type: FLOW.DATATYPES.STRING});
    def.function("combine", combine,
                {name: "text", type: FLOW.DATATYPES.STRING},
                {name: "text", type: FLOW.DATATYPES.STRING},
                {name: "text", type: FLOW.DATATYPES.STRING, output: true});
    def.function("measure", (s) => { return s.length; }, {name: "string", type: FLOW.DATATYPES.STRING}, {name: "length", type: FLOW.DATATYPES.NUMBER, output: true});
    def.function("repeat", repeat, {name: "completed", type: FLOW.DATATYPES.TRIGGER});
    def.function("to string", (o) => { return o; }, {name: "object", type: FLOW.DATATYPES.ANY}, {name: "string", type: FLOW.DATATYPES.STRING, output:true});
    def.variable("strings", "Hello", FLOW.DATATYPES.STRING, "World", FLOW.DATATYPES.STRING);

    //TODO Add .inputs and .outputs instead of inline objects in the definition function.
});

FLOW.define("Math", (d) => {
    d.function("min", Math.min, {name: "a", type: FLOW.DATATYPES.NUMBER}, {name: "b", type: FLOW.DATATYPES.NUMBER}, {name: "value", type: FLOW.DATATYPES.NUMBER, output: true});
    d.function("max", Math.max, {name: "a", type: FLOW.DATATYPES.NUMBER}, {name: "b", type: FLOW.DATATYPES.NUMBER}, {name: "value", type: FLOW.DATATYPES.NUMBER, output: true});
    d.function("cos", Math.cos, {name: "radians", type: FLOW.DATATYPES.NUMBER}, {name: "value", type: FLOW.DATATYPES.NUMBER, output: true});
});
