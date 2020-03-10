export default function generateToolbar(id, addItemEvent, removeItemEvent) {
    const toolbar = {
        tag: "div",
        attributes: {
            class: `grid-toolbar grid-toolbar--${id}`,
            id: `grid-toolbar--${id}`,
        },
        styles: {
            "position": "absolute",
            "left": 0,
            "right": 0,
            "bottom": 0,
            "background-color": "#ccc",
        },
        children: [
            {
                tag: "button",
                children: ["Add item"],
                events: [
                    {
                        click: addItemEvent,
                    },
                ],
            },
            {
                tag: "button",
                children: ["Remove item"],
                events: [
                    {
                        click: removeItemEvent,
                    },
                ],
            },
        ],
    };
    return toolbar;
}
