document.addEventListener('click', async function(event) {
    if (event.target.classList.contains('delete-task')) {
        const taskId = event.target.dataset.taskId;
        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
        if (taskElement) {
            event.preventDefault();
            const confirmed = confirm("Czy na pewno chcesz usunąć zadanie?");
            if (confirmed) {
                fetch(`/deleteTask/${taskId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => {
                        if (response.ok) {

                            window.location.reload();
                        } else {
                            console.error('Wystąpił błąd podczas usuwania zadania');
                        }
                    })

            }
        }
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const deleteAllButton = document.querySelector('.deletealltasks');
    if (deleteAllButton) {
        deleteAllButton.addEventListener('click', function(event) {
            event.preventDefault();
            const confirmed = confirm("Czy na pewno chcesz usunąć wszystkie zadania?");
            if (confirmed) {
                fetch(`/delete_all_tasks`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => {
                        if (response.ok) {

                            window.location.reload();
                        } else {
                            console.error('Wystąpił błąd podczas usuwania zadania');
                        }
                    });
            }
        });
    }
});



