const favoriteButton = document.getElementById("favorite-button");

favoriteButton.addEventListener("click", function() {
  const eventId = this.getAttribute("fav-event-id");
  const userId = this.getAttribute("fav-user-id");
  const action = this.getAttribute("fav-action");

  if (!userId) {
      window.location.href = "/account/login";
    return;
  }

  if (action !== "favorite") {
    return;
  }

  fetch(`/users/${userId}`)
    .then(response => response.json())
    .then(user => {
      if (user.favoritedEvents.includes(eventId)) {
        alert("You already favorited this event.");
      } 
      else {
        user.favoritedEvents.push(eventId);
        const options = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(user)
        };
        fetch(`/events/${eventId}?userId=${userId}&action=${action}`, options)
          .then(response => response.json())
          .then(updatedEvent => {
            alert("Event favorited.");
          })
          .catch(error => console.error(error));
      }
    })
    .catch(error => console.error(error));
});