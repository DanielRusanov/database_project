const handleSave = async (id) => {
    await fetch('/api/saved-Review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id: id})
    })
  };
  
  
  const gamesView = (games) => `
  
  <div class="col-12">
      <div class="card">
          <h5 class="card-header"> ${games.title} <strong>(search match: ${games.score})</strong></h5>
          <div class="card-body">
           <p class="card-text">${games.description}</p>
            <ul class="list-group">
                 <li class="list-group-item">Name: ${games.Name}</li>
                  <li class="list-group-item">Country: ${games.country}</li>
                  <li class="list-group-item">Points: ${games.rating}</li>
                  <li class="list-group-item">Price: ${games.price}</li>
                  <li class="list-group-item">Develpoer: ${games.developer}</li>
                  <li class="list-group-item">Publisher: ${games.publisher}</li>
            </ul>
          </div>
          <a href="#" class="btn btn-primary" onclick="handleSave('${games._id}')">Save</a>
        </div>
   </div>
  `
  
  
  const handleSubmit = async () => {
      const searchVal = document.querySelector("#searchInput").value;
      try {
          const gamesDomRef = document.querySelector('#gamesItems');
          const ref = await fetch(`/api/search-review/?search=${searchVal}`);
          const searchResults = await ref.json();
          let gamesHtml = [];
          searchResults.forEach(games => {
             gamesHtml.push(gamesView(games));
          });
          gamesDomRef.innerHTML = gamesHtml.join(""); 
      } catch (e) {
          console.log(e);
          console.log('could not search api');
      }
    
  }