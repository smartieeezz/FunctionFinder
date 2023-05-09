

let divContents
let individual
let serverResponse 
let functions = []
document.addEventListener('DOMContentLoaded', () => {
    divContents = document.getElementById('card-container')
    individual = divContents.children
    for (let i = 0; i < individual.length; i++) {
        functions.push(individual[i].getAttribute('id'))
    }
    filterForm.addEventListener("submit", async (event) => {
        event.preventDefault()
        const age = Array.from(document.querySelectorAll('input[name="age"]:checked')).map(el => el.value);
        const genres = Array.from(document.querySelectorAll('input[name="genres"]:checked')).map(el => el.value);
        const price = Array.from(document.querySelectorAll('input[name="price"]:checked')).map(el => el.value)
        const types = Array.from(document.querySelectorAll('input[name="types"]:checked')).map(el => el.value)
        
        const searchParams = {
            f:functions, 
            genres: genres,
            ages: age,
            prices: price,
            types: types
          };

        let requestConfig = {
            url: "/searchresults/getfunctions",
            type: "POST",
            data: searchParams}
          
          
        $.ajax(requestConfig)
        .then(function(response) {
            serverResponse = response
        })
        .catch(function(error) {
            console.log("An error occurred: " + error);
        });


        let requestConfig2 = {
            method: 'GET',
            url: '/searchresults'
        };   
        $.ajax(requestConfig2)
        .then(function(response) {
            console.log(response)
            divContents.innerHTML = ""
            serverResponse.forEach(element => {
                divContents.innerHTML += `<div id="${element.newIdString}" class="card" onclick="window.location.href='/events/${element.newIdString}/info'">
                                      <h2>${element.name}</h2>
                                      <p>${element.partyVenue}</p>
                                  </div>`
            });
        })
        .catch(function(error) {
            console.log("An error occurred: " + error);
        });

    })

  });
  


    
      


