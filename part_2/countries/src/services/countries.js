const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api/all";

const getAllCountries = async () => {
  try {
    const response = await fetch(baseUrl);
    if (!response.ok) {
      return [];
    }
    return await response.json();
  } catch {
    return [];
  }
};

export default getAllCountries;
