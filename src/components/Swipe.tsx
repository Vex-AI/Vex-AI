import React, { useRef, useEffect, ReactNode, useState } from "react";
import "./css/Swipe.css";

interface SwipeableListItemProps {
  onItemDelete: () => void;
  children: ReactNode;
  style?: React.CSSProperties;
}

const Swipe: React.FC<SwipeableListItemProps> = ({
  onItemDelete,
  children,
  style,
}) => {
  const listElementRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  const dragStartXRef = useRef<number>(0);
  const leftRef = useRef<number>(0);
  const draggedRef = useRef<boolean>(false);

  const [isDragging, setIsDragging] = useState(false);
  const [isSwiped, setIsSwiped] = useState(false);

  useEffect(() => {
    window.addEventListener("mouseup", onDragEndMouse);
    window.addEventListener("touchend", onDragEndTouch);
    return () => {
      window.removeEventListener("mouseup", onDragEndMouse);
      window.removeEventListener("touchend", onDragEndTouch);
    };
  }, []);

  const onDragStartMouse = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    onDragStart(evt.clientX);
    window.addEventListener("mousemove", onMouseMove);
  };

  const onDragStartTouch = (evt: React.TouchEvent<HTMLDivElement>) => {
    const touch = evt.targetTouches[0];
    onDragStart(touch.clientX);
    window.addEventListener("touchmove", onTouchMove);
  };

  const onDragStart = (clientX: number) => {
    draggedRef.current = true;
    setIsDragging(true);
    setIsSwiped(false);
    dragStartXRef.current = clientX;

    if (listElementRef.current) {
      listElementRef.current.className = "ListItem";
    }

    requestAnimationFrame(updatePosition);
  };

  const updatePosition = () => {
    if (draggedRef.current) {
      requestAnimationFrame(updatePosition);
    }

    if (listElementRef.current) {
      listElementRef.current.style.transform = `translateX(${leftRef.current}px)`;
    }
  };

  const onMouseMove = (evt: MouseEvent) => {
    const left = evt.clientX - dragStartXRef.current;
    if (left < 0) {
      leftRef.current = left;
    }
  };

  const onTouchMove = (evt: TouchEvent) => {
    const touch = evt.targetTouches[0];
    const left = touch.clientX - dragStartXRef.current;
    if (left < 0) {
      leftRef.current = left;
    }
  };

  const onDragEndMouse = () => {
    window.removeEventListener("mousemove", onMouseMove);
    onDragEnd();
  };

  const onDragEndTouch = () => {
    window.removeEventListener("touchmove", onTouchMove);
    onDragEnd();
  };

  const onDragEnd = () => {
    if (draggedRef.current && listElementRef.current) {
      draggedRef.current = false;
      setIsDragging(false);
      const threshold = 0.5;

      if (
        leftRef.current <
        listElementRef.current.offsetWidth * threshold * -1
      ) {
        setIsSwiped(true);
        leftRef.current = -listElementRef.current.offsetWidth * 2;
        onItemDelete();
      } else {
        leftRef.current = 0;
      }

      listElementRef.current.className = "BouncingListItem";
      listElementRef.current.style.transform = `translateX(${leftRef.current}px)`;
    }
  };

  const onDragReset = () => {
    if (!isDragging && isSwiped) {
      setIsSwiped(false);
      leftRef.current = 0;
      if (listElementRef.current) {
        listElementRef.current.className = "BouncingListItem";
        listElementRef.current.style.transform = `translateX(${leftRef.current}px)`;
      }
    }
  };

  return (
    <div
      style={style}
      className="BouncingListItem"
      ref={listElementRef}
      onMouseDown={onDragStartMouse}
      onTouchStart={onDragStartTouch}
      onMouseUp={onDragReset}
      onTouchEnd={onDragReset}
    >
      {children}
    </div>
  );
};

export default Swipe;
