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
            e.cancelBubble = true;
            e.stopPropagation();
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

        this.input.addEventListener("input", (e) => {
            this.find(e);
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
        if (e.target === this.div)
        {
            e.cancelBubble = true;
            return false;
        }
        this.close();
        return true;
    }

    show(x, y)
    {
        this.div.style.top = y + "px";
        this.div.style.left = x + "px";
        this.div.style.display = "block";
        this.x = x;
        this.y = y;
        this.input.focus();
        this.find();
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
            let b = this.chart.add(i);
            b.x = this.x;
            b.y = this.y;

            this.close();
        }
    }

    find(e)
    {
        let text = e ? e.target.value : "";
        this.selected = null;
        this.list.innerHTML = "";
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
                let item = document.createElement("div");
                item.classList.add("item");
                item.f = f;
                if (!this.selected)
                {
                    item.classList.add("selected");
                    this.selected = f;
                }
                item.innerHTML = f.name;

                category.appendChild(item);
                count++;
            });
            if (count > 0)
            {
                this.list.appendChild(category);
            }
        };
    }
};
