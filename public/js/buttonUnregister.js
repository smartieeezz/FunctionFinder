const unregisterButton = document.getElementById("unregister-button");

unregisterButton.addEventListener("click", function() {
  const eventId = document.getElementById("unreg-event-id").textContent;
  const userId = document.getElementById("unreg-user-id").textContent;
  const action = document.getElementById("unreg-action").textContent;

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
      if (event.partyHost === userId) {
        alert("The host cannot unregister their own event here.");
        return;
      }
      if (!event.guestsAttending.includes(userId)) {
        alert("You have not registered for this event!");
      } else {
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
            alert("Event unregistered!");
          })
          .catch(error => console.error(error));
      }
    })
    .catch(error => console.error(error));
});
