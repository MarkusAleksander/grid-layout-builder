export default function gridItem(content) {
    const gridItem = {
        tag: "div",
        attributes: {
            class: "grid-item",
            draggable: "true",
        },
        children: content,
    };
    return gridItem;
}
