unregisterButton.addEventListener("click", function() {
    const eventId = this.getAttribute("delete-event-id");
    const userId = this.getAttribute("delete-user-id");
    const action = this.getAttribute("delete-action");

    if (!userId) {
        window.location.href = "/account/login";
        return;
      }
    
      if (action !== "delete") {
        return;
      }
      fetch(`/events/${eventId}`)
    .then(response => response.json())
    .then(event => {
      if (event.partyHost === userId) {
        alert("This will delete the event for everyone.");
        return;
      }
})

})