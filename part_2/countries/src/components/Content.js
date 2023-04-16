import Countries from "./Countries";
import Country from "./Country";

const Content = ({ countries, selectCountry }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter {countries.length}</p>;
  }

  if (countries.length <= 10 && countries.length > 1) {
    return <Countries countries={countries} selectCountry={selectCountry} />;
  }

  if (countries.length === 1) {
    return <Country country={countries[0]} />;
  }

  return <p>No matches</p>;
};

export default Content;
