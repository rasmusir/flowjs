"use strict";

FLOW.ContextMenu = class ContextMenu
{
    constructor(chart)
    {
        this.chart = chart;

        this.open = false;

        this.div = document.createElement("div");

        this.div.classList.add("ContextMenu");
        chart.div.appendChild(this.div);

        this.input = document.createElement("input");
        this.div.appendChild(this.input);

        this.list = document.createElement("div");
        this.list.classList.add("list");
        this.div.appendChild(this.list);

        this.x = 0;
        this.y = 0;

        this.selected = null;

        this.input.addEventListener("mousedown", (e) => {
            //e.cancelBubble = true;
            //e.stopPropagation();
        });

        this.input.addEventListener("keydown", (e) => {
            if (e.keyCode === 13)
            {
                this.select(this.selected);
                e.cancelBubble = true;
                e.stopPropagation();
                e.preventDefault();
            }
        });

        let w = null;

        this.input.addEventListener("input", (e) => {
            if (w)
            {
                window.clearTimeout(w);
            }

            w = setTimeout(() => {
                this.find(e);
            }, 100);
        });

        window.addEventListener("keydown", (e) => {
            if (!this.open && e.keyCode === 13)
            {
                this.show(this.x, this.y);
                e.cancelBubble = true;
                e.stopPropagation();
                e.preventDefault();
            }
        });
    }

    checkClose(e)
    {
        e.preventDefault();

        if (this.select(e.target.f))
        {
            return true;
        }
        if (e.target.do)
        {
            e.target.do();
        }
        if (e.target === this.div)
        {
            e.cancelBubble = true;
            return false;
        }
        this.close();
        return true;
    }

    show(x, y, block)
    {
        this.div.style.top = y + "px";
        this.div.style.left = x + "px";
        this.div.style.display = "block";
        this.x = x;
        this.y = y;
        this.block = block;
        this.input.focus();
        this.find(null, block);
        this.open = true;
    }

    close()
    {
        this.div.style.display = "none";
        this.input.value = "";
        this.input.blur();
        this.open = false;
    }

    select(i)
    {
        if (i)
        {
            let b = this.chart.add(i, true);
            b.x = this.x + this.chart.draw.viewbox().x - this.chart.div.offsetLeft;
            b.y = this.y + this.chart.draw.viewbox().y - this.chart.div.offsetTop;

            this.close();
        }
    }

    find(e)
    {
        let text = e ? e.target.value : "";
        this.selected = null;
        this.list.innerHTML = "";
        let prop = this.chart.selectedProperty;
        if (this.block)
        {
            let category = document.createElement("div");
            category.className = "category";

            let del = document.createElement("div");
            del.className = "item";
            del.innerHTML = "Remove";
            del.do = () => {
                this.block.remove();
                this.block = null;
            };
            category.appendChild(del);

            this.list.appendChild(category);
        }
        else if (prop !== null || text !== "")
        {
            for (let dn in FLOW._definitions) {

                let count = 0;
                let d = FLOW._definitions[dn];
                let category = document.createElement("div");

                category.classList.add("category");
                let title = document.createElement("div");
                title.classList.add("title");
                title.appendChild(document.createTextNode(dn));
                category.appendChild(title);
                let functions = d.find(text);
                functions.forEach((f) => {
                    let filter = prop && prop.type !== FLOW.DATATYPES.TRIGGER ? true : false;
                    let item = document.createElement("div");
                    item.classList.add("item");
                    item.f = f;
                    if (!this.selected)
                    {
                        item.classList.add("selected");
                        this.selected = f;
                    }

                    let iname = document.createElement("span");
                    iname.f = f;
                    iname.innerHTML = f.name + " ";

                    f.args.forEach((a) => {

                        if (prop && ((prop.type === a.type || ((a.type === FLOW.DATATYPES.ANY || prop.type === FLOW.DATATYPES.ANY) && a.type !== FLOW.DATATYPES.TRIGGER)) && (prop.output !== a.output)))
                        {
                            filter = false;
                        }

                        let adiv = document.createElement("span");
                        adiv.className = "argument";
                        adiv.innerHTML = a.name + " ";
                        adiv.f = f;
                        adiv.style.color = `rgb(${FLOW.PROPERTYCOLORS.get(a.type).r},${FLOW.PROPERTYCOLORS.get(a.type).g},${FLOW.PROPERTYCOLORS.get(a.type).b})`;
                        if (a.type === FLOW.DATATYPES.TRIGGER)
                        {
                            adiv.style.fontStyle = "italic";
                        }
                        iname.appendChild(adiv);
                    });

                    let arrow = document.createElement("span");
                    arrow.className = "arrow";
                    arrow.f = f;
                    iname.appendChild(arrow);

                    if (f.returns.length > 0)
                    {
                        f.returns.forEach((r) => {

                            if (prop && ((prop.type === r.type || ((r.type === FLOW.DATATYPES.ANY || prop.type === FLOW.DATATYPES.ANY) && r.type !== FLOW.DATATYPES.TRIGGER)) && (prop.output !== r.output)))
                            {
                                filter = false;
                            }

                            let rdiv = document.createElement("span");
                            rdiv.className = "return";
                            rdiv.innerHTML = r.name + " ";
                            rdiv.f = f;
                            rdiv.style.color = `rgb(${FLOW.PROPERTYCOLORS.get(r.type).r},${FLOW.PROPERTYCOLORS.get(r.type).g},${FLOW.PROPERTYCOLORS.get(r.type).b})`;
                            if (r.type === FLOW.DATATYPES.TRIGGER)
                            {
                                rdiv.style.fontStyle = "italic";
                            }
                            iname.appendChild(rdiv);
                        });
                    }

                    if (filter)
                    {
                        return;
                    }
                    item.appendChild(iname);

                    category.appendChild(item);
                    count++;
                });
                if (count > 0)
                {
                    this.list.appendChild(category);
                }
            }
        }
    }
};
