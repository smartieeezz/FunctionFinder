const cancelButtons = document.querySelectorAll('#cancel-button');

cancelButtons.forEach((button) => {
  button.addEventListener('click', async (event) => {
    event.preventDefault();
    const eventId = document.getElementById('cancel-event-id').textContent;

    try {
      const response = await fetch('/cancelanevent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ eventId })
      });

      const data = await response.json();
      
      // Reload the page
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  });
});
