import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function SupabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState('Checking...');
  const [connectionError, setConnectionError] = useState(null);
  const [recordCount, setRecordCount] = useState(null);

  useEffect(() => {
    const testSupabaseConnection = async () => {
      try {
        console.log('Attempting to connect to Supabase...');
        
        // Test connection by fetching records
        const { data, error, count } = await supabase
          .from('tracking_records')
          .select('*', { count: 'exact' });

        if (error) {
          console.error('Supabase Connection Error:', error);
          setConnectionStatus('Connection Failed');
          setConnectionError(error);
        } else {
          console.log('Supabase Connection Successful!');
          setConnectionStatus('Connected Successfully');
          setRecordCount(count);
        }
      } catch (catchError) {
        console.error('Unexpected Error:', catchError);
        setConnectionStatus('Connection Failed');
        setConnectionError(catchError);
      }
    };

    testSupabaseConnection();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
        
        <div className="mb-4">
          <p className="font-semibold">Connection Status: 
            <span className={
              connectionStatus === 'Connected Successfully' 
              ? 'text-green-500 ml-2' 
              : 'text-red-500 ml-2'
            }>
              {connectionStatus}
            </span>
          </p>
          
          {recordCount !== null && (
            <p className="mt-2">Total Records: {recordCount}</p>
          )}
        </div>
        
        {connectionError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="font-bold text-red-600 mb-2">Error Details:</p>
            <pre className="text-xs overflow-x-auto text-red-800">
              {JSON.stringify(connectionError, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default SupabaseTest;