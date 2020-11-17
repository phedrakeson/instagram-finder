const avaliableUsernames = [];

const profileImageElement = document.getElementById("profileImage");
const fullnameElement = document.getElementById("fullname");
const followersElement = document.getElementById("followers");
const followingElement = document.getElementById("following");
const descriptionElement = document.getElementById("description");

function addPosts(photos){
  photos.forEach(photo => {
    const { shortcode, display_url } = photo;

    let li = document.createElement("li")

    let a = document.createElement("a");
    a.href = `https://www.instagram.com/p/${shortcode}`;

    let img = document.createElement("img");
    img.src = display_url

    a.appendChild(img);

    li.appendChild(a);

    $(".posts").append(li);
  })
}

function setUserConfig(user){
  const { full_name, biography, profile_pic_url, edge_followed_by, edge_follow, photos } = user;

  profileImageElement.src = profile_pic_url;
  fullnameElement.textContent = full_name;
  followersElement.textContent = `Seguidores: ${edge_followed_by.count}`;
  followingElement.textContent = `Seguindo: ${edge_follow.count}`;
  descriptionElement.textContent = biography;

  addPosts(photos);
}

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
    if(user.error){
      return alert(user.error);
    }

    setUserConfig(user);
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