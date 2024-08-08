import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setMaxHeight } from './store'; // Adjust the import based on your file structure

const ItemList = () => {
  const dispatch = useDispatch();
  const maxHeight = useSelector((state) => state.items.maxHeight);

  useEffect(() => {
    // Find all items
    const items = document.querySelectorAll('.item');
    let localMaxHeight = 0;

    // Determine the maximum height
    items.forEach(item => {
      const itemHeight = item.offsetHeight;
      if (itemHeight > localMaxHeight) {
        localMaxHeight = itemHeight;
      }
    });

    // Dispatch the maximum height to the Redux store
    dispatch(setMaxHeight(localMaxHeight));
  }, [dispatch]);

  // Apply the maximum height to each item
  useEffect(() => {
    const items = document.querySelectorAll('.item');
    items.forEach(item => {
      item.style.height = `${maxHeight}px`;
    });
  }, [maxHeight]);

  return (
    <div className="item-list">
      {/* Render your item components here */}
      <div className="item">Item 1</div>
      <div className="item">Item 2</div>
      <div className="item">Item 3</div>
    </div>
  );
};

export default ItemList;
