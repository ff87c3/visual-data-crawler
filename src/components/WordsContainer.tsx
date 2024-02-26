import React, { useEffect } from "react";
import interact from "interactjs";

export default function WordsContainer() {
  useEffect(() => {
    // target elements with the "draggable" class
    interact(".draggable")
      .draggable({
        // enable inertial throwing
        inertia: true,
        // keep the element within the area of it's parent
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: "parent",
            endOnly: true,
          }),
        ],
        // enable autoScroll
        autoScroll: true,

        listeners: {
          // call this function on every dragmove event
          move: dragMoveListener,
        },
      })
      .styleCursor(false);

    type DragMoveEvent = {
      target: HTMLElement;
      dx: number;
      dy: number;
    };

    function dragMoveListener(event: DragMoveEvent) {
      var target = event.target;
      // keep the dragged position in the data-x/data-y attributes
      var x = (parseFloat(target.getAttribute("data-x")!) || 0) + event.dx;
      var y = (parseFloat(target.getAttribute("data-y")!) || 0) + event.dy;

      // translate the element
      target.style.transform = "translate(" + x + "px, " + y + "px)";

      // update the posiion attributes
      target.setAttribute("data-x", x.toString());
      target.setAttribute("data-y", y.toString());
    }

    // this function is used later in the resizing and gesture demos
    (window as any).dragMoveListener = dragMoveListener;
  }, []);

  return <div id="words-container"></div>;
}
