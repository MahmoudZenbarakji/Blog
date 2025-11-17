import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { baseUrl } from '../../environments/environment';

const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [form, setForm] = useState({
    title: '',
    body: '',
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    loadToken();
  }, []);

  useEffect(() => {
    if (token) {
      fetchPosts();
    }
  }, [token]);

  const loadToken = async () => {
    const storedToken = await AsyncStorage.getItem('token');
    setToken(storedToken);
  };

  // ===============================
  // FETCH POSTS
  // ===============================
  const fetchPosts = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${baseUrl}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data.data || []);
    } catch (error) {
      console.log('Fetch Posts Error:', error);
      if (error.response?.status === 401) {
        // Token expired, navigate to login
        await AsyncStorage.removeItem('token');
        navigation.getParent()?.replace('Login');
      }
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  // ===============================
  // CREATE POST
  // ===============================
  const createPost = async () => {
    if (!form.title || !form.body) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('body', form.body);
      if (form.image) {
        formData.append('image', {
          uri: form.image.uri,
          type: form.image.type,
          name: form.image.fileName || 'image.jpg',
        });
      }

      const res = await axios.post(`${baseUrl}/posts`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.status === 'success') {
        setForm({ title: '', body: '', image: null });
        fetchPosts();
        Alert.alert('Success', 'Post created successfully');
      }
    } catch (error) {
      console.log('Create Post Error:', error);
      Alert.alert('Error', 'Failed to create post');
    } finally {
      setLoading(false);
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
      console.log('Fetch Comments Error:', error);
    }
  };

  // ===============================
  // PICK IMAGE
  // ===============================
  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
      },
      (response) => {
        if (response.assets && response.assets[0]) {
          setForm({
            ...form,
            image: {
              uri: response.assets[0].uri,
              type: response.assets[0].type,
              fileName: response.assets[0].fileName,
            },
          });
        }
      }
    );
  };

  const renderPost = ({ item: post }) => (
    <View style={styles.postContainer}>
      <Text style={styles.postAuthor}>
        Posted by: {post.userId?.name} {post.userId?.lastname} (@
        {post.userId?.username})
      </Text>

      <Text style={styles.postTitle}>{post.title}</Text>
      <Text style={styles.postBody}>{post.body}</Text>

      {post.image && (
        <Image
          source={{ uri: `${baseUrl.replace('/api/v1', '')}${post.image}` }}
          style={styles.postImage}
          resizeMode="cover"
        />
      )}

      <TouchableOpacity
        style={styles.commentButton}
        onPress={() => fetchComments(post._id)}
      >
        <Text style={styles.commentButtonText}>View Comments</Text>
      </TouchableOpacity>

      {comments[post._id] && (
        <View style={styles.commentsContainer}>
          <Text style={styles.commentsTitle}>
            Comments ({comments[post._id].length}):
          </Text>

          {comments[post._id].length === 0 ? (
            <Text style={styles.noComments}>No comments yet.</Text>
          ) : (
            comments[post._id].map((comment) => (
              <View key={comment._id} style={styles.commentItem}>
                <Text style={styles.commentAuthor}>
                  {comment.userId?.name} {comment.userId?.lastname} (@
                  {comment.userId?.username})
                </Text>
                <Text style={styles.commentContent}>{comment.content}</Text>
              </View>
            ))
          )}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* CREATE POST FORM */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Create a Post</Text>

          <TextInput
            style={styles.input}
            placeholder="Title"
            value={form.title}
            onChangeText={(text) => setForm({ ...form, title: text })}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Content"
            value={form.body}
            onChangeText={(text) => setForm({ ...form, body: text })}
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <Text style={styles.imageButtonText}>
              {form.image ? 'Image Selected' : 'Pick Image'}
            </Text>
          </TouchableOpacity>

          {form.image && (
            <Image source={{ uri: form.image.uri }} style={styles.previewImage} />
          )}

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.buttonDisabled]}
            onPress={createPost}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Create Post</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* POSTS LIST */}
        <Text style={styles.sectionTitle}>All Posts</Text>

        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item._id}
          scrollEnabled={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No posts yet. Create one!</Text>
          }
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 15,
    margin: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageButton: {
    backgroundColor: '#34C759',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  postContainer: {
    backgroundColor: '#fff',
    padding: 15,
    margin: 15,
    marginTop: 0,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  postAuthor: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  postBody: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  commentButton: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  commentButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  commentsContainer: {
    marginTop: 15,
    paddingLeft: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  noComments: {
    color: '#666',
    fontStyle: 'italic',
  },
  commentItem: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  commentAuthor: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 4,
  },
  commentContent: {
    fontSize: 14,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontSize: 16,
  },
});

export default HomeScreen;

