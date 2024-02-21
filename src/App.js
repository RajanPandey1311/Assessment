import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [playlist, setPlaylist] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);

  useEffect(() => {
    const storedIndex = localStorage.getItem("lastPlayedIndex");
    if (storedIndex !== null) {
      setCurrentFileIndex(parseInt(storedIndex));
    }

    const storedPlaylist = localStorage.getItem("playlist");
    if (storedPlaylist !== null) {
      setPlaylist(JSON.parse(storedPlaylist));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("playlist", JSON.stringify(playlist));
    localStorage.setItem("lastPlayedIndex", currentFileIndex);
  }, [playlist, currentFileIndex]);

  useEffect(() => {
    const storedAudio = localStorage.getItem("lastPlayedAudio");
    const audio = document.getElementById("audioPlayer");
    if (storedAudio !== null && audio) {
      audio.src = storedAudio;
      audio.currentTime =
        parseFloat(localStorage.getItem("lastPlayedTime")) || 0;
    }
  }, []);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setPlaylist((prevPlaylist) => [...prevPlaylist, ...files]);
  };

  const handleFileSelect = (index) => {
    setCurrentFileIndex(index);
  };

  const handleEnded = () => {
    if (currentFileIndex < playlist.length - 1) {
      setCurrentFileIndex(currentFileIndex + 1);
    }
  };

  const handleTimeUpdate = (e) => {
    localStorage.setItem("lastPlayedTime", e.target.currentTime);
  };

  return (
    <div className="bg-gradient-to-r from-purple-400 to-indigo-500 min-h-screen flex flex-col justify-center items-center">
      <div className="container mx-auto p-4 w-[60%] bg-white rounded-lg shadow-lg">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">Upload</h1>
          <input
            type="file"
            accept="audio/*"
            multiple
            onChange={handleFileUpload}
            className="bg-gray-200 px-4 py-2 rounded-lg"
          />
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Playlist</h2>
          <ul>
            {playlist.map((file, index) => (
              <li
                key={index}
                className={`playlist-item cursor-pointer ${
                  currentFileIndex === index ? "font-bold" : ""
                } bg-blue-200 text-blue-900 shadow-md rounded-lg p-2 mb-2`}
                onClick={() => handleFileSelect(index)}
              >
                {file.name}
              </li>
            ))}
          </ul>
        </div>
        {playlist.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Now Playing</h2>
            <audio
              id="audioPlayer"
              controls
              src={URL.createObjectURL(playlist[currentFileIndex])}
              onEnded={handleEnded}
              onTimeUpdate={handleTimeUpdate}
              className="mb-4"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
