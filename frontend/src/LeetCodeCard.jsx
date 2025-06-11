import React, { useState } from "react";
import html2canvas from "html2canvas";

export default function LeetCodeCard() {
  const [username, setUsername] = useState("");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
     const res = await fetch("https://leetcode-card-generator.onrender.com/api/leetcode", {

        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();
      const statArray = data.data?.matchedUser?.submitStats?.acSubmissionNum;
      if (!statArray) throw new Error("Invalid username or data not found.");

      const statsObj = Object.fromEntries(statArray.map((d) => [d.difficulty, d.count]));
      setStats(statsObj);
    } catch (err) {
      setError("Failed to fetch stats. Check the username.");
    }
    setLoading(false);
  };

  const downloadImage = () => {
    const card = document.getElementById("leetcode-card");
    html2canvas(card).then((canvas) => {
      const link = document.createElement("a");
      link.download = `${username}_leetcode_card.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  const shareLinkedIn = () => {
    const url = encodeURIComponent("https://leetcode.com/" + username);
    const title = encodeURIComponent(`Check out my LeetCode stats! 🧠\nEasy: ${stats.Easy} | Medium: ${stats.Medium} | Hard: ${stats.Hard}`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}`, "_blank");
  };

  const shareX = () => {
    const text = encodeURIComponent(`📊 LeetCode stats for ${username}\n✅ Easy: ${stats.Easy} | 🟡 Medium: ${stats.Medium} | 🔴 Hard: ${stats.Hard}\n#LeetCode #Dev #Coding`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  return (
    <div className={`min-h-screen flex flex-col items-center p-4 transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <div className="w-full max-w-md flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">LeetCode Card Generator</h1>
        <button onClick={() => setDarkMode(!darkMode)} className="px-2 py-1 text-sm rounded bg-gray-300 dark:bg-gray-700">
          {darkMode ? "🌞 Light" : "🌙 Dark"}
        </button>
      </div>

      <input
        type="text"
        placeholder="Enter LeetCode username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="p-2 border rounded w-full max-w-md mb-2"
      />
      <button
        onClick={fetchStats}
        disabled={loading || !username}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {loading ? "Fetching..." : "Generate Card"}
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {stats && (
        <div
          id="leetcode-card"
          style={{
            marginTop: "1.5rem",
            padding: "1.5rem",
            borderRadius: "1rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            width: "100%",
            maxWidth: "28rem",
            textAlign: "center",
            backgroundColor: darkMode ? "#1f2937" : "#ffffff", // dark:bg-gray-800
            color: darkMode ? "#ffffff" : "#000000",          // text color
          }}
        >
             {/* ❌ Close Button */}
    <button
      onClick={() => setStats(null)}
      style={{
        position: "absolute",
        top: "0.5rem",
        right: "0.5rem",
        background: "transparent",
        border: "none",
        fontSize: "1.25rem",
        cursor: "pointer",
        color: darkMode ? "#fff" : "#000",
      }}
      aria-label="Close card"
    >
      ❌
    </button>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem" }}>
            Stats for {username}
          </h2>
          <p style={{ color: "#16a34a" }}>🟢 Easy: {stats.Easy || 0}</p>
          <p style={{ color: "#ca8a04" }}>🟡 Medium: {stats.Medium || 0}</p>
          <p style={{ color: "#dc2626" }}>🔴 Hard: {stats.Hard || 0}</p>
          <p style={{ fontWeight: "bold", marginTop: "0.5rem" }}>✅ Total: {stats.All || 0}</p>

          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <button
              onClick={downloadImage}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Download as Image
            </button>
            <button
              onClick={shareLinkedIn}
              className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
            >
              Share on LinkedIn
            </button>
            <button
              onClick={shareX}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Share on X
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
