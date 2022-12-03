const express = require('express')
const bodyparser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended : true}))
app.use(express.static("public"));
mongoose.connect("mongodb://0.0.0.0:27017/WikiDB")

const schema = {
    title : String,
    content : String
}

const Article = mongoose.model("Article", schema);

app.route("/article").get(function(req, res) {
    Article.find(function(err, data) {
        res.send(data);
    })
})

.post(function(req, res) {
    const data = new Article({
        title : req.body.title,
        content : req.body.content
    })
    data.save(function(err) {
        if(err) res.send("error")
    })
})

.delete(function(req, res) {
    Article.deleteMany(function(err) {
        if(!err) {
            console.log("deleted")
        }
    })
});

//////////////////////////////////////// Specific Request /////////////////////////////////////


app.route("/article/:articleTitle")

.get(function(req, res) {
    Article.findOne({title : req.params.articleTitle}, function(err, data) {
        if(data) {
            res.send(data);
        } 
        res.send({
           err : "not fount"
        })
    })
})

.patch(function(req, res) {
    Article.updateMany(
        {title : req.params.articleTitle}, 
        {$set : req.body},
        function(err) {
            if(err) {
                res.send("oops")
            } 
            res.send("Patched")
        }
    )
})


.put(function(req, res) {
    console.log(req.body)
    Article.updateMany(
        {title : req.params.articleTitle}, 
        {title : req.body.title , content : req.body.contenet},
        function(err) {
            if(err) {
                res.send("Something is wrong")
            } 
            else {
                res.send("Put call success")
            }
        }
    )
})

.delete(function(req, res) {
    Article.deleteOne(
        {title : req.params.articleTitle},
        function(err) {
            if(err) {
                res.send("Data Not Founc")
            } else {
                res.send("Data Found and Successfully deleted")
            }
        }
    )
})

.post(function(req, res) {
    const data = new Article({
        title : req.body.title, 
        content : req.body.content
    })
    data.save(function(err) {
        if(err) {
            res.send("oops")
        } res.send("Done")
    })

})


app.listen(3000);