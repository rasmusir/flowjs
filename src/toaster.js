"use strict";

FLOW.Toaster = class Toaster
{
    constructor(text, err)
    {
        this.text = text;
        this.err = err;
        this.div = document.createElement("div");
        this.div.classList.add("toaster");
        this.div.appendChild(document.createTextNode(text));
        if (this.err)
        {
            this.div.classList.add("error");
        }
    }

    show()
    {
        document.body.appendChild(this.div);
        window.setTimeout(() => {
            document.body.removeChild(this.div);
        }, 4000);
    }
};
