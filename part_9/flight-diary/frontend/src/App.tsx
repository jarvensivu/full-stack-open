import { useEffect, useState } from "react";
import axios from "axios";
import { getAllDiaryEntries, addDiaryEntry } from "./services/diaryService";
import { DiaryEntry } from "./types";

const App = () => {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [date, setDate] = useState<string>("");
  const [visibility, setVisibility] = useState<string>("");
  const [weather, setWeather] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [error, setError] = useState<string | undefined>("");

  useEffect(() => {
    getAllDiaryEntries().then((entries) => {
      setDiaryEntries(entries);
    });
  }, []);

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    addDiaryEntry({ date, visibility, weather, comment })
      .then((savedEntry) => {
        setDiaryEntries(diaryEntries.concat(savedEntry));
        setDate("");
        setVisibility("");
        setWeather("");
        setComment("");
      })
      .catch((error) => {
        if (axios.isAxiosError(error) && error.response) {
          setError(error.response.data);
          setTimeout(() => {
            setError("");
          }, 5000);
        } else {
          console.log(error);
        }
      });
  };

  return (
    <div className="App">
      <h1>Flight Diary</h1>
      <h2>Add new Entry</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          name="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
        <br />
        <label htmlFor="visibility">Visibility</label>
        <input
          type="text"
          id="visibility"
          name="visibility"
          value={visibility}
          onChange={(event) => setVisibility(event.target.value)}
        />
        <br />
        <label htmlFor="weather">Weather</label>
        <input
          type="text"
          id="weather"
          name="weather"
          value={weather}
          onChange={(event) => setWeather(event.target.value)}
        />
        <br />
        <label htmlFor="comment">Comment</label>
        <input
          type="text"
          id="comment"
          name="comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
        <button type="submit">Add</button>
      </form>
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
