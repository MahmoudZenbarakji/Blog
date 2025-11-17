import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../environments/environment";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [form, setForm] = useState({
    title: "",
    body: "",
    image: null,
  });

  const token = localStorage.getItem("token");

  // ===============================
  // FETCH POSTS
  // ===============================
  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${baseUrl}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data.data);
    } catch (error) {
      console.log("Fetch Posts Error:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // ===============================
  // CREATE POST
  // ===============================
  const createPost = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("body", form.body);
      if (form.image) formData.append("image", form.image);

      const res = await axios.post(`${baseUrl}/posts`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.status === "success") {
        setForm({ title: "", body: "", image: null });
        fetchPosts();
      }
    } catch (error) {
      console.log("Create Post Error:", error);
    }
  };

  // ===============================
  // FETCH COMMENTS
  // ===============================
  const fetchComments = async (postId) => {
    try {
      const res = await axios.get(`${baseUrl}/comments/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setComments((prev) => ({
        ...prev,
        [postId]: res.data.data || [],
      }));
    } catch (error) {
      console.log("Fetch Comments Error:", error);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create a Post</h2>

      {/* CREATE POST FORM */}
      <form
        onSubmit={createPost}
        className="mb-10 bg-white shadow-md rounded-lg p-6 space-y-4"
      >
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          className="w-full p-3 border rounded-lg"
        />

        <input
          type="text"
          placeholder="Content"
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          required
          className="w-full p-3 border rounded-lg"
        />

        <input
          type="file"
          onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
          accept="image/*"
          className="w-full p-3 border rounded-lg"
        />

        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create Post
        </button>
      </form>

      {/* POSTS LIST */}
      <h2 className="text-2xl font-bold mb-4">All Posts</h2>

      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post._id} className="border bg-white shadow-sm rounded-lg p-6">
            {/* USER INFO */}
            <p className="text-sm text-gray-500 mb-2">
              Posted by:{" "}
              <span className="font-semibold">
                {post.userId?.name} {post.userId?.lastname}
              </span>{" "}
              (@{post.userId?.username})
            </p>

            <h3 className="text-xl font-semibold">{post.title}</h3>
            <p className="text-gray-700 mt-1">{post.body}</p>

            {/* POST IMAGE */}
            {post.image && (
              <img
                src={`${baseUrl}${post.image}`}
                alt="Post"
                className="mt-3 rounded-lg max-h-64 object-cover"
              />
            )}

            <button
              onClick={() => fetchComments(post._id)}
              className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
            >
              View Comments
            </button>

            {/* COMMENTS */}
            {comments[post._id] && (
              <div className="mt-4 pl-4 border-l-4 border-blue-500">
                <h4 className="text-lg font-bold mb-3">
                  Comments ({comments[post._id].length}):
                </h4>

                {comments[post._id].length === 0 ? (
                  <p className="text-gray-500">No comments yet.</p>
                ) : (
                  <div className="space-y-3">
                    {comments[post._id].map((c) => (
                      <div key={c._id} className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600 font-semibold">
                          {c.userId?.name} {c.userId?.lastname}{" "}
                          <span className="text-gray-500">(@{c.userId?.username})</span>
                        </p>
                        <p className="text-gray-700 mt-1">{c.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
