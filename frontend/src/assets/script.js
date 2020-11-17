const avaliableUsernames = [];

function sleep(seconds){
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

async function refresh(secondsToWait=0){
  await sleep(secondsToWait);
  $("#username").autocomplete({
    source: function(request, response) {
      var results = $.ui.autocomplete.filter(avaliableUsernames, request.term);

      response(results.slice(0, 5));
    }
  });
}

(async function(){
  const querySearch = document.getElementById("username");
  const form = document.getElementsByTagName("form")[0];
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const { value } = querySearch;
    if(!value) return;

    const user = (await axios.get(`http://localhost:3333/instagram/${value}`)).data;
  
    console.log(user);
  })

  querySearch.addEventListener('keypress', async (event) => {
    refresh();
    const { value } = querySearch;
    if(!value) return;

    const accounts = (await axios.get(`http://localhost:3333/instagram?query=${value}`)).data
    if(accounts.length == 0) return querySearch.style.color = "red";

    for(var i=0; i<accounts.length; i++){
      let { username } = accounts[i].user;
      avaliableUsernames.find(name => name === username) ? false : avaliableUsernames.push(username);
    }

    querySearch.style.color = "#000";

    refresh(1);
  })  
})()