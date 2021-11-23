const switchButton = document.querySelector('.switch_btn');

const whatIsTextButton = () => {
  if (switchButton.classList.contains('switch_on')) {
    switchButton.innerText = 'Train'.toUpperCase();
  } else {
    switchButton.innerText = 'Play'.toUpperCase();
  }
};

const switchedButton = () => {
  switchButton.addEventListener('click', () => {
    if(!switchButton.classList.contains('switch_on')) {
      switchButton.classList.add('switch_on');
    } else {
      switchButton.classList.remove('switch_on');  
    }
    whatIsTextButton();
  });
};

export default switchedButton;

