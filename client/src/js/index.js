import { Workbox } from 'workbox-window';
import Editor from './editor';
import { getDb, putDb } from './database';
import '../css/style.css';
import logo from '../images/logo.png'; // Import the logo

const main = document.querySelector('#main');
main.innerHTML = '';

const loadSpinner = () => {
  const spinner = document.createElement('div');
  spinner.classList.add('spinner');
  spinner.innerHTML = `
  <div class="loading-container">
  <div class="loading-spinner" />
  </div>
  `;
  main.appendChild(spinner);
};

const editor = new Editor();

if (typeof editor === 'undefined') {
  loadSpinner();
} else {
  // Load data from IndexedDB and set it in the editor
  getDb().then((data) => {
    if (data.length > 0) {
      editor.setValue(data[0].content);
    }
  });

  // Save data to IndexedDB on editor changes
  editor.on('change', () => {
    const content = editor.getValue();
    putDb(content);
  });
}

// Set the logo image dynamically
const logoImg = document.querySelector('.navbar-brand img');
if (logoImg) {
  logoImg.src = logo;
}

// Check if service workers are supported
if ('serviceWorker' in navigator) {
  // register workbox service worker
  const workboxSW = new Workbox('/src-sw.js');
  workboxSW.register();
} else {
  console.error('Service workers are not supported in this browser.');
}
