// api.js

export default class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  // Handle server responses with robust error handling
  _checkResponse(res) {
   return res.ok? res.json():Promise.reject(res.status)
  }

  // Unified request method
  _request(endpoint, options) {
    return fetch(`${this._baseUrl}${endpoint}`, {
      headers: this._headers,
      ...options,
    }).then(this._checkResponse);
  }

  // === USER ROUTES ===

  // Get current user info
  getUserInfo() {
    return this._request('/users/me', { method: 'GET' });
  }

  // Update user profile
  updateUserInfo({ name, about }) {
    return this._request('/users/me', {
      method: 'PATCH',
      body: JSON.stringify({ name, about }),
      headers: {
        ...this._headers,
        'Content-Type': 'application/json'
      }
    });
  }

  // Update user avatar
  updateUserAvatar({ avatar }) {
    return this._request('/users/me/avatar', {
      method: 'PATCH',
      body: JSON.stringify({ avatar }),
      headers: {
        ...this._headers,
        'Content-Type': 'application/json'
      }
    });
  }

  // === CARD ROUTES ===

  // Get all cards
  getCards() {
    return this._request('/cards', { method: 'GET' });
  }

  // Create a new card
  createCard({ name, link }) {
    return this._request('/cards', {
      method: 'POST',
      body: JSON.stringify({ name, link }),
      headers: {
        ...this._headers,
        'Content-Type': 'application/json'
      }
    });
  }

  // Delete a card
  deleteCard(cardId) {
    return this._request(`/cards/${cardId}`, {
      method: 'DELETE'
    });
  }

  // Like a card
  likeCard(cardId) {
    return this._request(`/cards/${cardId}/likes`, {
      method: 'PUT'
    });
  }

  // Unlike (dislike) a card
  dislikeCard(cardId) {
    return this._request(`/cards/${cardId}/likes`, {
      method: 'DELETE'
    });
  }

  // === COMBINED DATA ===

  // Get both user info and cards in parallel
  getAppData() {
    return Promise.all([
      this.getUserInfo(),
      this.getCards()
    ]);
  }
}