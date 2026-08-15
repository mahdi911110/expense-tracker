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
  return (
    <div className='expense-item' data-testid='expense-item'>
        {isEdit
        ? 
          <input
            className="input-change-title"
            data-testid="input-change-title"
            type="text"
            placeholder={isPersian ? 'تغییر عنوان' : "Change title"}
            value={inputText}
            onChange={saveInputText}
          />
        :
          <div className="expense-title" data-testid="expense-title">
            {listItem.title}
          </div>
        }
        {isEdit
        ? 
          <input
            className="input-change-price"
            data-testid="input-change-price"
            type="text"
            placeholder={isPersian ? "تغییر مبلغ" : "Change price"}
            value={inputPrice}
            onChange={saveInputPrice}
          />
        :
          <div className='expense-amount' data-testid="expense-amount">
            {formatMoney(listItem.priceCents)}
          </div>
        }
        {isEdit
        ? 
          <input
            className="input-change-date"
            data-testid="input-change-date"
            type="date"
            onChange={saveInputDate}
            value={inputDate}
          />
        :
          <div className='expense-date' data-testid="expense-date">
            {listItem.date}
          </div>
        }
        {isEdit
        ? 
          <input
            className="input-change-keyword"
            data-testid="input-change-keyword"
            type="text"
            placeholder={isPersian ? "تغییر کلیدواژه" : "Change keyword"}
            onChange={saveInputKeyWord}
            value={inputKeyWord}
          />
        :
          <div className='expense-keyword' data-testid="expense-keyword">
            {listItem.keyWord}
          </div>
        }
      <div className='expense-actions'>
        {isEdit
        ?
          <button
            className='btn-save'
            data-testid="btn-save"
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
            data-testid="btn-edit"
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
          data-testid="btn-delete"
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