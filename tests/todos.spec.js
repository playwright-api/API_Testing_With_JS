const { test, expect } = require('@playwright/test');
const apiHelper = require('../helpers/apiHelper');

test.describe('Todos API Tests', () => {
  let todoId = 200; // Hardcoding todoId to simulate existing data since todos are limited

  test('GET /todos', async () => {
    const response = await apiHelper.getRequest('todos');
    console.log('GET All Todos Response:', response); // Debugging information
    expect(response).toBeInstanceOf(Array);
    expect(response.length).toBeGreaterThan(0);
    expect(response[0]).toHaveProperty('id');

    // Validate specific body content
    expect(response[0]).toMatchObject({
      userId: 1,
      id: 1,
      title: 'delectus aut autem',
      completed: false,
    });
  });

  test('GET /todos/1', async () => {
    const response = await apiHelper.getRequest('todos/1');
    console.log('GET Todo Response:', response); // Debugging information
    expect(response.id).toBe(1);

    // Validate specific body content
    expect(response).toMatchObject({
      userId: 1,
      id: 1,
      title: 'delectus aut autem',
      completed: false,
    });
  });

  test('POST /todos', async () => {
    const data = {
      title: 'foo',
      completed: false,
      userId: 1,
    };
    const response = await apiHelper.postRequest('todos', data);
    console.log('POST Response:', response); // Debugging information
    expect(response.title).toBe(data.title);
    expect(response.completed).toBe(data.completed);
    expect(response.userId).toBe(data.userId);
    todoId = response.id;
    console.log('Created Todo ID:', todoId);
  });

  test('PUT /todos/:id', async () => {
    console.log(todoId);
    if (todoId == null) throw new Error('todoId is not set');

    const data = {
      id: todoId,
      title: 'updated title',
      completed: true,
      userId: 1,
    };
    const response = await apiHelper.putRequest(`todos/${todoId}`, data);
    console.log('PUT Response:', response); // Debugging information
    expect(response.title).toBe(data.title);
    expect(response.completed).toBe(data.completed);
  });

  test('DELETE /todos/:id', async () => {
    if (todoId == null) throw new Error('todoId is not set');

    const response = await apiHelper.deleteRequest(`todos/${todoId}`);
    console.log('DELETE Response:', response); // Debugging information
    expect(response).toEqual({});
  });

  // Negative scenarios

  test('POST /todos with invalid data', async () => {
    const data = {
      title: '',
    };
    try {
      await apiHelper.postRequest('todos', data);
    } catch (error) {
      console.log('Error:', error); // Debugging information
      expect(error.message).toContain('HTTP error! Status: 400');
    }
  });

  test('PUT /todos/:id with invalid data', async () => {
    if (todoId == null) throw new Error('todoId is not set');

    const data = {
      id: todoId,
      title: '',
      completed: true,
      userId: 1,
    };
    try {
      await apiHelper.putRequest(`todos/${todoId}`, data);
    } catch (error) {
      console.log('Error:', error); // Debugging information
      expect(error.message).toContain('HTTP error! Status: 400');
    }
  });

  test('DELETE /todos/:id with non-existing ID', async () => {
    try {
      await apiHelper.deleteRequest('todos/999999');
    } catch (error) {
      console.log('Error:', error); // Debugging information
      expect(error.message).toContain('HTTP error! Status: 404');
    }
  });
});
