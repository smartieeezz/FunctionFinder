function registerFavoriteButtonHandler() {
  console.log("registerFavoriteButtonHandler called");
  const buttons = document.querySelectorAll('.favorite-button');
  buttons.forEach(button => {
    button.addEventListener('click', function() {
      if (button.classList.contains('unselected')) {
        button.classList.remove('unselected');
        button.classList.add('selected');
        button.textContent = 'Unfavorite';
      } else {
        button.classList.remove('selected');
        button.classList.add('unselected');
        button.style.backgroundColor = "";
        button.textContent = 'Favorite';
      }
    });
  });
}

registerFavoriteButtonHandler();