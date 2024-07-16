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
    if (data && data.length > 0) {
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
  const workboxSW = new Workbox('/service-worker.js');
  workboxSW.register();
} else {
  console.error('Service workers are not supported in this browser.');
}

// Handle installation prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (event) => {
  console.log('beforeinstallprompt event fired');
  // Prevent the mini-infobar from appearing on mobile
  event.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = event;
  // Update UI to notify the user they can install the PWA
  document.getElementById('buttonInstall').style.display = 'block';
});

document.getElementById('buttonInstall').addEventListener('click', async () => {
  console.log('Install button clicked');
  if (deferredPrompt) {
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User choice: ${outcome}`);
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    // Reset the deferred prompt variable, it can only be used once
    deferredPrompt = null;
    // Hide the install button
    document.getElementById('buttonInstall').style.display = 'none';
  } else {
    console.log('Deferred prompt not available');
  }
});
