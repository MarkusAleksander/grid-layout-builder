export default function generateToolbar(
    addItemToStart,
    removeItemFromStart,
    addItemToEnd,
    removeItemFromEnd
) {
    const toolbar = {
        tag: "div",
        attributes: {
            class: `grid-toolbar`,
            id: `grid-toolbar`,
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
                children: ["Add new item to start"],
                events: [
                    {
                        click: addItemToStart,
                    },
                ],
            },
            {
                tag: "button",
                children: ["Remove item from start"],
                events: [
                    {
                        click: removeItemFromStart,
                    },
                ],
            },
            {
                tag: "button",
                children: ["Add new item to end"],
                events: [
                    {
                        click: addItemToEnd,
                    },
                ],
            },
            {
                tag: "button",
                children: ["Remove item from end"],
                events: [
                    {
                        click: removeItemFromEnd,
                    },
                ],
            },
        ],
    };
    return toolbar;
}
