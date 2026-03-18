// ==========================================
// CONFIGURAÇÕES DE TEMA (DARK/LIGHT)
// ==========================================
const themeToggle = document.getElementById('theme-toggle');
const rootElement = document.documentElement;

// Carregar tema salvo
const savedTheme = localStorage.getItem('theme') || 'light';
rootElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const currentTheme = rootElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  rootElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
  const icon = themeToggle.querySelector('i');
  if (theme === 'dark') {
    icon.className = 'fa-solid fa-sun';
  } else {
    icon.className = 'fa-solid fa-moon';
  }
}

// ==========================================
// ATUALIZAÇÃO DO ANO NO FOOTER
// ==========================================
document.getElementById('current-year').textContent = new Date().getFullYear();

// ==========================================
// SCROLL REVEAL (Animação ao rolar)
// ==========================================
const revealElements = document.querySelectorAll('.reveal');

const revealCallback = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target); // Anima apenas uma vez
    }
  });
};

const revealOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

revealElements.forEach(el => {
  revealObserver.observe(el);
});

// ==========================================
// EFEITO DE DIGITAÇÃO E APAGAR (Typing)
// ==========================================
const typingElement = document.querySelector('.typing-text');
const words = ['Full Stack', 'Web', 'Front-end', 'Back-end'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeDelay = 100;

function typeEffect() {
  const currentWord = words[wordIndex];
  
  if (isDeleting) {
    typingElement.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
    typeDelay = 50; // Mais rápido ao apagar
  } else {
    typingElement.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
    typeDelay = 150; // Velocidade de digitação
  }
  
  // Condições para mudar de estado
  if (!isDeleting && charIndex === currentWord.length) {
    isDeleting = true;
    typeDelay = 2000; // Pausa no final da palavra
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length; // Passa para próxima
    typeDelay = 500; // Pausa antes de digitar a nova
  }
  
  setTimeout(typeEffect, typeDelay);
}

// Inicia o efeito apenas se o elemento existir
if(typingElement) {
  setTimeout(typeEffect, 1000);
}

// ==========================================
// MENU MOBILE E SCROLL SPY
// ==========================================
const mobileBtn = document.querySelector('.mobile-menu-btn');
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');
const header = document.querySelector('.header');

// Toggle Menu
mobileBtn.addEventListener('click', () => {
  navbar.classList.toggle('active');
  const icon = mobileBtn.querySelector('i');
  if (navbar.classList.contains('active')) {
    icon.className = 'fa-solid fa-xmark';
  } else {
    icon.className = 'fa-solid fa-bars';
  }
});

// Fechar menu ao clicar em um link
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navbar.classList.remove('active');
    mobileBtn.querySelector('i').className = 'fa-solid fa-bars';
  });
});

// Header com sombra no scroll e Active Link
window.addEventListener('scroll', () => {
  let current = '';
  const sections = document.querySelectorAll('section');
  
  //Header background
  if(window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  //Scroll Spy
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    // O valor 200 é um offset para ativar quando já estiver chegando na section
    if (pageYOffset >= (sectionTop - 200)) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').includes(current)) {
      link.classList.add('active');
    }
  });
});

// ==========================================
// SIMULAÇÃO DO FORMULÁRIO DE CONTATO
// ==========================================
const form = document.getElementById('form-contato');
const formFeedback = document.getElementById('form-feedback');

form.addEventListener('submit', (e) => {
  e.preventDefault(); // Evita recarregamento rápido
  const btn = form.querySelector('button[type="submit"]');
  const orgText = btn.innerHTML;
  
  // Estado de loading visual simulação
  btn.innerHTML = '<span>Enviando...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>';
  btn.disabled = true;
  
  // Simular requisição de rede
  setTimeout(() => {
    form.reset();
    btn.innerHTML = orgText;
    btn.disabled = false;
    
    // Mostrar mensagem
    formFeedback.classList.add('show');
    
    // Esconder mensagem após 4s
    setTimeout(() => {
      formFeedback.classList.remove('show');
    }, 4000);
  }, 1500);
});

// ==========================================
// JOGO DA MEMÓRIA - MINIGAME
// ==========================================
const board = document.getElementById('memory-board');
const movesElement = document.getElementById('game-moves');
const timeElement = document.getElementById('game-time');
const restartBtn = document.getElementById('restart-game');

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let time = 0;
let timer;
let gameStarted = false;
let matchedPairs = 0;

// Icones para jogo de pares (2 de cada)
const icons = [
  'fa-brands fa-html5', 'fa-brands fa-html5',
  'fa-brands fa-css3-alt', 'fa-brands fa-css3-alt',
  'fa-brands fa-js', 'fa-brands fa-js',
  'fa-brands fa-python', 'fa-brands fa-python',
  'fa-brands fa-react', 'fa-brands fa-react',
  'fa-brands fa-node-js', 'fa-brands fa-node-js'
];

// O Grid no CSS tem 4 colunas. Para manter proporção legal, vamos usar 12 cartas (3 linhas).
// Embaralhar as cartas
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function startGameTimer() {
  if (gameStarted) return;
  gameStarted = true;
  timer = setInterval(() => {
    time++;
    timeElement.textContent = time;
  }, 1000);
}

function stopGameTimer() {
  clearInterval(timer);
  gameStarted = false;
}

function createBoard() {
  if(!board) return;
  board.innerHTML = '';
  moves = 0;
  time = 0;
  matchedPairs = 0;
  movesElement.textContent = moves;
  timeElement.textContent = time;
  stopGameTimer();
  
  const shuffledIcons = shuffle([...icons]);

  shuffledIcons.forEach(iconClass => {
    const card = document.createElement('div');
    card.classList.add('memory-card');
    card.dataset.icon = iconClass;

    card.innerHTML = `
      <div class="card-face card-front">
        <i class="${iconClass}"></i>
      </div>
      <div class="card-face card-back">
        <i class="fa-solid fa-code"></i>
      </div>
    `;

    card.addEventListener('click', flipCard);
    board.appendChild(card);
  });
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  startGameTimer();
  this.classList.add('flipped');

  if (!firstCard) {
    // Primeiro clique
    firstCard = this;
    return;
  }

  // Segundo clique
  secondCard = this;
  moves++;
  movesElement.textContent = moves;
  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.dataset.icon === secondCard.dataset.icon;

  if (isMatch) {
    disableCards();
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  
  firstCard.classList.add('matched');
  secondCard.classList.add('matched');

  matchedPairs++;

  resetBoardDef();
  
  // Condição de Vitória (Total 6 pares, pois são 12 cartas)
  if(matchedPairs === icons.length / 2) {
    stopGameTimer();
    setTimeout(() => {
      alert(`🎉 Parabéns! Você completou o jogo em ${time} segundos usando ${moves} tentativas.`);
    }, 500);
  }
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    resetBoardDef();
  }, 1000);
}

function resetBoardDef() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

if(restartBtn) {
  restartBtn.addEventListener('click', createBoard);
}

// Inicializar
createBoard();