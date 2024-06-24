const { test, expect } = require('@playwright/test');
const apiHelper = require('../helpers/apiHelper');

test.describe('Comments API Tests', () => {
  let commentId = 500; // Using a hardcoded commentId to simulate existing data as comments are limited to 500

  // Test to fetch all comments
  test('GET /comments', async () => {
    const response = await apiHelper.getRequest('comments');
    console.log('GET All Comments Response:', response); // logging response
    expect(response).toBeInstanceOf(Array); // Check if response is an array
    expect(response.length).toBeGreaterThan(0); // array is not empty
    expect(response[0]).toHaveProperty('id'); // 1st item has 'id' property
  });

  // Test to fetch a single comment by ID
  test('GET /comments/1', async () => {
    const response = await apiHelper.getRequest('comments/1');
    console.log('GET Comment Response:', response); // Debugging
    expect(response.id).toBe(1); // Check if the id is 1
  });

  // Test to fetch a specific comment by ID and validate body content
  test('GET /comments/5 and validate body', async () => {
    const response = await apiHelper.getRequest('comments/5');
    console.log('GET Comment Response:', response); // Debugging
    expect(response).toMatchObject({
      postId: 1,
      id: 5,
      name: "vero eaque aliquid doloribus et culpa",
      email: "Hayden@althea.biz",
      body: "harum non quasi et ratione\ntempore iure ex voluptates in ratione\nharum architecto fugit inventore cupiditate\nvoluptates magni quo et"
    });
  });

  // Test to create a new comment
  test('POST /comments', async () => {
    const data = {
      name: 'foo',
      body: 'bar',
      email: 'test@example.com',
      postId: 1,
    };
    const response = await apiHelper.postRequest('comments', data);
    console.log('POST Response:', response); // Debugging
    expect(response.name).toBe(data.name); // the name matches?
    expect(response.body).toBe(data.body); // the body matches?
    expect(response.email).toBe(data.email); // the email matches?
    expect(response.postId).toBe(data.postId); //the postId matches?
    commentId = response.id; // Save the created comment ID
    console.log('Created Comment ID:', commentId); // log the created comment ID
  });

  // Test to update an existing comment
  test('PUT /comments/:id', async () => {
    console.log(commentId); // Debugging: logging commentId
    if (commentId == null) throw new Error('commentId is not set'); // Check if commentId is set

    const data = {
      id: commentId,
      name: 'updated name',
      body: 'updated body',
      email: 'test@example.com',
      postId: 1,
    };
    const response = await apiHelper.putRequest(`comments/${commentId}`, data);
    console.log('PUT Response:', response); // Debugging: logging response
    expect(response.name).toBe(data.name); // test the name matches the updated name
    expect(response.body).toBe(data.body); // test the body matches the updated body
  });

  // Test to delete an existing comment
  test('DELETE /comments/:id', async () => {
    if (commentId == null) throw new Error('commentId is not set'); // Check if commentId is set

    const response = await apiHelper.deleteRequest(`comments/${commentId}`);
    console.log('DELETE Response:', response); // log response
    expect(response).toEqual({}); // Check if the response is an empty object
  });

  // Negative scenario: Creating a comment with invalid data
  test('POST /comments with invalid data', async () => {
    const data = {
      name: '',
      body: '',
      email: 'invalidemail',
    };
    try {
      await apiHelper.postRequest('comments', data);
    } catch (error) {
      console.log('Error:', error); // Debugging: logging error
      expect(error.message).toContain('HTTP error! Status: 400'); // Check if the error status is 400
    }
  });

  // Negative scenario: Updating a comment with invalid data
  test('PUT /comments/:id with invalid data', async () => {
    if (commentId == null) throw new Error('commentId is not set'); // Check if commentId is set

    const data = {
      id: commentId,
      name: '',
      body: '',
      email: 'invalidemail',
      postId: 1,
    };
    try {
      await apiHelper.putRequest(`comments/${commentId}`, data);
    } catch (error) {
      console.log('Error:', error); // Debugging: logging error
      expect(error.message).toContain('HTTP error! Status: 400'); // Check if the error status is 400
    }
  });

  // Negative scenario: Deleting a non-existing comment
  test('DELETE /comments/:id with non-existing ID', async () => {
    try {
      await apiHelper.deleteRequest('comments/999999');
    } catch (error) {
      console.log('Error:', error); // Debugging: logging error
      expect(error.message).toContain('HTTP error! Status: 404'); // Check if the error status is 404
    }
  });
});
