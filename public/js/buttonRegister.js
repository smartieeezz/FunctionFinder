const registerButton = document.getElementById('register-button');

registerButton.addEventListener("click", function() {
  const eventId = this.getAttribute("reg-event-id");
  const userId = this.getAttribute("reg-user-id");
  const action = this.getAttribute("reg-action");

  if (!userId) {
      window.location.href = "/account/login";
    return;
  }

  if (action !== "register") {
    return;
  }

  fetch(`/events/${eventId}`)
    .then(response => response.json())
    .then(event => {
      if (event.guestsAttending.includes(userId)) {
        alert("You already registered for this event!");
      }  
      else {
        event.guestsAttending.push(userId);
        const options = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(event)
        };
        fetch(`/events/${eventId}?userId=${userId}&action=${action}`, options)
          .then(response => response.json())
          .then(updatedEvent => {
            alert("Registration successful!");
          })
          .catch(error => console.error(error));
      }
    })
    .catch(error => console.error(error));
});