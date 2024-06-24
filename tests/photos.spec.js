const { test, expect } = require('@playwright/test');
const apiHelper = require('../helpers/apiHelper');

test.describe('Photos API Tests', () => {
  let photoId = 50; // Hardcoded photoId for testing

  // Fetch all photos
  test('GET /photos', async () => {
    const response = await apiHelper.getRequest('/photos');
    console.log('GET All Photos Response:', response); // Debug log
    expect(response).toBeInstanceOf(Array); // Check if response is an array
    expect(response.length).toBeGreaterThan(0); // Ensure array is not empty
    expect(response[0]).toHaveProperty('id'); // Ensure first item has 'id' property

    // Validate specific body content
    expect(response[0]).toMatchObject({
      albumId: 1,
      id: 1,
      title: 'accusamus beatae ad facilis cum similique qui sunt',
      url: 'https://via.placeholder.com/600/92c952',
      thumbnailUrl: 'https://via.placeholder.com/150/92c952'
    });
  });

  // Fetch a single photo by ID
  test('GET /photos/1', async () => {
    const response = await apiHelper.getRequest('photos/1');
    console.log('GET Photo Response:', response); // Debug log
    expect(response.id).toBe(1); // Check if the id is 1

    // Validate specific body content
    expect(response).toMatchObject({
      albumId: 1,
      id: 1,
      title: 'accusamus beatae ad facilis cum similique qui sunt',
      url: 'https://via.placeholder.com/600/92c952',
      thumbnailUrl: 'https://via.placeholder.com/150/92c952'
    });
  });

  // Create a new photo
  test('POST /photos', async () => {
    const data = {
      albumId: 1,
      title: 'foo',
      url: 'https://via.placeholder.com/600/92c952',
      thumbnailUrl: 'https://via.placeholder.com/150/92c952'
    };
    const response = await apiHelper.postRequest('photos', data);
    console.log('POST Response:', response); // Debug log
    expect(response.title).toBe(data.title); // Check if the title matches
    expect(response.url).toBe(data.url); // Check if the url matches
    expect(response.thumbnailUrl).toBe(data.thumbnailUrl); // Check if the thumbnailUrl matches
    expect(response.albumId).toBe(data.albumId); // Check if the albumId matches
    photoId = response.id; // Save the created photo ID
    console.log('Created Photo ID:', photoId); // Debug log
  });

  // Update an existing photo
  test('PUT /photos/:id', async () => {
    console.log(photoId); // Debug log
    if (photoId == null) throw new Error('photoId is not set'); // Ensure photoId is set

    const data = {
      id: photoId,
      albumId: 1,
      title: 'updated title',
      url: 'https://via.placeholder.com/600/92c952',
      thumbnailUrl: 'https://via.placeholder.com/150/92c952'
    };
    const response = await apiHelper.putRequest(`photos/${photoId}`, data);
    console.log('PUT Response:', response); // Debug log
    expect(response.title).toBe(data.title); // Check if the title matches the updated title
    expect(response.url).toBe(data.url); // Check if the url matches
    expect(response.thumbnailUrl).toBe(data.thumbnailUrl); // Check if the thumbnailUrl matches
  });

  // Delete an existing photo
  test('DELETE /photos/:id', async () => {
    if (photoId == null) throw new Error('photoId is not set'); // Ensure photoId is set

    const response = await apiHelper.deleteRequest(`photos/${photoId}`);
    console.log('DELETE Response:', response); // Debug log
    expect(response).toEqual({}); // Check if the response is an empty object
  });

  // Negative scenarios

  // Create a photo with invalid data
  test('POST /photos with invalid data', async () => {
    const data = {
      title: '',
    };
    try {
      await apiHelper.postRequest('photos', data);
    } catch (error) {
      console.log('Error:', error); // Debug log
      expect(error.message).toContain('HTTP error! Status: 400'); // Check for 400 error
    }
  });

  // Update a photo with invalid data
  test('PUT /photos/:id with invalid data', async () => {
    if (photoId == null) throw new Error('photoId is not set'); // Ensure photoId is set

    const data = {
      id: photoId,
      title: '',
      albumId: 1,
      url: 'https://via.placeholder.com/600/92c952',
      thumbnailUrl: 'https://via.placeholder.com/150/92c952'
    };
    try {
      await apiHelper.putRequest(`photos/${photoId}`, data);
    } catch (error) {
      console.log('Error:', error); // Debug log
      expect(error.message).toContain('HTTP error! Status: 400'); // Check for 400 error
    }
  });

  // Delete a non-existing photo
  test('DELETE /photos/:id with non-existing ID', async () => {
    try {
      await apiHelper.deleteRequest('photos/999999');
    } catch (error) {
      console.log('Error:', error); // Debug log
      expect(error.message).toContain('HTTP error! Status: 404'); // Check for 404 error
    }
  });
});
