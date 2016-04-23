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
        this.selectedProperty = null;

        this.propertyHighlighter = this.draw.circle().attr({fill: "rgba(255,255,255,0.5)"}).hide().radius(10);
        this.propertyHighlighter.style("pointer-events", "none");

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

        this.div.addEventListener("mousedown", (e) => {
            this.deselect();
        });
    }

    startMove(block, event)
    {
        this.moveBlock = block;
        this.moveOffset = { x: event.clientX - block.x, y: event.clientY - block.y };
    }

    clickProperty(target)
    {
        if (this.selectedProperty === null)
        {
            this.selectedProperty = target;
            target.block.group.put(this.propertyHighlighter).center(target.x, target.y).show();
            this.propertyHighlighter.attr("fill", target.color).opacity(0.5);
            this.propertyHighlighter.front();
        }
        else if (target === this.selectedProperty){
            this.deselect();
        }
        else
        {
            if (this.selectedProperty.connect(target))
            {
                this.deselect();
            }
            else {
                this.deselect();
                this.clickProperty(target);
            }
        }
    }

    deselect()
    {
        this.selectedProperty = null;
        this.propertyHighlighter.hide();
    }
};
