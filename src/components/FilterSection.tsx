export const FilterSection = () => {
  return (
    <div className="flex gap-4 flex-wrap">
      <select className="px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-primary">
        <option value="">Price Range</option>
        <option value="0-50">$0 - $50</option>
        <option value="51-100">$51 - $100</option>
        <option value="101+">$101+</option>
      </select>
      <select className="px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-primary">
        <option value="">Specialty</option>
        <option value="wedding">Wedding Dresses</option>
        <option value="evening">Evening Gowns</option>
        <option value="casual">Casual Wear</option>
      </select>
      <select className="px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-primary">
        <option value="">Location</option>
        <option value="new-york">New York</option>
        <option value="los-angeles">Los Angeles</option>
        <option value="chicago">Chicago</option>
      </select>
    </div>
  );
};