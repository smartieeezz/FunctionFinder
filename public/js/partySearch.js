
// function renderCards(parties) {
//     const cardContainer = document.getElementById('card-container');

//     for (const party of parties) {
//         const card = document.createElement('div');
//         card.classList.add('card');
    
//         const functionName = document.createElement('h3');
//         functionName.textContent = party.functionName;
    
//         const functionVenue = document.createElement('p');
//         functionVenue.textContent = party.functionVenue;

//         card.appendChild(functionName);
//         card.appendChild(functionVenue);
//         cardContainer.appendChild(card);
//     }
//     }
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

        const start = new Date(startDate.value);
        start.setHours(start.getHours() + 4);
        const end = new Date(endDate.value); 
        end.setHours(end.getHours() + 4);
        const tempdate = new Date();
        const date = new Date(tempdate.getFullYear(), tempdate.getMonth(), tempdate.getDate());
          
        if(date > start){
            valid = false;
            startDateError.textContent = 'Error: startDate must be either today or in the future';
            startDateError.textContent = `${date}    ${start}     ${end}`;
            searchForm.appendChild(startDateError);
        }
            
        if(date > end){
            valid = false;
            endDateError.textContent = 'Error: endDate must be either today or in the future';
            searchForm.appendChild(endDateError);
        }

        if(end < start){
            valid = false;
            endDateError.textContent = 'Error: endDate must be after startDate';
            searchForm.appendChild(endDateError);
        }
          
        if(valid){
            searchForm.submit();
        }
    })
}