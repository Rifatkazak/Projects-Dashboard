import React, { useState, useEffect } from "react";
import axios from "axios";

const BlogPlatform = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const apiBase = "http://127.0.0.1:5000/blog"; // API base URL

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${apiBase}/get_all?search=${search}`);
      setPosts(response.data.posts);
    } catch (err) {
      setError("Unable to fetch posts.");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [search]);

  // Create a new post
  const createPost = async () => {
    if (!title || !content) {
      setError("Title and content are required.");
      return;
    }
    try {
      const response = await axios.post(`${apiBase}/create`, { title, content });
      setPosts([...posts, response.data.post]);
      setTitle("");
      setContent("");
      setError("");
    } catch (err) {
      setError("Failed to create post.");
    }
  };

  // Delete a post
  const deletePost = async (id) => {
    try {
      await axios.delete(`${apiBase}/delete/${id}`);
      setPosts(posts.filter((post) => post.id !== id));
    } catch (err) {
      setError("Failed to delete post.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Blog Platform</h1>

      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl mb-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Create a Post</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
        ></textarea>
        <button
          onClick={createPost}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md transition duration-200"
        >
          Create Post
        </button>
        {error && (
          <p className="text-red-500 text-sm mt-3">{error}</p>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold text-gray-700 mb-4">All Posts</h2>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search posts..."
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts found.</p>
        ) : (
          <ul className="space-y-4">
            {posts.map((post) => (
              <li
                key={post.id}
                className="border border-gray-300 rounded-md p-4 bg-gray-50 shadow-sm"
              >
                <h3 className="text-lg font-bold text-gray-800">
                  {post.title}
                </h3>
                <p className="text-gray-600">{post.content}</p>
                <button
                  onClick={() => deletePost(post.id)}
                  className="text-red-500 mt-2 underline text-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BlogPlatform;
