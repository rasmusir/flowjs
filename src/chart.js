"use strict";

FLOW.Chart = class Chart {
    constructor(parent)
    {
        this.parent = parent;

        this.div = document.createElement("div");
        this.div.classList.add("flow-chart");
        this.div.id = "flowchart";
        this._events = [];
        this.blocks = [];
        this.currID = 0;
        this.dragView = null;
        parent.appendChild(this.div);

        this.draw = SVG(this.div);
        this.selectedProperty = null;

        this.propertyHighlighter = this.draw.circle().attr({fill: "rgba(255,255,255,0.5)"}).hide().radius(10);
        this.propertyHighlighter.style("pointer-events", "none");

        this.contextmenu = new FLOW.ContextMenu(this);
        window.requestAnimationFrame(() => {
            this.draw.viewbox({x: 0, y: 0, width: this.div.clientWidth, height: this.div.clientHeight});
        });

        this.div.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            e.cancelBubble = true;

            this.contextmenu.show(e.clientX, e.clientY);
        });

        window.addEventListener("mousemove", (e) => {
            if (this.moveBlock)
            {
                this.moveBlock.x = e.clientX - this.moveOffset.x;
                this.moveBlock.y = e.clientY - this.moveOffset.y;
            }
            if (this.dragView)
            {
                let x = this.dragView.x - e.clientX;
                let y = this.dragView.y - e.clientY;
                this.draw.viewbox({x: x, y: y, width: this.dragView.width, height: this.dragView.height});
                this.div.style.backgroundPositionX = -x + "px";
                this.div.style.backgroundPositionY = -y + "px";
            }
        });

        window.addEventListener("mouseup", (e) => {
            this.moveBlock = null;
            this.dragView = null;
        });

        this.div.addEventListener("mousedown", (e) => {
            if (!this.contextmenu.checkClose(e))
            {
                return;
            }
            if (e.which === 1)
            {
                this.deselect();
            }
            if (e.which === 2)
            {
                let vb = this.draw.viewbox();
                this.dragView = {x: e.clientX + vb.x, y: e.clientY + vb.y, width: this.div.clientWidth, height: this.div.clientHeight};
            }
        });
    }

    tabEvent()
    {
        let vb = this.draw.viewbox();
        this.draw.viewbox({x: vb.x, y: vb.y, width: this.div.clientWidth, height: this.div.clientHeight});
    }

    newID()
    {
        return ++this.currID;
    }

    run()
    {
        let instance = new FLOW.Instance(this);
        instance.run();
        return instance;
    }

    add(func, connect)
    {
        if (func.function)
        {
            let b = new FLOW.Block(this, func);
            this.blocks.push(b);
            if (connect && this.selectedProperty)
            {
                let targetProps = null;
                if (this.selectedProperty.output)
                {
                    targetProps = b.inputs;
                }
                else {
                    targetProps = b.outputs;
                }
                targetProps.forEach((p) => {
                    if (p.type === this.selectedProperty.type || p.type === FLOW.DATATYPES.ANY)
                    {
                        p.connect(this.selectedProperty);
                    }
                });
            }
            return b;
        }
    }

    remove(block)
    {
        this.blocks = this.blocks.filter((b) => {
            return (b !== block);
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

    getEvents()
    {
        return this._events;
    }
};
