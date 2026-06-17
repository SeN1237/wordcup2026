import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where, doc, getDoc, setDoc, updateDoc, increment, onSnapshot, orderBy, deleteDoc, writeBatch } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// TWOJE KLUCZE
const firebaseConfig = {
  apiKey: "AIzaSyCnRiStnJbgtUnSKrhwFkhrcHKyQMPTV6o",
  authDomain: "worldcup2026-c5362.firebaseapp.com",
  projectId: "worldcup2026-c5362",
  storageBucket: "worldcup2026-c5362.firebasestorage.app",
  messagingSenderId: "904347486693",
  appId: "1:904347486693:web:246de8602e69493b47470c",
  measurementId: "G-7Y4YR1RW04"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;
let currentPoints = 0; // Trzyma lokalnie ilość punktów usera

// =========================================================================
// TUTAJ WKLEJ SWOJE PEŁNE TABLICE matchesDB oraz playersDB Z POPRZEDNICH KROKÓW!
// =========================================================================
const matchesDB = [
    // Grupa A i B
    { id: "m1", date: "2026-06-11T21:00:00", home: "Meksyk", away: "RPA" },
    { id: "m2", date: "2026-06-12T04:00:00", home: "Korea Płd.", away: "Czechy" },
    { id: "m3", date: "2026-06-12T21:00:00", home: "Kanada", away: "Bośnia i Herc." },
    { id: "m4", date: "2026-06-13T00:00:00", home: "Katar", away: "Szwajcaria" },
    
    // Grupa C i D
    { id: "m5", date: "2026-06-13T03:00:00", home: "USA", away: "Paragwaj" },
    { id: "m6", date: "2026-06-13T21:00:00", home: "Brazylia", away: "Maroko" },
    { id: "m7", date: "2026-06-14T00:00:00", home: "Haiti", away: "Szkocja" },
    { id: "m8", date: "2026-06-14T03:00:00", home: "Australia", away: "Turcja" },
    
    // Grupa E i F
    { id: "m9", date: "2026-06-14T19:00:00", home: "Niemcy", away: "Curacao" },
    { id: "m10", date: "2026-06-14T22:00:00", home: "Holandia", away: "Japonia" },
    { id: "m11", date: "2026-06-15T01:00:00", home: "Wybrzeże Kości Sł.", away: "Ekwador" },
    { id: "m12", date: "2026-06-15T04:00:00", home: "Szwecja", away: "Tunezja" },
    
    // Grupa G i H
    { id: "m13", date: "2026-06-15T18:00:00", home: "Hiszpania", away: "Republika Ziel. Przylądka" },
    { id: "m14", date: "2026-06-15T21:00:00", home: "Belgia", away: "Egipt" },
    { id: "m15", date: "2026-06-16T00:00:00", home: "Arabia Saud.", away: "Urugwaj" },
    { id: "m16", date: "2026-06-16T03:00:00", home: "Iran", away: "Nowa Zelandia" },
    
    // Grupa I i J
    { id: "m17", date: "2026-06-16T21:00:00", home: "Francja", away: "Senegal" },
    { id: "m18", date: "2026-06-16T23:59:00", home: "Irak", away: "Norwegia" },
    { id: "m19", date: "2026-06-17T02:00:00", home: "Argentyna", away: "Algieria" },
    { id: "m20", date: "2026-06-17T05:00:00", home: "Austria", away: "Jordania" },
    
    // Grupa K i L
    { id: "m21", date: "2026-06-17T19:00:00", home: "Portugalia", away: "DR Kongo" },
    { id: "m22", date: "2026-06-17T22:00:00", home: "Anglia", away: "Chorwacja" },
    { id: "m23", date: "2026-06-18T01:00:00", home: "Ghana", away: "Panama" },
    { id: "m24", date: "2026-06-18T04:00:00", home: "Uzbekistan", away: "Kolumbia" },

// Grupa A i B
    { id: "m25", date: "2026-06-18T18:00:00", home: "Meksyk", away: "Korea Płd." },
    { id: "m26", date: "2026-06-18T21:00:00", home: "RPA", away: "Czechy" },
    { id: "m27", date: "2026-06-19T00:00:00", home: "Kanada", away: "Katar" },
    { id: "m28", date: "2026-06-19T03:00:00", home: "Bośnia i Herc.", away: "Szwajcaria" },
    
    // Grupa C i D
    { id: "m29", date: "2026-06-19T18:00:00", home: "USA", away: "Haiti" },
    { id: "m30", date: "2026-06-19T21:00:00", home: "Paragwaj", away: "Szkocja" },
    { id: "m31", date: "2026-06-20T00:00:00", home: "Brazylia", away: "Australia" },
    { id: "m32", date: "2026-06-20T03:00:00", home: "Maroko", away: "Turcja" },
    
    // Grupa E i F
    { id: "m33", date: "2026-06-20T18:00:00", home: "Niemcy", away: "Wybrzeże Kości Sł." },
    { id: "m34", date: "2026-06-20T21:00:00", home: "Curacao", away: "Ekwador" },
    { id: "m35", date: "2026-06-21T00:00:00", home: "Holandia", away: "Szwecja" },
    { id: "m36", date: "2026-06-21T03:00:00", home: "Japonia", away: "Tunezja" },
    
    // Grupa G i H
    { id: "m37", date: "2026-06-21T18:00:00", home: "Hiszpania", away: "Arabia Saud." },
    { id: "m38", date: "2026-06-21T21:00:00", home: "Republika Ziel. Przylądka", away: "Urugwaj" },
    { id: "m39", date: "2026-06-22T00:00:00", home: "Belgia", away: "Iran" },
    { id: "m40", date: "2026-06-22T03:00:00", home: "Egipt", away: "Nowa Zelandia" },
    
    // Grupa I i J
    { id: "m41", date: "2026-06-22T18:00:00", home: "Francja", away: "Irak" },
    { id: "m42", date: "2026-06-22T21:00:00", home: "Senegal", away: "Norwegia" },
    { id: "m43", date: "2026-06-23T00:00:00", home: "Argentyna", away: "Austria" },
    { id: "m44", date: "2026-06-23T03:00:00", home: "Algieria", away: "Jordania" },
    
    // Grupa K i L
    { id: "m45", date: "2026-06-23T18:00:00", home: "Portugalia", away: "Ghana" },
    { id: "m46", date: "2026-06-23T21:00:00", home: "DR Kongo", away: "Panama" },
    { id: "m47", date: "2026-06-24T00:00:00", home: "Anglia", away: "Uzbekistan" },
    { id: "m48", date: "2026-06-24T03:00:00", home: "Chorwacja", away: "Kolumbia" },

// Grupa A (Mecze o tej samej godzinie)
    { id: "m49", date: "2026-06-24T18:00:00", home: "Meksyk", away: "Czechy" },
    { id: "m50", date: "2026-06-24T18:00:00", home: "RPA", away: "Korea Płd." },
    
    // Grupa B
    { id: "m51", date: "2026-06-24T21:00:00", home: "Kanada", away: "Szwajcaria" },
    { id: "m52", date: "2026-06-24T21:00:00", home: "Bośnia i Herc.", away: "Katar" },
    
    // Grupa C
    { id: "m53", date: "2026-06-25T18:00:00", home: "USA", away: "Szkocja" },
    { id: "m54", date: "2026-06-25T18:00:00", home: "Paragwaj", away: "Haiti" },
    
    // Grupa D
    { id: "m55", date: "2026-06-25T21:00:00", home: "Brazylia", away: "Turcja" },
    { id: "m56", date: "2026-06-25T21:00:00", home: "Maroko", away: "Australia" },
    
    // Grupa E
    { id: "m57", date: "2026-06-26T18:00:00", home: "Niemcy", away: "Ekwador" },
    { id: "m58", date: "2026-06-26T18:00:00", home: "Curacao", away: "Wybrzeże Kości Sł." },
    
    // Grupa F
    { id: "m59", date: "2026-06-26T21:00:00", home: "Holandia", away: "Tunezja" },
    { id: "m60", date: "2026-06-26T21:00:00", home: "Japonia", away: "Szwecja" },
    
    // Grupa G
    { id: "m61", date: "2026-06-27T18:00:00", home: "Hiszpania", away: "Urugwaj" },
    { id: "m62", date: "2026-06-27T18:00:00", home: "Republika Ziel. Przylądka", away: "Arabia Saud." },
    
    // Grupa H
    { id: "m63", date: "2026-06-27T21:00:00", home: "Belgia", away: "Nowa Zelandia" },
    { id: "m64", date: "2026-06-27T21:00:00", home: "Egipt", away: "Iran" },
    
    // Grupa I
    { id: "m65", date: "2026-06-28T18:00:00", home: "Francja", away: "Norwegia" },
    { id: "m66", date: "2026-06-28T18:00:00", home: "Senegal", away: "Irak" },
    
    // Grupa J
    { id: "m67", date: "2026-06-28T21:00:00", home: "Argentyna", away: "Jordania" },
    { id: "m68", date: "2026-06-28T21:00:00", home: "Algieria", away: "Austria" },
    
    // Grupa K
    { id: "m69", date: "2026-06-29T18:00:00", home: "Portugalia", away: "Panama" },
    { id: "m70", date: "2026-06-29T18:00:00", home: "DR Kongo", away: "Ghana" },
    
    // Grupa L
    { id: "m71", date: "2026-06-29T21:00:00", home: "Anglia", away: "Kolumbia" },
    { id: "m72", date: "2026-06-29T21:00:00", home: "Chorwacja", away: "Uzbekistan" }

];

const playersDB = [
    // --- LEGENDY (Najtrudniejsze do trafienia) ---
    { id: 1, name: "Kylian Mbappe (FRA)", rarity: "Legend" },
    { id: 2, name: "Lionel Messi (ARG)", rarity: "Legend" },
    { id: 3, name: "Vinicius Junior (BRA)", rarity: "Legend" },
    { id: 4, name: "Jude Bellingham (ENG)", rarity: "Legend" },
    { id: 5, name: "Harry Kane (ENG)", rarity: "Legend" },
    { id: 6, name: "Antoine Griezmann (FRA)", rarity: "Legend" },
    
    // --- RZADKIE (Rare) ---
    // Anglia
    { id: 7, name: "Phil Foden (ENG)", rarity: "Rare" },
    { id: 8, name: "Bukayo Saka (ENG)", rarity: "Rare" },
    { id: 9, name: "Declan Rice (ENG)", rarity: "Rare" },
    // Francja
    { id: 10, name: "Aurelien Tchouameni (FRA)", rarity: "Rare" },
    { id: 11, name: "William Saliba (FRA)", rarity: "Rare" },
    { id: 12, name: "Ousmane Dembele (FRA)", rarity: "Rare" },
    // Argentyna
    { id: 13, name: "Lautaro Martinez (ARG)", rarity: "Rare" },
    { id: 14, name: "Julian Alvarez (ARG)", rarity: "Rare" },
    { id: 15, name: "Emiliano Martinez (ARG)", rarity: "Rare" },
    // Brazylia
    { id: 16, name: "Rodrygo (BRA)", rarity: "Rare" },
    { id: 17, name: "Alisson Becker (BRA)", rarity: "Rare" },
    { id: 18, name: "Marquinhos (BRA)", rarity: "Rare" },
    
    // --- ZWYKŁE (Common) ---
    // USA & Meksyk
    { id: 19, name: "Christian Pulisic (USA)", rarity: "Common" },
    { id: 20, name: "Weston McKennie (USA)", rarity: "Common" },
    { id: 21, name: "Giovanni Reyna (USA)", rarity: "Common" },
    { id: 22, name: "Santiago Gimenez (MEX)", rarity: "Common" },
    { id: 23, name: "Edson Alvarez (MEX)", rarity: "Common" },
    { id: 24, name: "Guillermo Ochoa (MEX)", rarity: "Common" },
    // Argentyna & Brazylia (Reszta składu)
    { id: 25, name: "Enzo Fernandez (ARG)", rarity: "Common" },
    { id: 26, name: "Alexis Mac Allister (ARG)", rarity: "Common" },
    { id: 27, name: "Cristian Romero (ARG)", rarity: "Common" },
    { id: 28, name: "Bruno Guimaraes (BRA)", rarity: "Common" },
    { id: 29, name: "Eder Militao (BRA)", rarity: "Common" },
    { id: 30, name: "Lucas Paqueta (BRA)", rarity: "Common" },
    // Anglia & Francja (Reszta składu)
    { id: 31, name: "John Stones (ENG)", rarity: "Common" },
    { id: 32, name: "Trent Alexander-Arnold (ENG)", rarity: "Common" },
    { id: 33, name: "Jordan Pickford (ENG)", rarity: "Common" },
    { id: 34, name: "Theo Hernandez (FRA)", rarity: "Common" },
    { id: 35, name: "Eduardo Camavinga (FRA)", rarity: "Common" },
    { id: 36, name: "Randal Kolo Muani (FRA)", rarity: "Common" }
    
    ,
    // --- LEGENDY ---
    { id: 37, name: "Cristiano Ronaldo (POR)", rarity: "Legend" },
    { id: 38, name: "Kevin De Bruyne (BEL)", rarity: "Legend" },
    { id: 39, name: "Rodri (ESP)", rarity: "Legend" },
    
    // --- RZADKIE (Rare) ---
    // Niemcy
    { id: 40, name: "Jamal Musiala (GER)", rarity: "Rare" },
    { id: 41, name: "Florian Wirtz (GER)", rarity: "Rare" },
    { id: 42, name: "Antonio Rüdiger (GER)", rarity: "Rare" },
    // Hiszpania
    { id: 43, name: "Lamine Yamal (ESP)", rarity: "Rare" },
    { id: 44, name: "Pedri (ESP)", rarity: "Rare" },
    { id: 45, name: "Nico Williams (ESP)", rarity: "Rare" },
    // Portugalia
    { id: 46, name: "Bruno Fernandes (POR)", rarity: "Rare" },
    { id: 47, name: "Rafael Leao (POR)", rarity: "Rare" },
    { id: 48, name: "Bernardo Silva (POR)", rarity: "Rare" },
    // Holandia & Belgia
    { id: 49, name: "Cody Gakpo (NED)", rarity: "Rare" },
    { id: 50, name: "Xavi Simons (NED)", rarity: "Rare" },
    { id: 51, name: "Jeremy Doku (BEL)", rarity: "Rare" },

    // --- ZWYKŁE (Common) ---
    // Niemcy
    { id: 52, name: "Kai Havertz (GER)", rarity: "Common" },
    { id: 53, name: "Leroy Sane (GER)", rarity: "Common" },
    { id: 54, name: "Joshua Kimmich (GER)", rarity: "Common" },
    // Hiszpania
    { id: 55, name: "Dani Olmo (ESP)", rarity: "Common" },
    { id: 56, name: "Gavi (ESP)", rarity: "Common" },
    { id: 57, name: "Dani Carvajal (ESP)", rarity: "Common" },
    // Portugalia
    { id: 58, name: "Ruben Dias (POR)", rarity: "Common" },
    { id: 59, name: "Joao Cancelo (POR)", rarity: "Common" },
    { id: 60, name: "Diogo Jota (POR)", rarity: "Common" },
    // Holandia
    { id: 61, name: "Virgil van Dijk (NED)", rarity: "Common" },
    { id: 62, name: "Frenkie de Jong (NED)", rarity: "Common" },
    { id: 63, name: "Matthijs de Ligt (NED)", rarity: "Common" },
    // Belgia
    { id: 64, name: "Romelu Lukaku (BEL)", rarity: "Common" },
    { id: 65, name: "Leandro Trossard (BEL)", rarity: "Common" },
    { id: 66, name: "Amadou Onana (BEL)", rarity: "Common" }
    
    ,
    // --- LEGENDY ---
    { id: 67, name: "Erling Haaland (NOR)", rarity: "Legend" },
    { id: 68, name: "Mohamed Salah (EGY)", rarity: "Legend" },
    { id: 69, name: "Luka Modric (CRO)", rarity: "Legend" },

    // --- RZADKIE (Rare) ---
    // Włochy & Chorwacja
    { id: 70, name: "Gianluigi Donnarumma (ITA)", rarity: "Rare" },
    { id: 71, name: "Nicolo Barella (ITA)", rarity: "Rare" },
    { id: 72, name: "Josko Gvardiol (CRO)", rarity: "Rare" },
    // Urugwaj & Reszta Świata
    { id: 73, name: "Federico Valverde (URU)", rarity: "Rare" },
    { id: 74, name: "Darwin Nunez (URU)", rarity: "Rare" },
    { id: 75, name: "Alphonso Davies (CAN)", rarity: "Rare" },
    { id: 76, name: "Achraf Hakimi (MAR)", rarity: "Rare" },
    { id: 77, name: "Victor Osimhen (NGA)", rarity: "Rare" },
    { id: 78, name: "Heung-min Son (KOR)", rarity: "Rare" },

    // --- ZWYKŁE (Common) ---
    // Włochy & Chorwacja
    { id: 79, name: "Federico Chiesa (ITA)", rarity: "Common" },
    { id: 80, name: "Alessandro Bastoni (ITA)", rarity: "Common" },
    { id: 81, name: "Mateo Kovacic (CRO)", rarity: "Common" },
    { id: 82, name: "Andrej Kramaric (CRO)", rarity: "Common" },
    // Urugwaj
    { id: 83, name: "Ronald Araujo (URU)", rarity: "Common" },
    { id: 84, name: "Manuel Ugarte (URU)", rarity: "Common" },
    // Reszta Świata (Afryka, Azja, Ameryka Płn.)
    { id: 85, name: "Jonathan David (CAN)", rarity: "Common" },
    { id: 86, name: "Stephen Eustaquio (CAN)", rarity: "Common" },
    { id: 87, name: "Kaoru Mitoma (JPN)", rarity: "Common" },
    { id: 88, name: "Takefusa Kubo (JPN)", rarity: "Common" },
    { id: 89, name: "Kim Min-jae (KOR)", rarity: "Common" },
    { id: 90, name: "Brahim Diaz (MAR)", rarity: "Common" },
    { id: 91, name: "Kalidou Koulibaly (SEN)", rarity: "Common" },
    { id: 92, name: "Sadio Mane (SEN)", rarity: "Common" },
    { id: 93, name: "Alexander Isak (SWE)", rarity: "Common" },
    { id: 94, name: "Viktor Gyokeres (SWE)", rarity: "Common" }
];

// =========================================================================


// Zmienne DOM
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const loginForm = document.getElementById('login-form');
const mainContent = document.getElementById('main-content');
const loggedInUi = document.getElementById('logged-in-ui');
const matchSelect = document.getElementById('match-select');
const pointsDisplay = document.getElementById('user-points');

// --- AUTORYZACJA I ZARZĄDZANIE KONTEM ---
document.getElementById('register-btn').addEventListener('click', () => {
    createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value).catch(e => alert("Błąd: " + e.message));
});

document.getElementById('login-btn').addEventListener('click', () => {
    signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value).catch(e => alert("Błąd: " + e.message));
});

document.getElementById('logout-btn').addEventListener('click', () => signOut(auth));


const ADMIN_EMAIL = "igiblack@abba.com"; 

onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        loginForm.style.display = 'none';
        loggedInUi.style.display = 'block';
        mainContent.style.display = 'block';
        document.getElementById('user-name').innerText = user.email.split('@')[0];
        
        // Pokaż panel admina, jeśli mail się zgadza
        if (user.email === ADMIN_EMAIL) {
            document.getElementById('admin-panel').style.display = 'block';
            populateAdminMatches(); // Funkcja załaduje listę meczów do panelu
        }

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
            await setDoc(userRef, { 
                email: user.email, 
                points: 500,
                exactHits: 0,   // Licznik dokładnych trafień (za 1000 pkt)
                outcomeHits: 0  // Licznik trafień 1X2 (za 500 pkt)
            });
        }

        onSnapshot(userRef, (doc) => {
            if(doc.exists()) {
                currentPoints = doc.data().points;
                pointsDisplay.innerText = `💰 ${currentPoints} pkt`;
            }
        });

        loadUserBets();
        loadUserCards();
        loadRanking();
        loadMarket();
    } else {
        currentUser = null;
        loginForm.style.display = 'block';
        loggedInUi.style.display = 'none';
        mainContent.style.display = 'none';
        document.getElementById('admin-panel').style.display = 'none';
    }
});

// --- RENDEROWANIE MECZÓW (Z suwakiem) ---
function renderMatches() {
    const container = document.getElementById('matches-container');
    container.innerHTML = '';
    matchSelect.innerHTML = '<option value="" disabled selected>Wybierz mecz...</option>';

    const now = new Date();
    matchesDB.forEach(match => {
        const matchTime = new Date(match.date);
        const matchEndTime = new Date(matchTime.getTime() + 120 * 60 * 1000);

        if (now < matchEndTime) {
            const displayDate = matchTime.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' }) + ' ' + matchTime.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
            
            const isStarted = now >= matchTime;
            const isLive = isStarted && now < matchEndTime;
            
            // Przycisk "Typy" pojawia się tylko wtedy, gdy mecz się już zaczął!
            let btnHtml = '';
            if (isStarted) {
                btnHtml = `<button class="btn-secondary" style="padding: 4px 8px; font-size: 0.8rem; margin-left: 10px;" onclick="showTeamBets('${match.id}', '${match.home} vs ${match.away}')">👁️ Typy</button>`;
            }

            container.innerHTML += `
                <div class="match-box ${isLive ? 'live-match' : ''}" style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <span>${isLive ? '🔴 LIVE' : '🕒'} ${displayDate}</span><br>
                        <strong>${match.home} - ${match.away}</strong>
                    </div>
                    ${btnHtml}
                </div>
            `;
            
            // Do formularza obstawiania wpadają tylko mecze, które jeszcze nie wystartowały
            if (!isStarted) {
                matchSelect.innerHTML += `<option value="${match.id}">${match.home} vs ${match.away} (${displayDate})</option>`;
            }
        }
    });
}
setInterval(renderMatches, 60000);
renderMatches();

// --- OBSTAWIANIE ---
document.getElementById('bet-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    if(!currentUser) return;

    const selectedMatchId = matchSelect.value;
    const homeScore = document.getElementById('home-score').value;
    const awayScore = document.getElementById('away-score').value;
    const cardsCount = document.getElementById('cards-count').value; // <--- POBIERANIE KARTEK
    
    if (!selectedMatchId) return alert("Wybierz mecz!");
    const matchData = matchesDB.find(m => m.id === selectedMatchId);
    
    // Zabezpieczenie 1: Czy mecz się już nie zaczął?
    if (new Date() >= new Date(matchData.date)) return alert("Mecz już się rozpoczął!");

    // 🔴 ZABEZPIECZENIE 2: Czy użytkownik już obstawił ten mecz? 🔴
    const checkQuery = query(
        collection(db, "bets"), 
        where("userId", "==", currentUser.uid), 
        where("matchId", "==", selectedMatchId)
    );
    const checkSnapshot = await getDocs(checkQuery);
    
    // Jeśli checkSnapshot NIE jest puste, to znaczy, że zakład już istnieje!
    if (!checkSnapshot.empty) {
        return alert("Odrzucono: Już oddałeś swój typ na ten mecz!");
    }
    // -------------------------------------------------------------

    try {
        await addDoc(collection(db, "bets"), {
            userId: currentUser.uid,
            matchId: selectedMatchId,
            matchTitle: `${matchData.home} vs ${matchData.away}`,
            prediction: `${homeScore}:${awayScore}`,
            cardsPrediction: cardsCount ? parseInt(cardsCount) : null, // <--- ZAPIS KARTEK DO BAZY
            timestamp: new Date()
        });
        alert("Zapisano typ!");
        
        // Czyszczenie pół formularza po udanym obstawieniu
        document.getElementById('home-score').value = '';
        document.getElementById('away-score').value = '';
        document.getElementById('cards-count').value = ''; // <--- CZYSZCZENIE POLA KARTEK
        
        loadUserBets();
    } catch (e) { console.error(e); }
});

async function loadUserBets() {
    const q = query(collection(db, "bets"), where("userId", "==", currentUser.uid));
    const querySnapshot = await getDocs(q);
    
    // Zbieramy typy do tablicy, aby wyświetlać najnowsze na samej górze
    const myBets = [];
    querySnapshot.forEach((doc) => myBets.push(doc.data()));
    myBets.sort((a, b) => b.timestamp - a.timestamp);

    const myBetsDiv = document.getElementById('my-bets');
    myBetsDiv.innerHTML = "";
    
    myBets.forEach((bet) => {
        let cardsText = bet.cardsPrediction !== null ? ` | 🟨🟥: <b>${bet.cardsPrediction}</b>` : "";
        
        let betStyle = "";
        let resultBadge = `<span style="color: var(--text-muted); font-size: 0.8rem; float: right;">⏳ W grze</span>`;

        // Kolorowanie rozliczonych zakładów
        if (bet.status === "resolved") {
            const pts = bet.pointsEarned || 0;
            const realScoreInfo = `<br><span style="font-size: 0.75rem; color: var(--text-muted);">Wynik meczu: <b>${bet.realScore}</b></span>`;

            if (pts >= 1000) {
                // ZIELONY: Dokładny wynik (+1000 lub +1500 z kartkami)
                betStyle = "border-left-color: #10b981; background: rgba(16, 185, 129, 0.1);"; 
                resultBadge = `<span style="color: #10b981; font-weight: bold; float: right;">+${pts} pkt</span>` + realScoreInfo;
            } else if (pts > 0) {
                // POMARAŃCZOWY: Trafiony zwycięzca lub same kartki (+500)
                betStyle = "border-left-color: #f59e0b; background: rgba(245, 158, 11, 0.1);";
                resultBadge = `<span style="color: #f59e0b; font-weight: bold; float: right;">+${pts} pkt</span>` + realScoreInfo;
            } else {
                // CZERWONY: Pudło (0)
                betStyle = "border-left-color: #ef4444; opacity: 0.6;";
                resultBadge = `<span style="color: #ef4444; font-weight: bold; float: right;">0 pkt</span>` + realScoreInfo;
            }
        }

        // Dodawanie klocka HTML
        myBetsDiv.innerHTML += `
            <div class="match-box" style="font-size: 0.9rem; padding: 12px; ${betStyle}">
                <div style="margin-bottom: 6px;">
                    <strong>${bet.matchTitle}</strong> 
                    ${resultBadge}
                </div>
                Twój Typ: <strong>${bet.prediction}</strong>${cardsText}
            </div>
        `;
    });
    
    // Ładowanie typów turniejowych
    const tourQ = query(collection(db, "tournament_bets"), where("userId", "==", currentUser.uid));
    const tourSnap = await getDocs(tourQ);
    const tourDiv = document.getElementById('my-tournament-bets');
    if(!tourSnap.empty) {
        document.getElementById('tournament-form').style.display = 'none'; // Ukryj formularz jeśli już obstawił
        const tb = tourSnap.docs[0].data();
        tourDiv.innerHTML = `<b>Twój Typ:</b> Wygrana: ${tb.winner}, Strzelec: ${tb.scorer}, MVP: ${tb.mvp}, Bramkarz: ${tb.gk}`;
    } else {
        document.getElementById('tournament-form').style.display = 'block';
        tourDiv.innerHTML = "";
    }
}

// --- KLIKER ---
let clickCount = 0;
document.getElementById('clicker-btn').addEventListener('click', async () => {
    if(!currentUser) return;
    clickCount++;
    document.getElementById('clicker-progress').innerText = clickCount;
    
    if (clickCount >= 100) {
        clickCount = 0;
        document.getElementById('clicker-progress').innerText = "0";
        await updateDoc(doc(db, "users", currentUser.uid), { points: increment(100) });
    }
});

// --- PACZKI I ALBUM (Grupowanie i sprzedaż) ---
document.getElementById('open-pack-btn').addEventListener('click', async () => {
    if(!currentUser) return;
    if(currentPoints < 100) return alert("Masz za mało punktów!");

    // Pobranie 100 punktów
    await updateDoc(doc(db, "users", currentUser.uid), { points: increment(-100) });

    // 1. Losujemy liczbę od 0 do 100 (rzut "kostką" o 100 ściankach)
    const roll = Math.random() * 100;
    let targetRarity;

    // 2. Ustalamy co wylosowaliśmy na podstawie procentów
    if (roll < 5) {
        targetRarity = "Legend"; // 5% szans (od 0 do 5)
    } else if (roll < 30) {
        targetRarity = "Rare";   // 25% szans (od 5 do 30)
    } else {
        targetRarity = "Common"; // 70% szans (reszta)
    }

    // 3. Filtrujemy bazę tylko do zawodników z wylosowanej kategorii
    const filteredPlayers = playersDB.filter(p => p.rarity === targetRarity);
    
    // 4. Losujemy konkretnego piłkarza z tej węższej grupy
    const randomPlayer = filteredPlayers[Math.floor(Math.random() * filteredPlayers.length)];

    document.getElementById('pack-result').innerHTML = `<h3 style="color: var(--gold); text-align: center;">🎉 ${randomPlayer.name}</h3>`;
    await addDoc(collection(db, "user_cards"), {
        userId: currentUser.uid,
        playerName: randomPlayer.name,
        rarity: randomPlayer.rarity
    });
    loadUserCards();
});

async function loadUserCards() {
    const q = query(collection(db, "user_cards"), where("userId", "==", currentUser.uid));
    const querySnapshot = await getDocs(q);
    
    // Grupowanie kart
    const album = {};
    querySnapshot.forEach((d) => {
        const card = d.data();
        if(!album[card.playerName]) {
            album[card.playerName] = { count: 0, rarity: card.rarity, docIds: [] };
        }
        album[card.playerName].count++;
        album[card.playerName].docIds.push(d.id);
    });

    // --- NOWOŚĆ: Obliczanie i wyświetlanie stanu kolekcji ---
    const uniqueOwned = Object.keys(album).length; // Ile unikalnych kart ma gracz
    const totalCards = playersDB.length; // Ile kart jest w ogóle w grze
    document.getElementById('collection-counter').innerText = `(${uniqueOwned} / ${totalCards})`;
    // ---------------------------------------------------------

    const albumDiv = document.getElementById('my-cards-album');
    albumDiv.innerHTML = "";
    
    for (const [playerName, data] of Object.entries(album)) {
        let sellBtnHtml = '';
        if(data.count > 1) {
            sellBtnHtml = `
                <div style="display: flex; gap: 5px; margin-top: 5px;">
                    <button class="sell-btn" style="flex: 1; padding: 5px 2px;" onclick="sellDuplicate('${data.docIds[0]}')">Wyrzuć</button>
                    <button class="sell-btn" style="flex: 1; background: var(--gold); color: black; padding: 5px 2px;" onclick="listOnMarket('${data.docIds[0]}', '${playerName}', '${data.rarity}')">Rynek</button>
                </div>
            `;
        }

        albumDiv.innerHTML += `
            <div class="album-card rarity-${data.rarity}">
                ${data.count > 1 ? `<div class="card-quantity">${data.count}</div>` : ''}
                <div>
                    <strong>${playerName}</strong><br>
                    <span style="font-size: 0.7rem;">${data.rarity}</span>
                </div>
                ${sellBtnHtml}
            </div>
        `;
    }
}

// Funkcja globalna do sprzedaży (ponieważ używamy onclick w HTML generowanym z JS)
window.sellDuplicate = async function(docId) {
    if(!confirm("Sprzedać duplikat za 50 pkt?")) return;
    await deleteDoc(doc(db, "user_cards", docId));
    await updateDoc(doc(db, "users", currentUser.uid), { points: increment(50) });
    loadUserCards();
}



// --- RANKING ---
window.usersDataMap = {}; // Globalny słownik przechowujący Nicki graczy

function loadRanking() {
    const q = query(collection(db, "users"), orderBy("points", "desc"));
    onSnapshot(q, (snapshot) => {
        const rankingDiv = document.getElementById('ranking-list');
        rankingDiv.innerHTML = "";
        let place = 1;
        snapshot.forEach((doc) => {
            const data = doc.data();
            const name = data.email.split('@')[0];
            
            window.usersDataMap[doc.id] = name; // Skrypt zapamiętuje Nick!

            let medal = place === 1 ? '🥇' : (place === 2 ? '🥈' : (place === 3 ? '🥉' : `${place}.`));
            const exact = data.exactHits || 0;
            const outcome = data.outcomeHits || 0;
            
            rankingDiv.innerHTML += `
                <div class="ranking-item" style="align-items: flex-start;">
                    <div style="display: flex; flex-direction: column;">
                        <span>${medal} ${name}</span>
                        <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: normal; margin-left: 25px; margin-top: 3px;">
                            🎯 Dokładne: <b>${exact}</b> | ✅ Typ: <b>${outcome}</b>
                        </span>
                    </div>
                    <span style="color: var(--gold);">${data.points} pkt</span>
                </div>
            `;
            place++;
        });
    });
}

// --- 🛠️ PANEL ADMINISTRATORA (ROZLICZANIE ZAKŁADÓW) ---
async function populateAdminMatches() {
    const adminSelect = document.getElementById('admin-match-select');
    adminSelect.innerHTML = '<option value="" disabled selected>Ładowanie meczów...</option>';
    
    try {
        // 1. Pobieramy z bazy listę ID meczów, które już rozliczyłeś
        const resolvedSnap = await getDocs(collection(db, "resolved_matches"));
        const resolvedIds = resolvedSnap.docs.map(docSnap => docSnap.id);
        
        // 2. Budujemy listę od nowa
        adminSelect.innerHTML = '<option value="" disabled selected>Wybierz mecz...</option>';
        matchesDB.forEach(match => {
            // 3. Dodajemy mecz TYLKO, jeśli jego ID nie ma na liście rozliczonych!
            if (!resolvedIds.includes(match.id)) {
                adminSelect.innerHTML += `<option value="${match.id}">${match.home} vs ${match.away}</option>`;
            }
        });
    } catch(e) {
        console.error("Błąd pobierania rozliczonych meczów:", e);
    }
}

document.getElementById('admin-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    if(currentUser.email !== ADMIN_EMAIL) return;

    const matchId = document.getElementById('admin-match-select').value;
    const homeScore = parseInt(document.getElementById('admin-home-score').value);
    const awayScore = parseInt(document.getElementById('admin-away-score').value);
    const adminCards = parseInt(document.getElementById('admin-cards').value); // Pobieranie wpisanych kartek
    const logDiv = document.getElementById('admin-log');
    
    if(!matchId) return alert("Wybierz mecz!");
    if(isNaN(adminCards)) return alert("Wpisz ilość kartek!");
    
    // Logika meczu: 1 = wygrana gospodarzy, 2 = wygrana gości, X = remis
    const realResult = (homeScore > awayScore) ? '1' : (homeScore < awayScore) ? '2' : 'X';
    const exactScoreStr = `${homeScore}:${awayScore}`;
    
    logDiv.innerText = "⏳ Rozliczam zakłady...";

    try {
        // Znajdź wszystkie zakłady na ten konkretny mecz
        const q = query(collection(db, "bets"), where("matchId", "==", matchId));
        const snapshot = await getDocs(q);
        
        let processed = 0;

        for (const betDoc of snapshot.docs) {
            const bet = betDoc.data();
            if (bet.status === "resolved") continue; // Pomiń już rozliczone zakłady!
            
            const betParts = bet.prediction.split(':');
            const betHome = parseInt(betParts[0]);
            const betAway = parseInt(betParts[1]);
            const betResult = (betHome > betAway) ? '1' : (betHome < betAway) ? '2' : 'X';
            
            let pointsWon = 0;
            
            // 1. Punkty za trafienie wyniku
            if (bet.prediction === exactScoreStr) {
                pointsWon += 1000;
            } else if (betResult === realResult) {
                pointsWon += 500;
            }

            // 2. Punkty za kartki
            if (bet.cardsPrediction === adminCards) {
                pointsWon += 500; 
            }
            
            // Zaktualizuj zakład w bazie (oznacz jako rozliczony)
            await updateDoc(doc(db, "bets", betDoc.id), {
                status: "resolved",
                pointsEarned: pointsWon,
                realScore: exactScoreStr
            });
            
            // Dodaj punkty użytkownikowi ORAZ zaktualizuj jego statystyki trafień
            if (pointsWon > 0) {
                const userUpdate = { points: increment(pointsWon) };
                
                if (bet.prediction === exactScoreStr) {
                    userUpdate.exactHits = increment(1);
                } else if (betResult === realResult) {
                    userUpdate.outcomeHits = increment(1);
                }
                
                await updateDoc(doc(db, "users", bet.userId), userUpdate);
            }
            processed++;
        }
        
        // --- NOWOŚĆ: Zapisz mecz jako całkowicie rozliczony ---
        await setDoc(doc(db, "resolved_matches", matchId), { 
            resolvedAt: new Date(),
            matchTitle: `${homeScore}:${awayScore}` 
        });
        
        // --- NOWOŚĆ: Odśwież listę rozwijaną (mecz natychmiast zniknie) ---
        populateAdminMatches();
        // --------------------------------------------------------

        logDiv.innerText = `✅ Sukces! Rozliczono ${processed} zakładów dla tego meczu.`;
        document.getElementById('admin-home-score').value = '';
        document.getElementById('admin-away-score').value = '';
        document.getElementById('admin-cards').value = ''; // Czyszczenie pola kartek
        
    } catch(error) {
        console.error(error);
        logDiv.innerText = `❌ Błąd: ${error.message}`;
    }
});

// --- 🤝 GLOBALNY RYNEK TRANSFEROWY ---

// Wystawianie karty
window.listOnMarket = async function(docId, playerName, rarity) {
    const price = prompt(`Za ile punktów chcesz wystawić kartę ${playerName}?`);
    if(!price || isNaN(price) || price <= 0) return alert("Podaj prawidłową cenę!");

    try {
        const batch = writeBatch(db);
        
        // Usuń z prywatnego albumu
        const cardRef = doc(db, "user_cards", docId);
        batch.delete(cardRef);
        
        // Dodaj na publiczny rynek
        const marketRef = doc(collection(db, "market"));
        batch.set(marketRef, {
            sellerId: currentUser.uid,
            sellerName: currentUser.email.split('@')[0],
            playerName: playerName,
            rarity: rarity,
            price: parseInt(price),
            timestamp: new Date()
        });
        
        await batch.commit();
        alert("Karta wystawiona na rynek!");
        loadUserCards();
    } catch(e) { console.error(e); alert("Błąd wystawiania."); }
}

// Wyświetlanie ofert
function loadMarket() {
    const q = query(collection(db, "market"), orderBy("timestamp", "desc"));
    onSnapshot(q, (snapshot) => {
        const marketDiv = document.getElementById('market-list');
        marketDiv.innerHTML = "";
        
        if (snapshot.empty) {
            marketDiv.innerHTML = "<p style='text-align:center; color: var(--text-muted);'>Rynek jest obecnie pusty.</p>";
            return;
        }

        snapshot.forEach((docSnap) => {
            const item = docSnap.data();
            const isMine = item.sellerId === currentUser.uid;
            
            // Własne oferty można anulować, cudze - kupić
            const actionBtn = isMine 
                ? `<button class="btn-danger" style="padding: 5px; font-size: 0.8rem;" onclick="cancelMarketListing('${docSnap.id}', '${item.playerName}', '${item.rarity}')">Anuluj</button>`
                : `<button class="btn-buy" onclick="buyFromMarket('${docSnap.id}', '${item.sellerId}', ${item.price}, '${item.playerName}', '${item.rarity}')">Kup (${item.price})</button>`;
            
            marketDiv.innerHTML += `
                <div class="market-item">
                    <div class="market-info">
                        <strong class="rarity-${item.rarity}">${item.playerName}</strong>
                        <span class="market-seller">Od: ${item.sellerName}</span>
                    </div>
                    ${actionBtn}
                </div>
            `;
        });
    });
}

// Kupowanie karty
window.buyFromMarket = async function(listingId, sellerId, price, playerName, rarity) {
    if(currentPoints < price) return alert("Masz za mało punktów!");
    if(!confirm(`Kupić ${playerName} za ${price} pkt?`)) return;

    try {
        const batch = writeBatch(db);
        
        // 1. Odejmij punkty Tobie
        const buyerRef = doc(db, "users", currentUser.uid);
        batch.update(buyerRef, { points: increment(-price) });
        
        // 2. Dodaj punkty sprzedawcy
        const sellerRef = doc(db, "users", sellerId);
        batch.update(sellerRef, { points: increment(price) });
        
        // 3. Dodaj kartę do Twojego albumu
        const newCardRef = doc(collection(db, "user_cards"));
        batch.set(newCardRef, {
            userId: currentUser.uid,
            playerName: playerName,
            rarity: rarity
        });
        
        // 4. Usuń ofertę z Rynku
        const marketRef = doc(db, "market", listingId);
        batch.delete(marketRef);
        
        await batch.commit(); // Wykonaj wszystko naraz!
        alert(`Gratulacje! Kupiłeś: ${playerName}!`);
        loadUserCards();
    } catch(e) {
        console.error(e);
        alert("Błąd zakupu. Możliwe, że ktoś Cię ubiegł!");
    }
}

// Anulowanie własnej oferty
window.cancelMarketListing = async function(listingId, playerName, rarity) {
    try {
        const batch = writeBatch(db);
        
        // Zwróć kartę do albumu
        const newCardRef = doc(collection(db, "user_cards"));
        batch.set(newCardRef, {
            userId: currentUser.uid,
            playerName: playerName,
            rarity: rarity
        });
        
        // Usuń ofertę
        const marketRef = doc(db, "market", listingId);
        batch.delete(marketRef);
        
        await batch.commit();
        loadUserCards();
    } catch(e) { console.error(e); }
}

// --- ZAKŁADY DŁUGOTERMINOWE ---
document.getElementById('tournament-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    if(!currentUser) return;

    if(!confirm("Czy na pewno chcesz zapisać te typy? Nie będzie można ich zmienić!")) return;

    try {
        await addDoc(collection(db, "tournament_bets"), {
            userId: currentUser.uid,
            winner: document.getElementById('tour-winner').value.trim(),
            scorer: document.getElementById('tour-scorer').value.trim(),
            mvp: document.getElementById('tour-mvp').value.trim(),
            gk: document.getElementById('tour-gk').value.trim(),
            resolved: false
        });
        alert("Typy długoterminowe zostały zablokowane!");
        loadUserBets();
    } catch(e) { console.error(e); }
});

document.getElementById('admin-tour-btn').addEventListener('click', async () => {
    if(currentUser.email !== ADMIN_EMAIL) return;
    
    const realWinner = document.getElementById('admin-tour-winner').value.trim().toLowerCase();
    const realScorer = document.getElementById('admin-tour-scorer').value.trim().toLowerCase();
    const realMvp = document.getElementById('admin-tour-mvp').value.trim().toLowerCase();
    const realGk = document.getElementById('admin-tour-gk').value.trim().toLowerCase();
    
    const logDiv = document.getElementById('admin-log');
    logDiv.innerText = "⏳ Rozliczam turniej...";

    try {
        const q = query(collection(db, "tournament_bets"), where("resolved", "==", false));
        const snapshot = await getDocs(q);
        
        let processed = 0;
        for (const betDoc of snapshot.docs) {
            const bet = betDoc.data();
            let tourPoints = 0;
            
            if(bet.winner.toLowerCase() === realWinner) tourPoints += 2000;
            if(bet.scorer.toLowerCase() === realScorer) tourPoints += 2000;
            if(bet.mvp.toLowerCase() === realMvp) tourPoints += 2000;
            if(bet.gk.toLowerCase() === realGk) tourPoints += 2000;
            
            if(tourPoints > 0) {
                await updateDoc(doc(db, "users", bet.userId), { points: increment(tourPoints) });
            }
            await updateDoc(doc(db, "tournament_bets", betDoc.id), { resolved: true, earned: tourPoints });
            processed++;
        }
        logDiv.innerText = `✅ Sukces! Rozliczono turniej dla ${processed} graczy.`;
    } catch (e) {
        console.error(e);
        logDiv.innerText = `❌ Błąd: ${e.message}`;
    }
});

// --- 👁️ PODGLĄD TYPÓW (MODAL) ---
window.showTeamBets = async function(matchId, matchTitle) {
    document.getElementById('modal-match-title').innerText = matchTitle;
    const listDiv = document.getElementById('modal-bets-list');
    listDiv.innerHTML = "<p style='text-align: center;'>Wczytywanie...</p>";
    document.getElementById('bets-modal').style.display = 'flex'; // Pokaż modal

    try {
        const q = query(collection(db, "bets"), where("matchId", "==", matchId));
        const snapshot = await getDocs(q);
        
        if(snapshot.empty) {
            listDiv.innerHTML = "<p style='text-align: center; color: var(--text-muted);'>Nikt w Ekipie nie obstawił tego meczu!</p>";
            return;
        }

        listDiv.innerHTML = "";
        snapshot.forEach(docSnap => {
            const bet = docSnap.data();
            const userName = window.usersDataMap[bet.userId] || "Nieznany";
            const cardsText = bet.cardsPrediction !== null ? ` | 🟨🟥: <b>${bet.cardsPrediction}</b>` : "";
            
            listDiv.innerHTML += `
                <div class="market-item">
                    <div>
                        <strong style="color: var(--gold);">${userName}</strong>
                        <span style="font-size: 0.85rem; color: var(--text-muted); display:block; margin-top: 3px;">
                            Typuje: <strong style="color: white; font-size: 1rem;">${bet.prediction}</strong>${cardsText}
                        </span>
                    </div>
                </div>
            `;
        });
    } catch(e) {
        listDiv.innerHTML = "Błąd: " + e.message;
        console.error(e);
    }
}

// Zamykanie Modala przyciskiem (X)
window.closeBetsModal = function() {
    document.getElementById('bets-modal').style.display = 'none';
}
