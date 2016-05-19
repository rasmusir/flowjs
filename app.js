"use strict";
(function () {

    window.addEventListener("load", () => {

        let th = new TabHandler();


        let tab = th.createTab("Main");
        let render = th.createTab("Render");

        let chart = new FLOW.Chart(tab.node);
        let d = FLOW.getDefinition("test");

        tab.obj = chart;

        th.switchTab(tab);

        let c = new FLOW.Compiler(chart);

        let button = document.querySelector("button");
        button.onclick = () => {
            c.compile();
        };
    });

    class TabHandler
    {
        constructor()
        {
            this.holder = document.querySelector(".holder");
            this.currentTab = null;
        }

        createTab(name, obj)
        {
            let tab = new Tab(this, name, obj);
            this.switchTab(tab);
            return tab;
        }

        switchTab(tab)
        {
            if (this.currentTab)
            {
                this.currentTab.node.style.display = "none";
                this.currentTab.tabnode.classList.remove("selected");
            }
            this.currentTab = tab;
            tab.node.style.display = "flex";
            this.currentTab.tabnode.classList.add("selected");
        }
    }

    class Tab
    {
        constructor(handler, name)
        {
            this.obj = null;
            this.handler = handler;
            this.node = document.createElement("div");
            this.node.classList.add("content");
            handler.holder.appendChild(this.node);

            this.tabnode = document.createElement("div");
            this.tabnode.classList.add("tab");
            handler.holder.querySelector(".tabs").appendChild(this.tabnode);

            this.tabnode.innerHTML = name;

            this.tabnode.addEventListener("click", () => {
                this.handler.switchTab(this);
                if (this.obj && this.obj.tabEvent)
                {
                    this.obj.tabEvent();
                }
            });
        }
    }
})();
