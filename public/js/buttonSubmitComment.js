const form = document.querySelector('form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const comment = event.target.elements.comment.value;
    const formData = new FormData(event.target);
    const eventId = formData.get('comm-event-id');
    const userId = formData.get('comm-user-id');

    try {
      const response = await fetch(`/events/${eventId}/comments?userId=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, userId, comment }),
      });
      if (!response.ok) throw new Error('Could not add comment');
      location.reload(); // reload the page
    } catch (error) {
      console.error(error);
    }
});