import data from './data/Cards_data';
import Table from './components/Table';
import Card from './components/Card';
import { cardsData } from './Generatefield';
import { Play } from './Gmode';

const generateRows = (wordsData) => {const rows = [];
  wordsData.forEach((row) => {
    rows.push(new Table(row));
  });
  return rows;
};

const createArrayForTable = () => data.slice(2).flatMap((x) => x);
let dataForTable = createArrayForTable();

const wrapperMain  = document.querySelector('.wrapper__main');
const switchButton = document.querySelector('.switch_btn');
const statsButton = document.querySelector('.stats_btn');
const title = document.querySelector('.category-name');
const buttons = document.querySelector('.points');
const resetButton = document.createElement('div');
resetButton.innerText = 'Reset';
resetButton.classList.add('stats_btn', 'reset-btn');
const repeatWordsButton = document.createElement('div');
repeatWordsButton.innerText = 'Repeat difficult words';
repeatWordsButton.classList.add('stats_btn', 'repeat-words-btn');

const generateTable = () => {
  const table = new Table(dataForTable);
  const head = table.generateHeadOfTheTable();
  const main = document.createElement('div');

  main.classList.add('table');
  wrapperMain.append(main);
  main.append(head);
  
  const body = document.createElement('tbody');
  head.append(body);
  return body;
};

const addRows = (table) => {
  generateRows(dataForTable).forEach((row) => {
    table.append(row.generateRow());
  });
};

const deleteTable = () => {
  const tableBody = document.querySelector('tbody');
  tableBody.innerHTML = ' ';
};

const changeIconToAscendingSort = (icon) => {
  icon.classList.remove('sort-arrow-down');
  icon.classList.add('sort-arrow-up');
}

const changeIconToDescendingSort = (icon) => {
  icon.classList.remove('sort-arrow-up');
  icon.classList.add('sort-arrow-down');
}

const addEventListener = (table) => {
  dataForTable = generateRows(dataForTable);
  document.querySelector('tr').addEventListener('click', (e) => { 
    const icons = document.querySelectorAll('.sort-icon');
    icons.forEach(icon => {
      icon.classList.remove('sort-arrow-down', 'sort-arrow-up');
    })
    let icon = e.target.children[0];
    switch (e.target.innerText) {
      case 'Categories':
        e.target.classList.toggle('sort');
        deleteTable();
        if (e.target.classList.contains('sort')) {
          dataForTable.sort((a, b) => a.category.localeCompare(b.category));
          changeIconToAscendingSort(icon);
        } else {
          dataForTable.sort((a, b) => b.category.localeCompare(a.category));
          changeIconToDescendingSort(icon);
        }
        addRows(table);
        break;
      case 'Words':
        e.target.classList.toggle('sort');
        deleteTable();
        if (e.target.classList.contains('sort')) {
          dataForTable.sort((a, b) => a.word.localeCompare(b.word));
          changeIconToAscendingSort(icon);
        } else {
          dataForTable.sort((a, b) => b.word.localeCompare(a.word));
          changeIconToDescendingSort(icon);
        }

        addRows(table);
        break;

      case 'Translation':
        e.target.classList.toggle('sort');
        deleteTable();
        if (e.target.classList.contains('sort')) {
          dataForTable.sort((a, b) => a.translation.localeCompare(b.translation));
          changeIconToAscendingSort(icon);
        } else {
          dataForTable.sort((a, b) => b.translation.localeCompare(a.translation));
          changeIconToDescendingSort(icon);
        }
        addRows(table);
        break;

      case 'Trained':
        e.target.classList.toggle('sort');
        deleteTable();
        if (e.target.classList.contains('sort')) {
          console.log(dataForTable)
          dataForTable.sort((a, b) => a.trained - b.trained);
          changeIconToAscendingSort(icon);
        } else {
          dataForTable.sort((a, b) => b.trained - a.trained);
          changeIconToDescendingSort(icon);
        }
        addRows(table);
        break;
      case 'Correct':
        e.target.classList.toggle('sort');
        deleteTable();
        if (e.target.classList.contains('sort')) {
          dataForTable.sort((a, b) => a.correct - b.correct);
          changeIconToAscendingSort(icon);
        } else {
          dataForTable.sort((a, b) => b.correct - a.correct);
          changeIconToDescendingSort(icon);
        }
        addRows(table);
        break;
      case 'Incorrect':
        e.target.classList.toggle('sort');
        deleteTable();
        if (e.target.classList.contains('sort')) {
          dataForTable.sort((a, b) => a.incorrect - b.incorrect);
          changeIconToAscendingSort(icon);
        } else {
          dataForTable.sort((a, b) => b.incorrect - a.incorrect);
          changeIconToDescendingSort(icon);
        }
        addRows(table);
        break;
      case '%':
        e.target.classList.toggle('sort');
        deleteTable();
        if (e.target.classList.contains('sort')) {
          dataForTable.sort((a, b) => a.percent - b.percent);
          changeIconToAscendingSort(icon);
        } else {
          dataForTable.sort((a, b) => b.percent - a.percent);
          changeIconToDescendingSort(icon);
        }
        addRows(table);
        break;
      default:
    }
  });
};

const addTableToDom = () => {
  const table = generateTable();
  addRows(table);
  addEventListener(table);
};

const filterDifficultWords = () => {
  let DifficultWords = [];
  DifficultWords = generateRows(dataForTable);
  DifficultWords = DifficultWords.filter((i) => i.percent > 0);
  DifficultWords.sort((a, b) => a.percent - b.percent);
  DifficultWords = DifficultWords.slice(0, 8);
  return DifficultWords;
};


const generateCards = (cardsDataArray) => {
  const cards = [];
  cardsDataArray.forEach((card) => {
    cards.push(new Card(card));
  });
  return cards;
};

const addCardsToDom = () => {
  cardsData.array = filterDifficultWords();
  generateCards(cardsData.array).forEach((card) => {
    wrapperMain.append(card.generateCard());
  });
  return cardsData.array;
};

const addEventListenerToStatsButtons = () => {
  statsButton.addEventListener('click', () => {
    buttons.innerHTML = '';
    wrapperMain.innerHTML = '';
    buttons.append(repeatWordsButton, resetButton);
    switchButton.classList.add('none');
    document.querySelector('.repeat').classList.remove('flex');
    document.querySelector('.play_btn').classList.remove('flex');
    addTableToDom();
  });

  resetButton.addEventListener('click', () => {
    localStorage.clear();
    wrapperMain.innerHTML = '';
    addTableToDom();
  });

  repeatWordsButton.addEventListener('click', () => {
    filterDifficultWords();
    wrapperMain.innerHTML = '';
    buttons.innerHTML = '';


    title.innerText = 'Repeat'.toUpperCase(); 

    
    document.querySelector('.switch_btn').classList.remove('none');
    if (switchButton.classList.contains('switch_on')) {
      Play.isPlaying = false;
    } else {
      Play.isPlaying = true;
      document.querySelector('.play_btn').classList.add('flex');
    }
    addCardsToDom();
  });
};

export default addEventListenerToStatsButtons;
