import { useEffect, useState } from 'react';
import { ExpenseItems } from './ExpenseItems';
import { formatMoney } from '../utils/money';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { ExpenseChart } from './ExpenseChart';
import './HomePage.css';

export function HomePage() {
  const [list, setList] = useState(
    JSON.parse(localStorage.getItem('list')) || []
  );
  const [inputText,setInputText] = useState('');
  const [inputPrice,setInputPrice] = useState('');
  const [inputDate,setInputDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [inputKeyWord,setInputKeyWord] = useState('');
  const [search, setSearch] = useState('');
  const [isPersian, setIsPersian] = useState(false);
  const [showChartModal, setShowChartModal] = useState(false);
  const totalPrice = list.reduce(
    (total, item) => total + item.priceCents, 0
  );
  
  useEffect(() => {
    try {
      localStorage.setItem('list', JSON.stringify(list));
    } catch(error) {
      console.error(error);
      if (isPersian) {
        toast.error('خطای غیرمنتظره! حافظه محلی (LocalStorage) شما پر شده است یا در حالت مرور خصوصی (Private Mode) هستید.');
      } else {
        toast.error('Unexpected error! your localstorage is full or your in private browser mode');
      }
    }
  }, [list]);

  function saveSearch(event) {
    setSearch(event.target.value);
  }

  function onChangeText(event) {
    setInputText(event.target.value);
  }

  function onChangePrice(event) {
    setInputPrice(event.target.value);
  }

  function onChangeDate(event) {
    setInputDate(event.target.value);
  }

  function onChangeKeyWord(event) {
    setInputKeyWord(event.target.value);
  }

  function addToList() {
    if (!inputText || !inputPrice || !inputDate || !inputKeyWord) {
      if (isPersian) {
        toast.error('خطا! فیلدها نباید خالی باشند.');
      } else {
        toast.error('Error! filds must not be empty.');
      }
      return;
    }
    setList(prev => [
      ...prev, {
        id: crypto.randomUUID(),
        title: inputText,
        priceCents: Number(inputPrice) * 100,
        date: inputDate,
        keyWord: inputKeyWord.split(/\s+/).map(word => `#${word}`).join(' ')
      }
    ]);
    setInputText('');
    setInputPrice('');
    setInputDate(dayjs().format('YYYY-MM-DD'));
    setInputKeyWord('');
  }

  function deleteBtn(id) {
    setList(prevList =>
      prevList.filter(item => item.id !== id)
    );
  }

  function handleLanguage() {
    setIsPersian(!isPersian);
  }

  function showChart() {
    setShowChartModal(true);
  }

  const filteredList = list.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.keyWord.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main>
      <div className="header">
        <div className="left-section">
          <a className='home-link' href="/">
            <img
              className="moeny-wallet"
              src="/money-wallet.svg"
              alt="money-wallet-logo"
            />
          </a>
        </div>
        <div className="middle-section">
          <input
            className="search-input"
            type="text"
            placeholder={isPersian ? 'سرچ' : 'Search'}
            onChange={saveSearch}
            value={search}
            style={{ direction: isPersian ? 'rtl' : 'ltr' }}
          />
        </div>
        <div className="right-section">
          <button className='btn-language' onClick={handleLanguage}>
            {isPersian ? 'En' : 'Fa'}
          </button>
          <button className="btn-chart" onClick={showChart}>
            <img
              className="img-chart-pie"
              src="/chart-pie-2.svg"
              alt="money-pie-chart"
            />
          </button>
        </div>
      </div>
      {showChartModal && (
        <div className='chart-container'>
          <div className='chart'>
            <div className='chart-header'>
              <h2 className='chart-header-text'>
                {isPersian ? 'نمودار هزینه‌ها' : 'Expense Chart'}
              </h2>
            </div>
            
            <ExpenseChart list={list} isPersian={isPersian} />
            
            <button className='btn-close' onClick={() => setShowChartModal(false)}>
              {isPersian ? 'بستن' : 'Close'}
            </button>
          </div>
        </div>
      )}
      <div className="inputs" style={{ direction: isPersian ? 'rtl' : 'ltr' }}>
        <input value={inputText} onChange={onChangeText} className='input-text' type="text" placeholder={isPersian ? 'یک عنوان بنویسید' : "Type a title"} />
        <input value={inputPrice} onChange={onChangePrice} className='input-price' type="text" placeholder={isPersian ? 'مبلغ را وارد کنید' : "Type price"} />
        <input value={inputDate} onChange={onChangeDate} className='input-date' type="date" />
        <input value={inputKeyWord} onChange={onChangeKeyWord} className='input-keyword' type="text" placeholder={isPersian ? 'یک یا چند کلیدواژه وارد کنید' : "Type keyword"} />
        <button className="btn-add" onClick={addToList}>
          {isPersian? 'افزودن' : 'Add'}
        </button>
      </div>
      <div className='total-expense-container'>
        <div className='total-expense-title'>
          {isPersian ? 'مجموع هزینه‌ها' : 'Total Expenses'}
        </div>
        <div className='total-expense-pirce'>
          {formatMoney(totalPrice)}
        </div>
      </div>
      {list.length === 0 
      ?
        <div className='expense-list'>
          <div className='expense-list-header'>
            <div className='expense-list-header-list-title'>
              {isPersian ? 'هنوز چیزی اضافه نشده' : 'Nothing Added yet'}
            </div>
          </div>
        </div>
      :
        <div className="expense-list">
          <div className='expense-list-header'>
            {isPersian ?
              <>
                <div className='expense-list-header-list-title'>
                  فهرست هزینه‌ها
                </div>
                <div className='expense-list-header-detail'>
                  <div className='expense-list-header-action-fa'>
                    اقدامات
                  </div>
                  <div className='expense-list-header-keyword-fa'>
                    کلیدواژه
                  </div>
                  <div className='expense-list-header-date-fa'>
                    زمان
                  </div>
                  <div className='expense-list-header-price-fa'>
                    مبالغ
                  </div>
                  <div className='expense-list-header-title-fa' style={{ justifyContent: 'end' }}>
                    عنوان
                  </div>
                </div>
              </> 
            :
              <>
                <div className='expense-list-header-list-title'>
                  Expense List
                </div>
                <div className='expense-list-header-detail'>
                  <div className='expense-list-header-title'>
                    Title
                  </div>
                  <div className='expense-list-header-price'>
                    Prices
                  </div>
                  <div className='expense-list-header-date'>
                    Date
                  </div>
                  <div className='expense-list-header-keyword'>
                    Keyword
                  </div>
                  <div className='expense-list-header-action'>
                    Actions
                  </div>
                </div>
              </>
            }
          </div>
          {filteredList.length > 0 ? filteredList.map(listItem => {
              return (
                <ExpenseItems
                  key={listItem.id}
                  listItem={listItem}
                  deleteBtn={deleteBtn}
                  setList={setList}
                  isPersian={isPersian}
                />
              );
            })
          :
            <div className='not-found-text'>
              {isPersian ? 'نتایج مورد نظر پیدا نشد' : 'Not Found.'}
            </div>
          }
        </div>
      }
    </main>
  );
}