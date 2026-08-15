import { describe, it, expect, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { HomePage } from "./HomePage";
import { render, screen } from "@testing-library/react";

describe('Testing HomePage component', () => {
  let user,
      buttonFa,
      buttonAdd,
      titleInput,
      priceInput,
      dateInput,
      keywordInput;
  beforeEach(() => {
    localStorage.clear();
    
    render(<HomePage />);

    user = userEvent.setup();
    buttonFa = screen.getByTestId('btn-language');
    buttonAdd = screen.getByTestId('btn-add');
    titleInput = screen.getByTestId('input-text');
    priceInput = screen.getByTestId('input-price');
    dateInput = screen.getByTestId('input-date');
    keywordInput = screen.getByTestId('input-keyword');
  });
  it('renders the initial UI correctly', () => {
    const nothingAdded = screen.getByText('Nothing Added yet');
    expect(nothingAdded).toBeInTheDocument();

    const totalExpenseText = screen.getByText('Total Expenses');
    expect(totalExpenseText).toBeInTheDocument();

    const totalExpensesPrice = screen.getByText('$0.00');
    expect(totalExpensesPrice).toBeInTheDocument();

    const buttonAddText = screen.getByText('Add');
    expect(buttonAddText).toBeInTheDocument();
  });
  it('changes the language with Fa button', async () => {
    await user.click(buttonFa);

    const nothingAddedFa = screen.getByText('هنوز چیزی اضافه نشده');
    expect(nothingAddedFa).toBeInTheDocument();

    const buttonAddText = screen.getByText('افزودن');
    expect(buttonAddText).toBeInTheDocument();
  });
  it('adds an expense to the list', async () => {
    await user.type(titleInput, 'Coffee');
    await user.type(priceInput, '12.45');
    await user.clear(dateInput);
    await user.type(dateInput, '2026-12-09');
    await user.type(keywordInput, 'drink');
    await user.click(buttonAdd);

    const titleText = screen.getByTestId('expense-title');
    expect(titleText).toHaveTextContent('Coffee');

    const priceText = screen.getByTestId('expense-amount');
    expect(priceText).toHaveTextContent('$12.45');

    const dateText = screen.getByTestId('expense-date');
    expect(dateText).toHaveTextContent('2026-12-09');

    const keywordText = screen.getByTestId('expense-keyword');
    expect(keywordText).toHaveTextContent('#drink');
  });
  it('deletes an item from the list', async () => {
    await user.type(titleInput, 'Coffee');
    await user.type(priceInput, '12.45');
    await user.clear(dateInput);
    await user.type(dateInput, '2026-12-09');
    await user.type(keywordInput, 'drink');
    await user.click(buttonAdd);

    const buttonDelete = screen.getByTestId('btn-delete');
    await user.click(buttonDelete);

    const nothingAdded = screen.getByText('Nothing Added yet');
    expect(nothingAdded).toBeInTheDocument();
  });
  it('edits and saves an item in the list', async () => {
    await user.type(titleInput, 'Coffee');
    await user.type(priceInput, '12.45');
    await user.clear(dateInput);
    await user.type(dateInput, '2026-12-09');
    await user.type(keywordInput, 'drink');
    await user.click(buttonAdd);

    const buttonEdit = screen.getByTestId('btn-edit');
    await user.click(buttonEdit);

    const inputChangeTitle = screen.getByTestId('input-change-title');
    const inputChangePrice = screen.getByTestId('input-change-price');
    const inputChangeDate = screen.getByTestId('input-change-date');
    const inputChangeKeyword = screen.getByTestId('input-change-keyword');

    await user.clear(inputChangeTitle);
    await user.clear(inputChangePrice);
    await user.clear(inputChangeDate);
    await user.clear(inputChangeKeyword);

    await user.type(inputChangeTitle, 'Hamburger');
    await user.type(inputChangePrice, '9.99');
    await user.type(inputChangeDate, '2026-11-30');
    await user.type(inputChangeKeyword, 'lunch');

    const buttonSave = screen.getByTestId('btn-save');
    await user.click(buttonSave);
    
    const titleText = screen.getByTestId('expense-title');
    expect(titleText).toHaveTextContent('Hamburger');

    const priceText = screen.getByTestId('expense-amount');
    expect(priceText).toHaveTextContent('$9.99');

    const dateText = screen.getByTestId('expense-date');
    expect(dateText).toHaveTextContent('2026-11-30');

    const keywordText = screen.getByTestId('expense-keyword');
    expect(keywordText).toHaveTextContent('#lunch');
  });
  it('persists expense changes in localStorage', async () => {
    await user.type(titleInput, 'Coffee');
    await user.type(priceInput, '12.45');
    await user.clear(dateInput);
    await user.type(dateInput, '2026-12-09');
    await user.type(keywordInput, 'drink');
    await user.click(buttonAdd);

    const saveList = JSON.parse(localStorage.getItem('list'));
    expect(saveList).toHaveLength(1);
    expect(saveList[0]).toMatchObject({
      title: 'Coffee',
      priceCents: 1245,
      date: '2026-12-09',
      keyWord: '#drink'
    });

    const buttonEdit = screen.getByTestId('btn-edit');
    await user.click(buttonEdit);

    const inputChangeTitle = screen.getByTestId('input-change-title');
    const inputChangePrice = screen.getByTestId('input-change-price');
    const inputChangeDate = screen.getByTestId('input-change-date');
    const inputChangeKeyword = screen.getByTestId('input-change-keyword');

    await user.clear(inputChangeTitle);
    await user.clear(inputChangePrice);
    await user.clear(inputChangeDate);
    await user.clear(inputChangeKeyword);

    await user.type(inputChangeTitle, 'Hamburger');
    await user.type(inputChangePrice, '9.99');
    await user.type(inputChangeDate, '2026-11-30');
    await user.type(inputChangeKeyword, 'lunch');

    const buttonSave = screen.getByTestId('btn-save');
    await user.click(buttonSave);

    const saveList1 = JSON.parse(localStorage.getItem('list'));
    expect(saveList1[0]).toMatchObject({
      title: 'Hamburger',
      priceCents: 999,
      date: '2026-11-30',
      keyWord: '#lunch'
    });

    const buttonDelete = screen.getByTestId('btn-delete');
    await user.click(buttonDelete);

    const saveList2 = JSON.parse(localStorage.getItem('list'));
    expect(saveList2).toHaveLength(0);
    expect(saveList2).toStrictEqual([]);
  });
  it('filters expenses by search term', async () => {
    await user.type(titleInput, 'Coffee');
    await user.type(priceInput, '12.45');
    await user.clear(dateInput);
    await user.type(dateInput, '2026-12-09');
    await user.type(keywordInput, 'drink');
    await user.click(buttonAdd);

    await user.type(titleInput, 'Hamburger');
    await user.type(priceInput, '9.99');
    await user.clear(dateInput);
    await user.type(dateInput, '2026-11-30');
    await user.type(keywordInput, 'lunch');
    await user.click(buttonAdd);

    const searchInput = screen.getByTestId('search-input');
    await user.type(searchInput, 'coffee');

    const expenseTitle = screen.getAllByTestId('expense-title');
    expect(expenseTitle).toHaveLength(1);
    expect(expenseTitle[0]).toHaveTextContent('Coffee');
  });
});