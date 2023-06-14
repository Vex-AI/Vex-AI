import React, { useRef, useEffect, ReactNode } from "react";
import "./css/Swipe.css";

interface SwipeableListItemProps {
  onItemDelete: () => void;
  children: ReactNode;
  style?: React.CSSProperties;
}

const Swipe:React.FC<SwipeableListItemProps> = ({
  onItemDelete,
  children,
  style,
})=> {
  const listElementRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  const dragStartXRef = useRef(0);
  const leftRef = useRef(0);
  const draggedRef = useRef(false);

  useEffect(() => {
    window.addEventListener("mouseup", onDragEndMouse);
    window.addEventListener("touchend", onDragEndTouch);
    return () => {
      window.removeEventListener("mouseup", onDragEndMouse);
      window.removeEventListener("touchend", onDragEndTouch);
    };
  }, []);

  function onDragStartMouse(evt: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    onDragStart(evt.clientX);
    window.addEventListener("mousemove", onMouseMove);
  }

  function onDragStartTouch(evt: React.TouchEvent<HTMLDivElement>) {
    const touch = evt.targetTouches[0];
    onDragStart(touch.clientX);
    window.addEventListener("touchmove", onTouchMove);
  }

  function onDragStart(clientX: number) {
    draggedRef.current = true;
    dragStartXRef.current = clientX;

    if (listElementRef.current) {
      listElementRef.current.className = "ListItem";
    }

    requestAnimationFrame(updatePosition);
  }

  function updatePosition() {
    if (draggedRef.current) {
      requestAnimationFrame(updatePosition);
    }

    if (listElementRef.current) {
      listElementRef.current.style.transform = `translateX(${leftRef.current}px)`;
    }
  }

  function onMouseMove(evt: MouseEvent) {
    const left = evt.clientX - dragStartXRef.current;
    if (left < 0) {
      leftRef.current = left;
    }
  }

  function onTouchMove(evt: TouchEvent) {
    const touch = evt.targetTouches[0];
    const left = touch.clientX - dragStartXRef.current;
    if (left < 0) {
      leftRef.current = left;
    }
  }

  function onDragEndMouse() {
    window.removeEventListener("mousemove", onMouseMove);
    onDragEnd();
  }

  function onDragEndTouch() {
    window.removeEventListener("touchmove", onTouchMove);
    onDragEnd();
  }

  function onDragEnd() {
    if (draggedRef.current && listElementRef.current) {
      draggedRef.current = false;
      const threshold = 0.5;

      if (
        leftRef.current <
        listElementRef.current.offsetWidth * threshold * -1
      ) {
        leftRef.current = -listElementRef.current.offsetWidth * 2;
        onItemDelete();
        leftRef.current = 0;
      } else {
        leftRef.current = 0;
      }

      listElementRef.current.className = "BouncingListItem";
      listElementRef.current.style.transform = `translateX(${leftRef.current}px)`;
    }
  }

  return (
    <div
      style={style}
      className="BouncingListItem"
      ref={listElementRef}
      onMouseDown={onDragStartMouse}
      onTouchStart={onDragStartTouch}
    >
      {children}
    </div>
  );
}

export default Swipe;
