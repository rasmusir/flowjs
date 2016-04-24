"use strict";

FLOW.Instance = class Instance
{
    constructor(chart)
    {
        this.chart = chart;
        this.events = chart.getEvents();
    }

    run()
    {
        this.events.forEach((e) => {
            e.run((...args) => {
                e.next.run(...args);
            });
        });
    }
};
