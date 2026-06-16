// Importy z Firebase SDK (wersja modularna)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// WLEJ TUTAJ SWOJE DANE Z FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "TWOJE_API_KEY",
  authDomain: "twoj-projekt.firebaseapp.com",
  projectId: "twoj-projekt",
  storageBucket: "twoj-projekt.appspot.com",
  messagingSenderId: "TWOJE_ID",
  appId: "TWOJE_APP_ID"
};

// Inicjalizacja Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Zmienna na zalogowanego użytkownika
let currentUser = null;

// Referencje do elementów DOM
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const mainContent = document.getElementById('main-content');
const loggedInUi = document.getElementById('logged-in-ui');
const userNameDisplay = document.getElementById('user-name');

// ------------------------------------
// 1. AUTORYZACJA
// ------------------------------------
loginBtn.addEventListener('click', () => {
    signInWithPopup(auth, provider).catch(error => console.error("Błąd logowania", error));
});

logoutBtn.addEventListener('click', () => {
    signOut(auth);
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        // Użytkownik zalogowany
        currentUser = user;
        loginBtn.style.display = 'none';
        loggedInUi.style.display = 'block';
        mainContent.style.display = 'block';
        userNameDisplay.innerText = `Witaj, ${user.displayName}`;
        loadUserBets();
        loadUserCards();
    } else {
        // Wylogowany
        currentUser = null;
        loginBtn.style.display = 'block';
        loggedInUi.style.display = 'none';
        mainContent.style.display = 'none';
    }
});

// ------------------------------------
// 2. OBSTAWIANIE (Zapis do bazy)
// ------------------------------------
const betForm = document.getElementById('bet-form');
betForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if(!currentUser) return;

    const homeScore = document.getElementById('home-score').value;
    const awayScore = document.getElementById('away-score').value;

    try {
        await addDoc(collection(db, "bets"), {
            userId: currentUser.uid,
            matchId: "pol_mex_1", // Przykładowe ID meczu
            prediction: `${homeScore}:${awayScore}`,
            timestamp: new Date()
        });
        alert("Zapisano typ!");
        loadUserBets();
    } catch (e) {
        console.error("Błąd zapisu zakładu: ", e);
    }
});

async function loadUserBets() {
    const q = query(collection(db, "bets"), where("userId", "==", currentUser.uid));
    const querySnapshot = await getDocs(q);
    const myBetsDiv = document.getElementById('my-bets');
    myBetsDiv.innerHTML = "<h3>Twoje typy:</h3>";
    
    querySnapshot.forEach((doc) => {
        const bet = doc.data();
        myBetsDiv.innerHTML += `<p>Mecz ${bet.matchId} - Twój typ: <strong>${bet.prediction}</strong></p>`;
    });
}

// ------------------------------------
// 3. KARTY PIŁKARZY (Logika Paczek)
// ------------------------------------
const playersDB = [
    { id: 1, name: "Robert Lewandowski", rarity: "Legend" },
    { id: 2, name: "Kylian Mbappe", rarity: "Legend" },
    { id: 3, name: "Piotr Zieliński", rarity: "Rare" },
    { id: 4, name: "Jan Bednarek", rarity: "Common" },
    { id: 5, name: "Wojciech Szczęsny", rarity: "Rare" }
];

const openPackBtn = document.getElementById('open-pack-btn');
openPackBtn.addEventListener('click', async () => {
    if(!currentUser) return;

    // Proste losowanie piłkarza z tablicy
    const randomPlayer = playersDB[Math.floor(Math.random() * playersDB.length)];
    
    document.getElementById('pack-result').innerHTML = `
        <p>Wylosowałeś: <strong>${randomPlayer.name}</strong> (${randomPlayer.rarity})!</p>
    `;

    // Zapis do Firebase (do profilu użytkownika)
    try {
        await addDoc(collection(db, "user_cards"), {
            userId: currentUser.uid,
            playerId: randomPlayer.id,
            playerName: randomPlayer.name,
            rarity: randomPlayer.rarity
        });
        loadUserCards();
    } catch (e) {
        console.error("Błąd zapisu karty: ", e);
    }
});

async function loadUserCards() {
    const q = query(collection(db, "user_cards"), where("userId", "==", currentUser.uid));
    const querySnapshot = await getDocs(q);
    const cardsList = document.getElementById('my-cards-list');
    cardsList.innerHTML = "";
    
    querySnapshot.forEach((doc) => {
        const card = doc.data();
        cardsList.innerHTML += `<li>${card.playerName} <em>(${card.rarity})</em></li>`;
    });
}

// ------------------------------------
// 4. TERMINARZ LIVE (Przykładowy zarys z publicznego API)
// ------------------------------------
async function loadLiveMatches() {
    // W rzeczywistości użyjesz np. darmowego endpointu z api-football.com
    // Tu dla przykładu wstawiamy dane z palca
    const matchesContainer = document.getElementById('matches-container');
    matchesContainer.innerHTML = `
        <p>🔴 75' Polska 1 - 0 Meksyk</p>
        <p>🕒 20:00 Argentyna - Arabia Saudyjska</p>
    `;
}
loadLiveMatches();
