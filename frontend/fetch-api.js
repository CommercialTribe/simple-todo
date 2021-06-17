export default class FetchApi {
  static get(path) {
    return fetch(path, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }).then((response) => response.json());
  }

  static delete(path) {
    return fetch(path, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  static post(path, body) {
    return fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then((response) => response.json());
  }

  static put(path, body) {
    return fetch(path, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then((response) => {
      return response.json();
    });
  }
}
