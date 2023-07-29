import { useEffect, useState } from "react";
import { getAllDiaryEntries } from "./services/diaryService";
import { DiaryEntry } from "./types";

const App = () => {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    getAllDiaryEntries().then((entries) => {
      console.log(entries);
      setDiaryEntries(entries);
    });
  }, []);

  return (
    <div className="App">
      <h1>Flight Diary</h1>
      <h2>Diary entries</h2>
      {diaryEntries.map((entry) => (
        <div key={entry.id}>
          <h3>{entry.date}</h3>
          <p>visibility: {entry.visibility}</p>
          <p>weather: {entry.weather}</p>
        </div>
      ))}
    </div>
  );
};

export default App;
