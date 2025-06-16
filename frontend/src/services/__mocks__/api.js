// frontend/src/services/__mocks__/api.js
// This file mocks src/services/api.js

const mockAxiosInstance = {
  get: jest.fn(() => Promise.resolve({ data: [] })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),

  defaults: {
    headers: {
      common: {},
    },
  },
};


export default mockAxiosInstance;