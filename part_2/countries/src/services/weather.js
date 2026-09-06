const baseUrl = `/api/weather`;

const getWeather = async (lat, lon) => {
  const url = `${baseUrl}?lat=${lat}&lon=${lon}&units=metric`;

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
