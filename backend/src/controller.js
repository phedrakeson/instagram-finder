const request = require('request');

module.exports = {
  async searchQuery(req, res){
    const { query } = req.query;
    if(!query) 
      return res.json({ error: "You don't send ?query='context'" });

    const baseURL = `https://www.instagram.com/web/search/topsearch/?context=blended&query=${query}&rank_token=0.7077103498551982&include_reel=true`
    const response = await new Promise(resolve => request.get(baseURL, (error, response, body) => resolve(body)));
    const { users } = JSON.parse(response);
    res.send(users);
  },
  async findByUserName(req, res){
    const { username } = req.params;
  
    if(username.length < 4)
      return res.json({ error: "Nome de usuario pequeno demais" });
  
    const baseURL = `https://www.instagram.com/${username}/?__a=1`;
  
    try{
      const response = await new Promise(resolve => request.get(baseURL, (error, response, body) => resolve(body)));
      const resJSON = JSON.parse(response);
      if(Object.keys(resJSON).length == 0)
        return res.json({ error: "Usuario não encontrado" });
  
      const { user } = resJSON.graphql;
      if(!user)
        return res.json({ error: "Falha ao receber respostas do usuario" });
    
      const { full_name, biography, profile_pic_url, edge_followed_by, edge_follow, edge_owner_to_timeline_media } = user;
    
      const photos = edge_owner_to_timeline_media.edges.map(photo => {
        const { shortcode, display_url } = photo.node;
        return { shortcode, display_url }
      });
  
      return res.json({ full_name, biography, profile_pic_url, edge_followed_by, edge_follow, photos });
    }catch(err){
      return res.json({ error: err.message });
    }
  }
}