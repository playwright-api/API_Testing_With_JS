const { request: playwrightRequest } = require('@playwright/test');
const config = require('../config/config');

class ApiHelper {
  constructor() {
    this.baseUrl = config.baseUrl;
    this.context = null;
  }

  async createRequestContext() {
    if (!this.context) {
      this.context = await playwrightRequest.newContext({
        baseURL: this.baseUrl,
        extraHTTPHeaders: {
          'Content-Type': 'application/json',
        },
      });
    }
    return this.context;
  }

  async getRequest(endpoint) {
    const context = await this.createRequestContext();
    const url = `${this.baseUrl}${endpoint}`;
    console.log(`GET Request URL: ${url}`);
    const response = await context.get(endpoint);
    this.handleResponseErrors(response);
    return await response.json();
  }

  async postRequest(endpoint, data) {
    const context = await this.createRequestContext();
    const url = `${this.baseUrl}${endpoint}`;
    console.log(`POST Request URL: ${url}, Data: ${JSON.stringify(data)}`);
    const response = await context.post(endpoint, { data });
    this.handleResponseErrors(response);
    return await response.json();
  }

  async putRequest(endpoint, data) {
    const context = await this.createRequestContext();
    const url = `${this.baseUrl}${endpoint}`;
    console.log(`PUT Request URL: ${url}, Data: ${JSON.stringify(data)}`);
    const response = await context.put(endpoint, { data });
    this.handleResponseErrors(response);
    return await response.json();
  }

  async deleteRequest(endpoint) {
    const context = await this.createRequestContext();
    const url = `${this.baseUrl}${endpoint}`;
    console.log(`DELETE Request URL: ${url}`);
    const response = await context.delete(endpoint);
    this.handleResponseErrors(response);
    return await response.json();
  }

  handleResponseErrors(response) {
    if (!response.ok()) {
      throw new Error(`HTTP error! Status: ${response.status()}`);
    }
  }
}

module.exports = new ApiHelper();
