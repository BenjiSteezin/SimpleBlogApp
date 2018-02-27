var express= require ("express");
var methodOverride= require ("method-override");
var expressSanitizer= require("express-sanitizer");
var mongoose=require("mongoose");
var bodyparser= require("body-parser");
var app= express();

// App config
mongoose.connect("mongodb://localhost/restfulblogapp");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


//Mongoose Model
var blogSchema= new mongoose.Schema({
    
    title:String,
    image: String,
    body: String,
    created:{type:Date, default: Date.now}
});

//Mongoose Model object
var Blog= mongoose.model("Blog", blogSchema);

//RESTful Routes

app.get("/", function(req,res){
    
    res.redirect("/blogs");
});

//Index Route
app.get("/blogs", function(req,res){
    
    Blog.find({}, function(err,allblogs){
        
        if(err){
            console.log(err);
        } else{
            
            res.render("index",{blogs: allblogs});
        }
    });
    
});

//New Route

app.get("/blogs/new", function(req,res){
    
    res.render("new");
});

//Create New Route

app.post("/blogs", function(req,res){
    
    req.body.blog.body= req.sanitize(req.body.blog.body);
    //Create Blog
    Blog.create(req.body.blog, function(err,newBlog){
        
        if(err){
            res.render("new");
        }else{
            
             //Then redirect to index page
             res.redirect("/blogs");
        }
    });
});

app.get("/blogs/:id", function(req,res){
    Blog.findById(req.params.id, function(err,foundBlog){
        if(err){
          
          res.redirect("/blogs");
          
        } else{
           
            res.render("show", {blog:foundBlog}); 
       
        }
       
    });
});

//EDIT Route

app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
             res.render("edit",{blog: foundBlog});
        }
    });
});

//Update route

app.put("/blogs/:id", function(req, res){
    
    req.body.blog.body= req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updatedBlog){
        if(err){
            console.log(err);

        }else{
            res.redirect("/blogs/" + req.params.id );
        }
    });
 });
// Delete Blog
app.delete("/blogs/:id", function(req,res){
    //Destroy Blog
    Blog.findByIdAndRemove(req.params.id,function(err){
        
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    })
    
});
app.listen(process.env.PORT, process.env.IP, function(){
    
    console.log("Server is running");
})