const CountryFilter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      find countries
      <input value={filter} onChange={handleFilterChange} />
    </div>
  );
};

export default CountryFilter;
