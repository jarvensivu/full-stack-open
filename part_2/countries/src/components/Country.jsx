import Weather from "./Weather";

const Country = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {country.capital[0]}</p>
      <p>area {country.area}</p>
      <h3>languages:</h3>
      <ul>
        {Object.keys(country.languages).map((key) => (
          <li key={key}>{country.languages[key]}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt}></img>
      <Weather
        name={country.capital[0]}
        lat={country.capitalInfo.latlng[0]}
        lon={country.capitalInfo.latlng[1]}
      />
    </div>
  );
};

export default Country;
