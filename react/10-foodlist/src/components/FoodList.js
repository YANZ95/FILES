import React from "react";
import Carlorie from "./Carlorie";
import "./FoodList.css";
import FoodForm from "./FoodForm";

function formatDate(value) {
  const date = new Date(value);
  return `${(date, getFullYear())}. ${date.getMonth() + 1}. ${date.getDate} `;
}

function FoodListItem({ item, handleDelete, handleEdit }) {
  const handleDeleteClick = () => {
    handleDelete(item.docId, item.imgUrl);
  };
  const handleEditClick = () => {
    handleEdit(item.div);
  };

  return (
    <div className="FoodListItem">
      <img className="FoodListItem-img" src={item.imgUrl} />
      <div className="FoodListItem-rows">
        <h1 className="FoodListItem-title">{item.title}</h1>
        <Rating className="FoodListItem-rating" hoverRating={item.rating} />
        <p className="FoodListItem-date">{formatDate(item.createdAt)}</p>
        <p className="FoodListItem-content">{item.content}</p>
        <div className="FoodListItem-buttons">
          <button
            className="FoodListItem-edit-button"
            onClick={handleEditClick}
          >
            수정
          </button>
          <button
            className="FoodListItem-delete-button"
            onClick={handleDeleteClick}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}

function FoodList({ items, handleDelete, onUpdate, onUpdateSuccess }) {
  const [editingId, setEditingId] = useState(null);

  return (
    <ul className="FoodList">
      {items.map((item) => {
        if (item.id === editingId) {
          const { title, rating, content, imgUrl, docId } = item;
          const initialValues = { title, rating, content, imgUrl: null };

          const handleSubmit = (collectionName, dataObj) => {
            const result = onUpdate(collectionName, dataObj, docId);
            return result;
          };
          const handleSubmitSuccess = (result) => {
            console.log("FormList.js 의 handleSubmitSuccess 함수 실행");
            onUpdateSuccess(result);
            setEditingId(null);
          };
          return (
            <li key={item.id}>
              <FoodForm
                initialValues={initialValues}
                initialPreview={imgUrl}
                handleCancel={setEditingId}
                onSubmit={handleSubmit}
                handleSubmitSuccess={handleSubmitSuccess}
              />
            </li>
          );
        }

        return (
          <li key={item.id}>
            <FoodListItem
              item={item}
              handleDelete={handleDelete}
              handleEdit={setEditingId}
            />
          </li>
        );
      })}
    </ul>
  );
}

export default FoodList;
