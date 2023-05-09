const deleteButton = document.getElementById('delete-button');

deleteButton.addEventListener('click', async (event) => {
  event.preventDefault();
  const eventId = document.getElementById('del-event-id').textContent;
  const userId = document.getElementById('del-user-id').textContent;

  try {
    const response = await fetch(`/events/${eventId}/comments?userId=${userId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Could not delete comment');
    location.reload(); // reload the page
  } catch (error) {
    console.error(error);
  }
});
