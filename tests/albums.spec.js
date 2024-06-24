const { test, expect } = require('@playwright/test');
const apiHelper = require('../helpers/apiHelper');

test.describe('Albums API Tests', () => {
  let albumId = 10; // Using a hardcoded albumId since website does not allow above 10
  // Test to fetch all albums
  test('GET /albums', async () => {
    const response = await apiHelper.getRequest('albums');
    console.log('GET All Albums Response:', response); // Debug/log response
    expect(response).toBeInstanceOf(Array); // Response is an array?
    expect(response.length).toBeGreaterThan(0); // Array is not empty
    expect(response[0]).toHaveProperty('id'); // 1st item has 'id' 

    // Validate body content
    expect(response[0]).toMatchObject({
      userId: 1,
      id: 1,
      title: "quidem molestiae enim"
    });
  });

  // Fetch a single album by ID
  test('GET /albums/1', async () => {
    const response = await apiHelper.getRequest('albums/1');
    console.log('GET Album Response:', response); // logging response
    expect(response.id).toBe(1); // Check if the id is 1

    // Validate body
    expect(response).toMatchObject({
      userId: 1,
      id: 1,
      title: "quidem molestiae enim"
    });
  });

  // create a new album
  test('POST /albums', async () => {
    const data = {
      userId: 1,
      title: 'foo',
    };
    const response = await apiHelper.postRequest('albums', data);
    console.log('POST Response:', response); // response logging
    expect(response.title).toBe(data.title); // Title matches
    expect(response.userId).toBe(data.userId); // userId matches
    albumId = response.id; // Save the created album ID
    console.log('Created Album ID:', albumId); //  log the created album ID
  });

  // update an existing album
  test('PUT /albums/:id', async () => {
    console.log(albumId); // Debugging: logging albumId
    if (albumId == null) throw new Error('albumId is not set'); // test albumId is set

    const data = {
      id: albumId,
      userId: 1,
      title: 'updated title',
    };
    const response = await apiHelper.putRequest(`albums/${albumId}`, data);
    console.log('PUT Response:', response); // logging response
    expect(response.title).toBe(data.title); // Check the updated title
  });

  // Test to delete an existing album
  test('DELETE /albums/:id', async () => {
    if (albumId == null) throw new Error('albumId is not set'); // Check if albumId is set

    const response = await apiHelper.deleteRequest(`albums/${albumId}`);
    console.log('DELETE Response:', response); // Debugging
    expect(response).toEqual({}); // response is an empty object
  });

  // Negative scenario: an album with invalid data
  test('POST /albums with invalid data', async () => {
    const data = {
      title: '',
    };
    try {
      await apiHelper.postRequest('albums', data);
    } catch (error) {
      console.log('Error:', error); // Debugging
      expect(error.message).toContain('HTTP error! Status: 400'); // test the error status is 400
    }
  });

  // Negative scenario: Updating an album with invalid data
  test('PUT /albums/:id with invalid data', async () => {
    if (albumId == null) throw new Error('albumId is not set'); // Check if albumId is set

    const data = {
      id: albumId,
      title: '',
      userId: 1,
    };
    try {
      await apiHelper.putRequest(`albums/${albumId}`, data);
    } catch (error) {
      console.log('Error:', error); // Debugging
      expect(error.message).toContain('HTTP error! Status: 400'); // Check if the error status is 400
    }
  });

  // Negative scenario: Deleting a non-existing album
  test('DELETE /albums/:id with non-existing ID', async () => {
    try {
      await apiHelper.deleteRequest('albums/999999');
    } catch (error) {
      console.log('Error:', error); // Debugging: logging error
      expect(error.message).toContain('HTTP error! Status: 404'); // Check if the error status is 404
    }
  });
});
