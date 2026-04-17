import { useState, useEffect } from "react";

export default function App() {
  const defaultSales = [
    { name: "A", skipped: false },
    { name: "B", skipped: false },
    { name: "C", skipped: false },
    { name: "D", skipped: false },
    { name: "E", skipped: false },
    { name: "F", skipped: false },
    { name: "G", skipped: false },
    { name: "H", skipped: false },
    { name: "I", skipped: false },
    { name: "J", skipped: false },
    { name: "K", skipped: false }
  ];

  const [sales, setSales] = useState(() => {
    const saved = localStorage.getItem("sales");
    return saved ? JSON.parse(saved) : defaultSales;
  });

  const [currentIndex, setCurrentIndex] = useState(() => {
    const saved = localStorage.getItem("currentIndex");
    return saved ? JSON.parse(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem("sales", JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem("currentIndex", JSON.stringify(currentIndex));
  }, [currentIndex]);

  const getNextSales = () => {
    let index = currentIndex;
    let attempts = 0;

    while (sales[index].skipped && attempts < sales.length) {
      index = (index + 1) % sales.length;
      attempts++;
    }

    return { person: sales[index].name, index };
  };

  const assignNext = () => {
    const { index } = getNextSales();
    setCurrentIndex((index + 1) % sales.length);
  };

  const toggleSkip = (idx) => {
    const updated = [...sales];
    updated[idx].skipped = !updated[idx].skipped;
    setSales(updated);
  };

  const resetAll = () => {
    localStorage.removeItem("sales");
    localStorage.removeItem("currentIndex");
    setSales(defaultSales);
    setCurrentIndex(0);
  };

  const next = getNextSales();

  return (
    <div style={{ padding: 40, maxWidth: 500, margin: "auto" }}>
      <h1>Inquiry Assignment Helper</h1>

      <div style={{ background: "#f3f3f3", padding: 20, marginBottom: 20 }}>
        <p>Next Assigned To:</p>
        <h2 style={{ fontSize: 40 }}>{next.person}</h2>

        <button onClick={assignNext}>Confirm Assignment</button>
      </div>

      <h3>Sales Status</h3>
      {sales.map((s, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            justifyContent: "space-between",
            background: s.skipped ? "#ffdddd" : "#fff",
            padding: 10,
            marginBottom: 5
          }}
        >
          <span>{s.name}</span>
          <button onClick={() => toggleSkip(idx)}>
            {s.skipped ? "Restore" : "Mark Red"}
          </button>
        </div>
      ))}

      <button onClick={resetAll} style={{ marginTop: 20 }}>
        Reset System
      </button>
    </div>
  );
}