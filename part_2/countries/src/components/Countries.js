const Countries = ({ countries, selectCountry }) => {
  return countries.map((country) => (
    <div key={country.name.common}>
      <p>
        {country.name.common}
        <button onClick={() => selectCountry(country)}>show</button>
      </p>
    </div>
  ));
};

export default Countries;
