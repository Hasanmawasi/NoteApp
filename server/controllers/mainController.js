
/**
GET 
HOME psge
 */
export let homepage = async (req,res)=>{
    const locals = {
        title: 'nodejs notes',
        description: "free nodejs app"
    }
  res.render("index",{
    locals,
    layout: '../views/layouts/front-layout'
  });


}

/**
GET 
About  psge
 */
export let aboutpage = async (req,res)=>{
    const locals = {
        title: 'About - nodejs notes',
        description: "free nodejs app"
    }
  res.render("about",locals);


}