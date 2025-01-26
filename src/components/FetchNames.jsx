import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.jsx";

const FetchNames = ({ setSelectedCategory, selectedCategory }) => {
  const [names, setNames] = useState([]);
  const [error, setError] = useState(null);

  const fetchNames = async () => {
    const { data, error } = await supabase
      .from("categories") // Replace with your table name
      .select("name");

    if (error) {
      setError(error.message);
    } else {
      const nameList = data && Array.isArray(data) ? data.map((item) => item.name) : [];
      setNames(nameList);
    }
  };

  useEffect(() => {
    fetchNames();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <select
      value={selectedCategory}  // Bind the value of the select to the selectedCategory prop
      onChange={(e) => setSelectedCategory(e.target.value)}  // Use the prop to update the parent state
      className="w-full p-2 border rounded"
    >
      <option value="">Select Category</option>
      {names.map((category, index) => (
        <option key={index} value={category}>
          {category}
        </option>
      ))}
    </select>
  );
};

export default FetchNames;
