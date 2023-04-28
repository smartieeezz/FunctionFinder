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
        startDateError.remove();
        endDateError.remove();

        if(!location.value){
            valid = false;
            locationError.textContent = 'Error: must supply a location';
            searchForm.appendChild(locationError);
        }
        
        if(!startDate.value){
            valid = false;
            startDateError.textContent = 'Error: must supply a start date';
            searchForm.appendChild(startDateError);
        }

        if(!endDate.value){
            valid = false;
            endDateError.textContent = 'Error: must supply an end date';
            searchForm.appendChild(endDateError);
        }

        if(valid){
            searchForm.submit();
        }
    })
}