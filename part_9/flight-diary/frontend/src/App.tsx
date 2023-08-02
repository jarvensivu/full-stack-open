import { useEffect, useState } from "react";
import axios from "axios";
import { getAllDiaryEntries, addDiaryEntry } from "./services/diaryService";
import { DiaryEntry } from "./types";
import RadioButton from "./components/RadioButton";

const App = () => {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [date, setDate] = useState<string>("");
  const [visibility, setVisibility] = useState<string>("");
  const [weather, setWeather] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [error, setError] = useState<string | undefined>("");

  const visibilityOptions = ["great", "good", "ok", "poor"];
  const weatherOptions = ["sunny", "rainy", "cloudy", "stormy", "windy"];

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

  const selectVisibility = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVisibility(event.target.value);
  };

  const selectWeather = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWeather(event.target.value);
  };

  return (
    <div className="App">
      <h1>Flight Diary</h1>
      <h2>Add new Entry</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
        <div>
          <span>Visibility </span>
          {visibilityOptions.map((option) => (
            <RadioButton key={option} button={option} currentValue={visibility} handleSelect={selectVisibility} />
          ))}
        </div>
        <div>
          <span>Weather </span>
          {weatherOptions.map((option) => (
            <RadioButton key={option} button={option} currentValue={weather} handleSelect={selectWeather} />
          ))}
        </div>
        <div>
          <label htmlFor="comment">Comment</label>
          <input
            type="text"
            id="comment"
            name="comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
        </div>
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
