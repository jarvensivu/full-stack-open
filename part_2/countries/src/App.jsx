import { useState, useEffect } from "react";

import getAllCountries from "./services/countries";
import CountryFilter from "./components/CountryFilter";
import Content from "./components/Content";

const App = () => {
  const [filter, setFilter] = useState("");
  const [allCountries, setAllCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAllCountries()
      .then((allCountries) => {
        setAllCountries(allCountries);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const handleFilterChange = (event) => {
    const newFilter = event.target.value;
    const countries =
      newFilter.trim().length === 0
        ? allCountries
        : allCountries.filter((country) =>
            country.name.common
              .toLowerCase()
              .includes(newFilter.trim().toLowerCase())
          );
    setFilter(newFilter);
    setFilteredCountries(countries);
  };

  const selectCountry = (country) => {
    setFilteredCountries([country]);
  };

  return (
    <div>
      {isLoading ? <p>Loading countries...</p> : null}
      {!isLoading && allCountries.length === 0 ? (
        <p>Failed to load countries.</p>
      ) : null}
      {!isLoading && allCountries.length > 0 ? (
        <>
          <CountryFilter filter={filter} handleFilterChange={handleFilterChange} />
          <Content
            countries={filteredCountries}
            filter={filter}
            selectCountry={selectCountry}
            />
        </>
      ) : null}
    </div>
  );
};

export default App;
