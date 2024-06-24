const { test, expect } = require('@playwright/test');
const apiHelper = require('../helpers/apiHelper');

test.describe('Posts API Tests', () => {
  let postId = 100; // Hardcoded postId for testing

  // Create a new post
  test('POST /posts', async () => {
    const data = {
      title: 'foo',
      body: 'bar',
      userId: 1,
    };
    const response = await apiHelper.postRequest('posts', data);
    console.log('POST Response:', response); // Log response
    expect(response.title).toBe(data.title); // Check title
    expect(response.body).toBe(data.body); // Check body
    expect(response.userId).toBe(data.userId); // Check userId
    console.log('Created Post ID:', postId); // Log post ID
  });

  // Fetch a single post by ID
  test('GET /posts/1', async () => {
    const response = await apiHelper.getRequest('posts/1');
    console.log('GET Response:', response); // Log response
    expect(response.id).toBe(1); // Check ID
  });

  // Fetch all posts
  test('GET /posts', async () => {
    const response = await apiHelper.getRequest('posts');
    console.log('GET All Posts Response:', response); // Log response
    expect(response.length).toBeGreaterThan(0); // Check if posts exist
  });

  // Fetch a specific post and validate content
  test('GET /posts/7 and validate body', async () => {
    const response = await apiHelper.getRequest('posts/7');
    console.log('GET Post Response:', response); // Log response
    expect(response).toMatchObject({
      userId: 1,
      id: 7,
      title: "magnam facilis autem",
      body: "dolore placeat quibusdam ea quo vitae\nmagni quis enim qui quis quo nemo aut saepe\nquidem repellat excepturi ut quia\nsunt ut sequi eos ea sed quas"
    });
  });

  // Update an existing post
  test('PUT /posts/:id', async () => {
    console.log(postId); // Log postId
    if (postId == null) throw new Error('postId is not set'); // Check postId

    const data = {
      id: postId,
      title: 'updated title',
      body: 'updated body',
      userId: 1,
    };
    const response = await apiHelper.putRequest(`posts/${postId}`, data);
    console.log('PUT Response:', response); // Log response
    expect(response.title).toBe(data.title); // Check updated title
    expect(response.body).toBe(data.body); // Check updated body
  });

  // Delete an existing post
  test('DELETE /posts/:id', async () => {
    if (postId == null) throw new Error('postId is not set'); // Check postId

    const response = await apiHelper.deleteRequest(`posts/${postId}`);
    console.log('DELETE Response:', response); // Log response
    expect(response).toEqual({}); // Check if response is empty
  });

  // Negative scenarios

  // Create a post with invalid data
  test('POST /posts with invalid data', async () => {
    const data = {
      title: '',
      body: '',
    };
    try {
      await apiHelper.postRequest('posts', data);
    } catch (error) {
      console.log('Error:', error); // Log error
      expect(error.message).toContain('HTTP error! Status: 400'); // Check error status
    }
  });

  // Update a post with invalid data
  test('PUT /posts/:id with invalid data', async () => {
    if (postId == null) throw new Error('postId is not set'); // Check postId

    const data = {
      id: postId,
      title: '',
      body: '',
      userId: 1,
    };
    try {
      await apiHelper.putRequest(`posts/${postId}`, data);
    } catch (error) {
      console.log('Error:', error); // Log error
      expect(error.message).toContain('HTTP error! Status: 400'); // Check error status
    }
  });

  // Delete a non-existing post
  test('DELETE /posts/:id with non-existing ID', async () => {
    try {
      await apiHelper.deleteRequest('posts/999999');
    } catch (error) {
      console.log('Error:', error); // Log error
      expect(error.message).toContain('HTTP error! Status: 404'); // Check error status
    }
  });
});
