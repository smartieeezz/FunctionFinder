

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
    console.log(functions)
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
          console.log("here1")
        let requestConfig = {
            url: "/searchresults/getfunctions",
            type: "POST",
            data: searchParams}
          
          
            console.log("here2")
            $.ajax(requestConfig)
            .then(async function(response) {
                serverResponse = response;
                console.log(serverResponse);
        
                // Wait for the second Ajax request to finish before continuing
                let requestConfig2 = {
                    method: 'GET',
                    url: '/searchresults'
                };   
                await $.ajax(requestConfig2);
        
                divContents.innerHTML = "";
                for (const element of serverResponse){
                    divContents.innerHTML += `
                        <script>
                            window.everything.push({position: { lat: parseFloat('${element.latitude}'), lng: parseFloat('${element.longitude}')}, map: window.map, title: '${element.name}'})
                        </script>
                        <div id="${element.newIdString}" class="card" onclick="window.location.href='/events/${element.newIdString}/info'">
                            <h2>${element.name}</h2>
                            <p>${element.partyVenue}</p>
                            <img id="cover" src="${element.partyCoverPhoto}" class="coverPic" />
                        </div>
                    `;
                }
            })
            .catch(function(error) {
                console.log("An error occurred: " + error);
            });
        

    })

  });
  


    
      


