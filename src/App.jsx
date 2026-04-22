import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCttSFgeVXx30Ock8OtIsm6W8XbDYDgPmo",
  authDomain: "inquiry-system-73bc6.firebaseapp.com",
  projectId: "inquiry-system-73bc6",
  storageBucket: "inquiry-system-73bc6.firebasestorage.app",
  messagingSenderId: "201449062660",
  appId: "1:201449062660:web:6612252bdf6b3a21155051",
  measurementId: "G-MTSE95TVXN"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const salesList = ["A","B","C","D","E","F","G","H","I","J","K"];

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [skipped, setSkipped] = useState([]);

  // 📥 读取云数据
  useEffect(() => {
    const load = async () => {
      const ref = doc(db, "config", "main");
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setCurrentIndex(data.currentIndex);
        setSkipped(data.skipped);
      }
    };
    load();
  }, []);

  // 📤 保存云数据
  const saveData = async (newIndex, newSkipped) => {
    await setDoc(doc(db, "config", "main"), {
      currentIndex: newIndex,
      skipped: newSkipped
    });
  };

  const getNext = () => {
    let index = currentIndex;
    let attempts = 0;

    while ((skipped || []).includes(salesList[index]) && attempts < salesList.length) {
      index = (index + 1) % salesList.length;
      attempts++;
    }

    return { person: salesList[index], index };
  };

  const assignNext = async () => {
    const { index } = getNext();
    const nextIndex = (index + 1) % salesList.length;
    setCurrentIndex(nextIndex);
    await saveData(nextIndex, skipped);
  };

  const toggleSkip = async (name) => {
    let newSkipped;
    if ((skipped || []).includes(name)) {
      newSkipped = skipped.filter(s => s !== name);
    } else {
      newSkipped = [...skipped, name];
    }
    setSkipped(newSkipped);
    await saveData(currentIndex, newSkipped);
  };

  const next = getNext();

  const resetAll = async () => {
  await setDoc(doc(db, "config", "main"), {
    currentIndex: 0,
    skipped: []
  });
  setCurrentIndex(0);
  setSkipped([]);
};

  return (
    <div style={{ 
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    minHeight: "100vh",
    paddingTop: 50,
    background: "#f5f5f5"
  }}>
    <div style={{
      width: 500,
      background: "#fff",
      padding: 30,
      borderRadius: 10,
      boxShadow: "0 0 10px rgba(0,0,0,0.1)"
    }}>
      <h1>Inquiry Tool (Cloud Sync)</h1>

      <div style={{
  background: "#f3f3f3",
  padding: 20,
  marginBottom: 20,
  textAlign: "center"
}}>
  <p>Next Assigned To:</p>
  <h2 style={{ fontSize: 40 }}>{next.person}</h2>
  <button onClick={assignNext}>Confirm Assignment</button>
</div>

      <h3>Sales</h3>
      {salesList.map(name => (
  <div
    key={name}
    style={{
      display: "flex",
      justifyContent: "space-between",   // 👉 左右分开
      alignItems: "center",
      background: (skipped || []).includes(name) ? "#ffdddd" : "#fff",
      padding: 10,
      marginBottom: 5
    }}
  >
    <span>{name}</span>

    <button onClick={() => toggleSkip(name)}>
      {(skipped || []).includes(name) ? "Restore" : "Mark Red"}
    </button>
  </div>
      ))}
      <button onClick={resetAll} style={{ marginTop: 20 }}>
  Reset System
</button>
    </div>
  </div>
  );
}
