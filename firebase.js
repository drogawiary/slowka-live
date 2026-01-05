import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, onValue, increment, update, onDisconnect } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* 🔴 TU POTEM WKLEISZ SWOJE DANE Z FIREBASE */
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  databaseURL: "TU_DATABASE_URL",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// ELEMENTY UI
const login = document.getElementById("login");
const appBox = document.getElementById("app");
const joinBtn = document.getElementById("join");
const nickInput = document.getElementById("nick");
const hello = document.getElementById("hello");
const countEl = document.getElementById("count");
const incBtn = document.getElementById("inc");
const onlineEl = document.getElementById("online");

// REFERENCJE DO BAZY
const counterRef = ref(db, "global/counter");
const usersRef = ref(db, "global/users");

// LOGOWANIE
joinBtn.onclick = async () => {
  const nick = nickInput.value.trim();
  if (!nick) return alert("Podaj nick");

  const cred = await signInAnonymously(auth);
  const uid = cred.user.uid;

  const userRef = ref(db, `global/users/${uid}`);
  set(userRef, { nick });
  onDisconnect(userRef).remove();

  hello.textContent = `Cześć ${nick} 👋`;
  login.style.display = "none";
  appBox.style.display = "block";
};

// LICZNIK GLOBALNY
onValue(counterRef, snap => {
  countEl.textContent = snap.val() ?? 0;
});

incBtn.onclick = () => {
  update(ref(db, "global"), {
    counter: increment(1)
  });
};

// ONLINE
onValue(usersRef, snap => {
  onlineEl.textContent = snap.exists()
    ? Object.keys(snap.val()).length
    : 0;
});
