import Notes from "../models/Notes.js";
import mongoose from "mongoose";



export let dashboardpage = async (req, res) => {
  let perPage = 12;
  let page = req.query.page || 1;
  const locals = {
    title: "Dashbord",
    description: "Free nodejs Notes App",
  };


  try {
    // Ensure that req.user._conditions._id contains a valid ObjectId string
    const userId = req.user._conditions._id._id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }

    const perPage = 10; // Replace with your actual perPage value
    const page = req.query.page || 1; // Default to page 1 if not specified

    const notes = await Notes.aggregate([
      {
        $match: { user: new mongoose.Types.ObjectId(userId) },
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
      {
        $project: {
          title: { $substr: ["$title", 0, 30] },
          body: { $substr: ["$body", 0, 100] }, // Changed "$title" to "$body"
        },
      },
    ])
      .skip(perPage * page - perPage)
      .limit(perPage);

    const count = await Notes.countDocuments({ user: new mongoose.Types.ObjectId(userId) });

    res.render("dashbord/index", {
      username: req.user._conditions._id.firstName,
      notes: notes,
      layout: "./layouts/dashbord",
      current: page,
      pages: Math.ceil(count / perPage),
    });
  } catch (error) {
    console.error(error);
    next(error); // Pass the error to Express error handler
  }
};

// * GEt View specific note
 
export const dashboardViewNote = async (req,res)=>{
  const note = await Notes.findById({_id: req.params.id})
                          .where({user: req.user._conditions._id})
                          .lean();
  if(note){
    res.render('dashbord/view-notes',{
      noteID: req.params.id,
      note,
      layout: 'layouts/dashbord'
    })
  }else{
    res.send("something went wrong !!");
  }


}

export const dashboardUpdateNote = async (req,res)=>{

  try{

    await Notes.findOneAndUpdate(
      {_id : req.params.id},
      {title: req.body.title, body: req.body.body , updatedAt: Date.now()}
    ).where({user: req.user._conditions._id});

    res.redirect('/dashbord')
  }catch(err){
    console.log(err)
}

}

//  delte note route 

export const dashboardDeleteNote = async (req,res)=>{
  try {
    await Notes.deleteOne({_id : req.params.id}).where({user: req.user._conditions._id});
    res.redirect('/dashbord')
  } catch (error) {
    console.log(error)
  }
}
//   get add notes
export const dashboardAdd = async (req,res)=>{
  res.render('dashbord/add',{
    layout: 'layouts/dashbord'
  })

}


//  post notees

export const dashboardAddSubmit = async (req,res)=>{
  try {
      req.body.user = req.user._conditions._id;
      await Notes.create(req.body)
      res.redirect('/dashbord')
  } catch (error) {
    console.log(error)
  }

}

//  GET SEARCH

export const dashboardsearch  = async (req,res)=>{
  
  try{
    res.render('dashbord/search',{
      serchResults: '',
      layout: 'layouts/dashbord'
    })
  }catch(error){
    console.log(error)
  }
  
}

// post SEARCH

export const dashboardsearchSubmit = async (req,res)=>{
  
  try{
    let searchTerm = req.body.searchTerm;
    let searchNoSpecialChars = searchTerm.replace(/[^a-xA-Z0-9 ]/g, "");

    let searchResults = await Notes.find({
      $or: [
        {title: {$regex: new RegExp(searchNoSpecialChars,'i')}},
        {body: {$regex: new RegExp(searchNoSpecialChars,'i')}}
      ]
    }).where({user: req.user._conditions._id});

    res.render('dashbord/search',{
      searchResults,
      layout: 'layouts/dashbord'
    })



  }catch(error){
    console.log(error)
  }
  
}