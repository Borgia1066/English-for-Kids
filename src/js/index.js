import { addEventListenersToNavigation, generateNavigation } from './components/Navigation';
import switchedButton from './components/Switcher';
import { addCardsToDom , chooseCategory  } from './Generatefield';
import { setTimeoutToPlayMode } from './Gmode';
import addEventListenerToStatsButtons from './GenerateTable';

window.onload = () => {addCardsToDom('main');
  generateNavigation();
  addEventListenersToNavigation();
  switchedButton();
  chooseCategory();
  setTimeoutToPlayMode();
  addEventListenerToStatsButtons();};
