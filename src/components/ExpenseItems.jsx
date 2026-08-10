import { useState } from "react";
import { formatMoney } from "../utils/money";
import './ExpenseItems.css';

export function ExpenseItems({ listItem, deleteBtn, setList, isPersian }) {
  const [isEdit, setIsEdit] = useState(false);
  const [inputText,setInputText] = useState(listItem.title);
  const [inputPrice,setInputPrice] = useState(listItem.priceCents / 100);
  const [inputDate,setInputDate] = useState(listItem.date);
  const [inputKeyWord,setInputKeyWord] = useState(listItem.keyWord);
  
  function saveInputText(event) {
    setInputText(event.target.value);
  }

  function saveInputPrice(event) {
    setInputPrice(event.target.value);
  }
  
  function saveInputDate(event) {
    setInputDate(event.target.value);
  }

  function saveInputKeyWord(event) {
    setInputKeyWord(event.target.value);
  }

  function handleEditSave(id) {
    if (isEdit) {
      handleEditBtn(id);
    }
    setIsEdit(!isEdit);
  }
  function handleEditBtn(id) {
    setList(prevList =>
      prevList.map(item =>
        item.id === id
          ? {
              ...item,
              title: inputText,
              priceCents: Number(inputPrice) * 100,
              date: inputDate,
              keyWord: inputKeyWord.split(/\s+/).map(word => {
                if(word.startsWith('#')) {
                  return word;
                }
                return `#${word}`;
              }).join(' ')
            }
          : item
      )
    );
    setInputText(listItem.title);
    setInputPrice(listItem.priceCents / 100);
    setInputDate(listItem.date);
    setInputKeyWord(listItem.keyWord);
  }
  if (isPersian) {
    return (
      <div className='expense-item'>
        <div className='expense-actions-fa'>
          <button
            className='btn-delete'
            onClick={() => {
              deleteBtn(listItem.id)
            }}>
            <img
              className='img-delete'
              src="/delete.svg"
              alt="delete"
            />
          </button>
          {isEdit
          ?
            <button
              className='btn-save'
              onClick={() => {
                handleEditSave(listItem.id)
              }}
            >
              <img
                className='img-save'
                src="/save.svg" alt="save"
              />
            </button>
          :
            <button
              className='btn-edit'
              onClick={handleEditSave}
            >
              <img
                className='img-edit'
                src="/edit.svg"
                alt="edit"
              />
            </button>
          }
        </div>
        {isEdit
        ? 
          <input
            className="input-change-keyword"
            type="text"
            placeholder="تغییر کلیدواژه"
            onChange={saveInputKeyWord}
            value={inputKeyWord}
          />
        :
          <div className='expense-keyword-fa'>
            {listItem.keyWord}
          </div>
        }
        {isEdit
        ? 
          <input
            className="input-change-date"
            type="date"
            onChange={saveInputDate}
            value={inputDate}
          />
        :
          <div className='expense-date-fa'>
            {listItem.date}
          </div>
        }
        {isEdit
        ? 
          <input
            className="input-change-price"
            type="text"
            placeholder="تغییر مبلغ"
            value={inputPrice}
            onChange={saveInputPrice}
          />
        :
          <div className='expense-amount-fa'>
            {formatMoney(listItem.priceCents)}
          </div>
        }
          {isEdit
          ? 
            <input
              className="input-change-title"
              type="text"
              placeholder="تغییر عنوان"
              value={inputText}
              onChange={saveInputText}
            />
          :
            <div className="expense-title-fa">
              {listItem.title}
            </div>
          }
      </div>
    );
  } else {
    return (
      <div className='expense-item'>
          {isEdit
          ? 
            <input
              className="input-change-title"
              type="text"
              placeholder="Change title"
              value={inputText}
              onChange={saveInputText}
            />
          :
            <div className="expense-title">
              {listItem.title}
            </div>
          }
          {isEdit
          ? 
            <input
              className="input-change-price"
              type="text"
              placeholder="Change price"
              value={inputPrice}
              onChange={saveInputPrice}
            />
          :
            <div className='expense-amount'>
              {formatMoney(listItem.priceCents)}
            </div>
          }
          {isEdit
          ? 
            <input
              className="input-change-date"
              type="date"
              onChange={saveInputDate}
              value={inputDate}
            />
          :
            <div className='expense-date'>
              {listItem.date}
            </div>
          }
          {isEdit
          ? 
            <input
              className="input-change-keyword"
              type="text"
              placeholder="Change keyword"
              onChange={saveInputKeyWord}
              value={inputKeyWord}
            />
          :
            <div className='expense-keyword'>
              {listItem.keyWord}
            </div>
          }
        <div className='expense-actions'>
          {isEdit
          ?
            <button
              className='btn-save'
              onClick={() => {
                handleEditSave(listItem.id)
              }}
            >
              <img
                className='img-save'
                src="/save.svg" alt="save"
              />
            </button>
          :
            <button
              className='btn-edit'
              onClick={handleEditSave}
            >
              <img
                className='img-edit'
                src="/edit.svg"
                alt="edit"
              />
            </button>
          }
          <button
            className='btn-delete'
            onClick={() => {
              deleteBtn(listItem.id)
            }}>
            <img
              className='img-delete'
              src="/delete.svg"
              alt="delete"
            />
          </button>
        </div>
      </div>
    );
  }
}