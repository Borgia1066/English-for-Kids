import { cardsData, addCardsToDom, refreshField } from './Generatefield';

const playButton = document.querySelector('.play_btn');
const repeatButton = document.querySelector('.repeat');
const switchButton = document.querySelector('.switch_btn');
const body = document.querySelector('body');
const points = document.querySelector('.points');
const overlay = document.querySelector('.overlay_result');
const resultImage = document.querySelector('.result__img');
const resultMessage = document.querySelector('.result__text');
const categoryName = document.querySelector('.category-name');

const Play = {
  isPlaying: false,
  BeginGame: false,
  word: [],
  audio: [],
  clickedCard: null,
  currentCard: null,
  mistakes: 0,
  clicks: 0, 
  wrongClicks: 0,
  timer: null,

  error: './src/assets/audio/error.mp3',
  correct: './src/assets/audio/correct.mp3',

  success: './src/assets/audio/success.mp3',
  failure: './src/assets/audio/failure.mp3',
};

let {word, audio, clickedCard, currentCard, mistakes, clicks, wrongClicks, timer,} = Play;
const {error, correct, success, failure,} = Play;

const shuffle = (array) => array.sort(() => Math.random());

const playAudio = (audioSrc) => {
  const audio = new Audio();
  audio.src = audioSrc;
  if (audio) audio.play();
};

const createword = () => {
  cardsData.array.forEach((card) => {word.push(card.word);});
  return word;
};

const createAudioArray = () => {
  cardsData.array.forEach((card) => {
    audio.push(card.audio);
  });
  return audio;
};

const setTargetCard = () => {
  document.querySelector('.wrapper__main').addEventListener('click', (e) => {
    if (!e.target.classList.contains('wrapper')) {
      clickedCard = e.target.closest('.card');
    }
  });
  return clickedCard;
};

const clearArrays = () => {word = [];audio = [];};

const shiftArrays = () => {
  word.shift();
  audio.shift();
};

const starGame = () => {
  shuffle(cardsData.array);
  clearArrays();
  word = createword();
  audio = createAudioArray();
  playAudio(audio[0]);
};

const stopPlaying = () => {
  Play.BeginGame = false;
  clearTimeout(timer);
};

const createRightStar = () => {
  const star = document.createElement('div');
  star.classList.add('star', 'star_right');
  points.append(star);
};

const createWrongStar = () => {
  const star = document.createElement('div');
  star.classList.add('star', 'star_wrong');
  points.append(star);
};

const clearScore = () => {
  points.innerHTML = '';
};

const showResultSuccess = () => {
  overlay.classList.add('overlay_result-active');
  body.classList.add('fixed-position');
  resultImage.classList.add('result__img_success');
  resultMessage.innerText = 'Congratulation';
  playAudio(success);
};

const showResultFailure = () => {
  overlay.classList.add('overlay_result-active');
  body.classList.add('fixed-position');
  resultImage.classList.add('result__img_failure');
  let correctWord;
  if (mistakes === 1) {
    correctWord = 'mistake';
  } else {
    correctWord = 'mistakes'; 
  }
  resultMessage.innerText = `Oops! You have ${mistakes} ${correctWord}. Try again!`;
  playAudio(failure);
};

const deleteResult = () => {
  resultImage.classList.remove('result__img_success');
  resultImage.classList.remove('result__img_failure');
  overlay.classList.remove('overlay_result-active');
  clearScore();
  refreshField();
  stopPlaying();
  repeatButton.classList.remove('flex');
  body.classList.remove('fixed-position');
  categoryName.innerText = 'main'.toUpperCase();
  addCardsToDom('main');
};

const checkWord = () => {
  clickedCard = setTargetCard();
  document.querySelector('.wrapper__main').addEventListener('click', (e) => {
    if (e.target.classList.contains('wrapper__main')) return;
    if(clickedCard) currentCard = clickedCard.getAttribute('data-name');
    if (Play.isPlaying && Play.BeginGame && !cardsData.isStatsOn) {
      if (currentCard === word[0]) {
        clickedCard.classList.add('card_disabled');
        createRightStar();
        shiftArrays();
        playAudio(correct);

        setTimeout(() => playAudio(audio[0]), 500);

        if(localStorage.getItem(`${currentCard}-right`) !== 0) clicks = +(localStorage.getItem(`${currentCard}-right`));
        clicks += 1;
        localStorage.setItem(`${currentCard}-right`, clicks);
        
      } else {
        createWrongStar();
        playAudio(error);
        mistakes += 1;
        if(localStorage.getItem(`${currentCard}-wrong`) !== 0) wrongClicks = +(localStorage.getItem(`${currentCard}-wrong`));
        wrongClicks +=1;
        localStorage.setItem(`${currentCard}-wrong`, wrongClicks);
      }
      if (!word.length) {
        if (!mistakes) {
          showResultSuccess();
          setTimeout(() => deleteResult(), 5000);
        } else {
          showResultFailure();
          setTimeout(() => deleteResult(), 5000);
        }
      }
    }
  });
};

const setTimeoutToPlayMode = () => {
  timer = setTimeout(checkWord);
};

switchButton.addEventListener('click', () => {
  Play.isPlaying = !Play.isPlaying;
  stopPlaying();
  clearScore();
  body.classList.toggle('play-mode');
  const card = document.querySelector('[data-category="main"]');
  if (switchButton.classList.contains('switch-on') && !card) {
    playButton.classList.add('flex');
  } else {
    playButton.classList.remove('flex');
  }
  repeatButton.classList.remove('flex');

  document.querySelectorAll('.card__img').forEach((elem) => {
    if (!elem.closest('[data-category="main"]') && elem.closest('.card__side_front')) {
      elem.classList.toggle('card__img_play');
    }
  });
  document.querySelectorAll('.card__description').forEach((elem) => {
    if (!elem.closest('[data-category="main"]') && elem.closest('.card__side_front')) {
      elem.classList.toggle('card__description_play');
    }
  });
  document.querySelectorAll('.card').forEach((elem) => {
    if (elem.classList.contains('card_disabled')) {
      elem.classList.remove('card_disabled');
    }
  });
});


repeatButton.addEventListener('click', () => {
  playAudio(audio[0]);
});

playButton.addEventListener('click', () => {
  starGame();
  playButton.classList.remove('flex');
  repeatButton.classList.add('flex');
  if (word.length) {
    stopPlaying();
    Play.BeginGame = true;
    mistakes = 0;
  }
});

export { Play, setTimeoutToPlayMode, clearScore };
