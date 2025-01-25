import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const VALID_CODES = {
  '127': 'user', '256': 'user', '394': 'user', '438': 'user',
  '512': 'user', '569': 'user', '603': 'user', '647': 'user',
  '682': 'user', '715': 'user', '743': 'user', '789': 'user',
  '812': 'user', '856': 'user', '891': 'user', '923': 'user',
  '945': 'user', '967': 'user', '978': 'user', '994': 'user',
  '793': 'admin'
};

const PARTICIPANTS = ['Craig', 'Immie', 'Jake', 'Brian', 'Reah', 'Josh', 'Archie', 'David', 'Audrey', 'James', 'Abe', 'Connor', 'Lucy', 'Becky', 'Tom', 'Freddie'];

// Initial categories moved to state to allow updates? TEST
const INITIAL_CATEGORIES = [
  'TC', 'NTC', 'yardsale', 'lost ≥1 shoe', 'missed lesson',
  'chops', 'missed boarding', 'cuppa', 'animal incident',
  'investment', 'knocks over another individual'
];

function App() {
  const [accessCode, setAccessCode] = useState('');
  const [userType, setUserType] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showSubmitMessage, setShowSubmitMessage] = useState(false);
  const [records, setRecords] = useState([]);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (userType !== 'admin') return;

      // Fetch records
      const { data: recordsData, error: recordsError } = await supabase
        .from('tracking_records')
        .select('*');

      if (recordsError) {
        console.error('Error fetching records:', recordsError);
        return;
      }
      setRecords(recordsData || []);

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('name');

      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
        return;
      }
      
      if (categoriesData && categoriesData.length > 0) {
        setCategories(categoriesData.map(c => c.name));
      }
    };

    fetchData();
  }, [userType]);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    
    try {
      const { error } = await supabase
        .from('categories')
        .insert([{ name: newCategory.trim() }]);

      if (error) throw error;

      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    } catch (error) {
      alert('Failed to add category');
      console.error('Error adding category:', error);
    }
  };

  const handleLogin = () => {
    const userRole = VALID_CODES[accessCode];
    if (userRole) {
      setUserType(userRole);
    } else {
      alert('Invalid access code');
    }
  };

  const handleSubmit = async () => {
    if (!selectedPerson || !selectedCategory) {
      alert('Please select both a person and a category');
      return;
    }
    if (!isConfirmed) {
      alert('Please confirm you are not being a fraudie');
      return;
    }

    try {
      const { error } = await supabase
        .from('tracking_records')
        .insert([{
          person: selectedPerson,
          category: selectedCategory,
          access_code: accessCode
        }]);

      if (error) throw error;

      setSelectedPerson('');
      setSelectedCategory('');
      setIsConfirmed(false);
      setShowSubmitMessage(true);
      
      setTimeout(() => {
        setShowSubmitMessage(false);
      }, 3000);
    } catch (error) {
      alert('Failed to submit record. Please try again.');
      console.error('Error submitting record:', error);
    }
  };

  if (!userType) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Les Arcs Tracking</h1>
        <div className="max-w-sm mx-auto space-y-4">
          <input 
            type="text"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            placeholder="Enter your 3-digit code"
            maxLength={3}
            className="w-full p-2 border rounded"
          />
          <button 
            onClick={handleLogin}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (userType === 'user') {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Les Arcs Tracking</h1>
        
        <div className="max-w-sm mx-auto mb-8 space-y-4">
          <select 
            value={selectedPerson}
            onChange={(e) => setSelectedPerson(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Person</option>
            {PARTICIPANTS.map(person => (
              <option key={person} value={person}>{person}</option>
            ))}
          </select>

          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <div className="flex items-center justify-center gap-2">
            <input 
              type="checkbox"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              className="w-4 h-4"
            />
            <label>I agree to not be a fraudie</label>
          </div>

          <button 
            onClick={handleSubmit}
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Submit
          </button>
          
          {showSubmitMessage && (
            <div className="text-green-500 font-bold text-center">
              Successfully submitted!
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Les Arcs Tracking - Admin View</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Add New Category</h2>
        <div className="flex gap-2 max-w-sm">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter new category"
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleAddCategory}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Person</th>
              <th className="border border-gray-300 p-2">Total</th>
              {categories.map(category => (
                <th key={category} className="border border-gray-300 p-2">{category}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PARTICIPANTS.map(person => {
              const personRecords = records.filter(r => r.person === person);
              const stats = categories.reduce((acc, category) => ({
                ...acc,
                [category]: personRecords.filter(r => r.category === category).length
              }), {});
              
              return (
                <tr key={person}>
                  <td className="border border-gray-300 p-2">{person}</td>
                  <td className="border border-gray-300 p-2">{personRecords.length}</td>
                  {categories.map(category => (
                    <td key={category} className="border border-gray-300 p-2">
                      {stats[category] || 0}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
