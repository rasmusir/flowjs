"use strict";

FLOW.Chart = class Chart {
    constructor(parent)
    {
        this.parent = parent;

        this.div = document.createElement("div");
        this.div.classList.add("flow-chart");
        this.div.id = "flowchart";
        parent.appendChild(this.div);

        this.draw = SVG(this.div);

        let b = new FLOW.Block(this);
        let b2 = new FLOW.Block(this);
        let b3 = new FLOW.Block(this);
        b.x = 300;
        b.y = 200;

        b2.x = 100;
        b2.y = 100;

        b3.x = 800;
        b3.y = 700;

        b2.next.connect(b.trigger);
        b.next.connect(b3.trigger);

        window.addEventListener("mousemove", (e) => {
            if (this.moveBlock)
            {
                this.moveBlock.x = e.clientX - this.moveOffset.x;
                this.moveBlock.y = e.clientY - this.moveOffset.y;
            }
        });

        window.addEventListener("mouseup", (e) => {
            this.moveBlock = null;
        });
    }

    startMove(block, event)
    {
        this.moveBlock = block;
        this.moveOffset = { x: event.clientX - block.x, y: event.clientY - block.y };
    }
};
