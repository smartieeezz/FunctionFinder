let searchForm = document.getElementById('searchForm');

if(searchForm){
    let location = document.getElementById('location');
    let distance = document.getElementById('distance');
    let startDate = document.getElementById('startDate');
    let endDate = document.getElementById('endDate');

    let locationError = document.createElement('div');
    let distanceError = document.createElement('div');
    let startDateError = document.createElement('div');
    let endDateError = document.createElement('div');
    
    let valid = true;

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        locationError.remove();
        distanceError.remove();
        startDateError.remove();
        endDateError.remove();

        
    })
}