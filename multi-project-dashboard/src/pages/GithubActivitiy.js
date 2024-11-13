import React, { useState } from 'react';

const GithubActivities = () => {
    const [username, setUsername] = useState('');
    const [activities, setActivities] = useState([]);
    const [error, setError] = useState(null);
  
    // Function to fetch activities from the Flask API
    const fetchActivities = async () => {
      if (!username) {
        alert('Please enter a GitHub username');
        return;
      }
  
      try {
        const response = await fetch(`http://127.0.0.1:5000/activity/${username}`);
        const data = await response.json();
  
        if (response.ok) {
          setActivities(data.activities);  // Set the activities
          setError(null);  // Clear any previous error
        } else {
          setError(data.message);  // Display error message
          setActivities([]);  // Clear any previous activities
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
        setError('Failed to fetch activities');
        setActivities([]);
      }
    };
  
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">GitHub User Activities</h2>
  
        {/* Input for GitHub username */}
        <div className="mb-4">
          <input
            type="text"
            className="border p-2 w-full mb-2"
            placeholder="Enter GitHub username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            onClick={fetchActivities}
            className="bg-blue-500 text-white p-2 w-full"
          >
            Fetch Activities
          </button>
        </div>
  
        {/* Display Error */}
        {error && (
          <div className="text-red-500 mb-4">
            <p>{error}</p>
          </div>
        )}
  
        {/* Display Activities */}
        {activities.length > 0 ? (
          <div>
            <h3 className="font-semibold mb-2">Recent Activities:</h3>
            <ul>
              {activities.map((activity, index) => (
                <li key={index} className="mb-2">
                  <p className="font-medium">{activity.type}</p>
                  <p>Repository: {activity.repo_name || 'Unknown'}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          !error && <p>No activities to display.</p>
        )}
      </div>
    );
  };
  
  export default GithubActivities;