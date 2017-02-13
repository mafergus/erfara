const PIXABAY_KEY = "4423887-ab96e540ffbe404d644032133";

export function getPhoto(searchTerm, onSuccess, onFailure) {
  fetch(`https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${searchTerm}&image_type=photo`).then(function(response) {
    if (response.ok) {
      return response.json();
    } else {
      Promise.reject(new Error(response.statusText));
    }
  }).then(function(json) {
    if (json && json.hits && json.hits.length > 0) {
      return fetch(json.hits[0].webformatURL);
    }
  }).then(function(response) {
    if (response.ok) {
      return response.blob();
    }
  }).then(function(blob) {
    return onSuccess(blob);
  }).catch(function(error) {
    return onFailure();
  });
}