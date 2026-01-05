// ===== FIREBASE SDK =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getDatabase, ref, set, onValue, increment, update, onDisconnect 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ===== CONFIG =====
const firebaseConfig = {
  apiKey: "AIzaSyAnFe0WHxLowybOqXQrlLM8EGg6EU6dkqE",
  authDomain: "slowka-live.firebaseapp.com",
  databaseURL: "https://slowka-live-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "slowka-live",
  storageBucket: "slowka-live.appspot.com",
  messagingSenderId: "651585195290",
  appId: "1:651585195290:web:0dc1e8452d4c0b16a3b0a3"
};

// ===== INIT =====
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// ===== UI =====
const login = document.getElementById("login");
const appBox = document.getElementById("app");
const joinBtn = document.getElementById("join");
const nickInput = document.getElementById("nick");
const hello = document.getElementById("hello");
const countEl = document.getElementById("count");
const incBtn = document.getElementById("inc");
const onlineEl = document.getElementById("online");

// ===== DB REFS =====
const counterRef = ref(db, "global/counter");
const usersRef = ref(db, "global/users");
const connectedRef = ref(db, ".info/connected");

// ===== LOGIN =====
joinBtn.onclick = async () => {
  const nick = nickInput.value.trim();
  if (!nick) return alert("Podaj nick");

  const cred = await signInAnonymously(auth);
  const uid = cred.user.uid;
  const userRef = ref(db, `global/users/${uid}`);

  // REAL ONLINE CONNECTION
  onValue(connectedRef, snap => {
    if (snap.val() === true) {
      set(userRef, { nick });
      onDisconnect(userRef).remove();
    }
  }, { onlyOnce: true });

  // INIT COUNTER (ONCE)
  onValue(counterRef, snap => {
    if (snap.val() === null) set(counterRef, 0);
  }, { onlyOnce: true });

  hello.textContent = `Cześć ${nick} 👋`;
  login.style.display = "none";
  appBox.style.display = "block";
};

// ===== COUNTER =====
onValue(counterRef, snap => {
  countEl.textContent = snap.val() ?? 0;
});

incBtn.onclick = () => {
  update(ref(db, "global"), {
    counter: increment(1)
  });
};

// ===== ONLINE =====
onValue(usersRef, snap => {
  onlineEl.textContent = snap.exists()
    ? Object.keys(snap.val()).length
    : 0;
});
