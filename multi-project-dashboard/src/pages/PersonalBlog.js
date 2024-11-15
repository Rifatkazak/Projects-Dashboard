import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PersonalBlog = () => {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [newArticle, setNewArticle] = useState({ title: '', content: '', date: '' });
  const [isAdmin, setIsAdmin] = useState(false); // Admin state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track if admin is logged in
  const [loginError, setLoginError] = useState('');

  // Admin credentials (for demonstration purposes, this should be more secure in production)
  const adminCredentials = {
    username: 'admin',
    password: 'admin123',
  };

  // Fetch all articles on load
  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/personal-blog/articles');
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  const handleLogin = () => {
    if (username === adminCredentials.username && password === adminCredentials.password) {
      setIsAdmin(true);
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  const handleSelectArticle = (article) => {
    setSelectedArticle(article);
  };

  const handleDeleteArticle = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/personal-blog/admin/delete-article/${id}`);
      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const handleAddArticle = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/personal-blog/admin/add-article', newArticle);
      setNewArticle({ title: '', content: '', date: '' });
      fetchArticles();
    } catch (error) {
      console.error('Error adding article:', error);
    }
  };

  const handleUpdateArticle = async () => {
    try {
      await axios.put(`http://127.0.0.1:5000/personal-blog/admin/edit-article/${selectedArticle.id}`, selectedArticle);
      setSelectedArticle(null);
      fetchArticles();
    } catch (error) {
      console.error('Error updating article:', error);
    }
  };

  return (
    <div className="personal-blog p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center mb-6">Personal Blog</h1>

      {/* Admin Login Form */}
      {!isLoggedIn ? (
        <div className="login-form mb-8">
          <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border-2 border-gray-300 p-2 w-full mb-4 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-2 border-gray-300 p-2 w-full mb-4 rounded"
          />
          <button
            onClick={handleLogin}
            className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
          >
            Login
          </button>
          {loginError && <p className="text-red-500 mt-2">{loginError}</p>}
        </div>
      ) : (
        <div className="admin-actions mb-8">
          <button
            onClick={handleLogout}
            className="text-white bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      )}

      {/* Guest Section: Display list of articles */}
      <div className="guest-section mb-8">
        <h2 className="text-2xl font-bold mb-4">Articles</h2>
        {articles.map((article) => (
          <div key={article.id} className="article-summary bg-gray-100 p-4 mb-4 rounded shadow-lg">
            <h3
              onClick={() => handleSelectArticle(article)}
              className="text-xl font-medium text-blue-500 cursor-pointer hover:underline"
            >
              {article.title}
            </h3>
            <p className="text-gray-500">{article.date}</p>
            <button
              onClick={() => handleSelectArticle(article)}
              className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded mt-2"
            >
              View
            </button>
            {isAdmin && (
              <button
                onClick={() => handleDeleteArticle(article.id)}
                className="ml-2 text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded mt-2"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Article Detail View */}
      {selectedArticle && (
        <div className="article-detail bg-white p-6 rounded shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">{selectedArticle.title}</h2>
          <p className="text-gray-500 mb-4">{selectedArticle.date}</p>
          <p className="text-lg">{selectedArticle.content}</p>
          {isAdmin && (
            <div className="mt-4">
              <button
                onClick={handleUpdateArticle}
                className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded mr-2"
              >
                Save Changes
              </button>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-white bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {/* Admin Section: Add or Edit Article */}
      {isAdmin && (
        <div className="admin-section bg-white p-6 rounded shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">{selectedArticle ? 'Edit Article' : 'Add Article'}</h2>
          <input
            type="text"
            placeholder="Title"
            value={selectedArticle ? selectedArticle.title : newArticle.title}
            onChange={(e) =>
              selectedArticle
                ? setSelectedArticle({ ...selectedArticle, title: e.target.value })
                : setNewArticle({ ...newArticle, title: e.target.value })
            }
            className="border-2 border-gray-300 p-2 w-full mb-4 rounded"
          />
          <textarea
            placeholder="Content"
            value={selectedArticle ? selectedArticle.content : newArticle.content}
            onChange={(e) =>
              selectedArticle
                ? setSelectedArticle({ ...selectedArticle, content: e.target.value })
                : setNewArticle({ ...newArticle, content: e.target.value })
            }
            className="border-2 border-gray-300 p-2 w-full mb-4 rounded"
            rows="5"
          />
          <input
            type="date"
            value={selectedArticle ? selectedArticle.date : newArticle.date}
            onChange={(e) =>
              selectedArticle
                ? setSelectedArticle({ ...selectedArticle, date: e.target.value })
                : setNewArticle({ ...newArticle, date: e.target.value })
            }
            className="border-2 border-gray-300 p-2 w-full mb-4 rounded"
          />
          <button
            onClick={selectedArticle ? handleUpdateArticle : handleAddArticle}
            className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
          >
            {selectedArticle ? 'Update Article' : 'Add Article'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PersonalBlog;
