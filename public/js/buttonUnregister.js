const unregisterButton = document.getElementById("unregister-button");

unregisterButton.addEventListener("click", function() {
  const eventId = this.getAttribute("unreg-event-id");
  const userId = this.getAttribute("unreg-user-id");
  const action = this.getAttribute("unreg-action");

  if (!userId) {
      window.location.href = "/account/login";
    return;
  }

  if (action !== "unregister") {
    return;
  }

  fetch(`/events/${eventId}`)
    .then(response => response.json())
    .then(event => {
      if (!event.guestsAttending.includes(userId)) {
        alert("You have not registered for this event.");
      }  
      else {
        const updatedGuestsAttending = event.guestsAttending.filter(guestId => guestId !== userId);
        const options = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ guestsAttending: updatedGuestsAttending })
        };
        fetch(`/events/${eventId}?userId=${userId}&action=${action}`, options)
          .then(response => response.json())
          .then(updatedEvent => {
            alert("Event unregistered.");
          })
          .catch(error => console.error(error));
      }
    })
    .catch(error => console.error(error));
});
