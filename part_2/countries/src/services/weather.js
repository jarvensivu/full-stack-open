const api_key = import.meta.env.VITE_API_KEY;

const baseUrl = `https://api.openweathermap.org/data/2.5/weather`;

const getWeather = async (lat, lon) => {
  const url = `${baseUrl}?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    return  await response.json();
  } catch {
    return null;
  }
};

export default getWeather;
