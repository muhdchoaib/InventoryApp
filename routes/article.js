exports.show=function(req, res, next){
/*Object.keys(req).forEach(function(prop){
   console.log(prop +" : "+req[prop]);
});*/
   console.log("req.params: "+req.params);
   if(!req.params.slug) return next(new Error('No article slug.'));
   req.collections.articles.findOne({slug: req.params.slug}, function(err, doc){
      if(err) return next(err);
      if(!doc.expiration) return res.send(501);
      res.render('article', doc);
   });
}

exports.post=function(req, res, next){
   res.render('post');
}

exports.admin=function(req, res, next){
   if(!req.collections) return next(new Error('collections not found'));

   req.collections.articles.find({}, {sort:{"expiration":-1}}).toArray(function(err, docs){
    if(err) return next(err);	
     res.render('admin', {articles: docs});
})
}

exports.insert=function(req, res, next){
 if(!req.body.title||!req.body.slug||!req.body.expiration){
	return res.render('post', {error: "All fields are required"});}
 if(!req.collections) return next(new Error('collections not found'));
 var article={
   title:req.body.title,
   slug:req.body.slug,
   expiration:req.body.expiration
 }
 req.collections.articles.insert(article, function(err, response){
   if(err) return next(err);
   res.render('post', {error: "article is added"});
 })
}

exports.list=function(req, res, next){
if(!req.collections) return next(new Error('collections not found'));

   req.collections.articles.find({}, {sort:{"expiration":-1}}).toArray(function(err, docs){
    if(err) return next(err);
     res.send({articles: docs});
})
}

exports.add=function(req, res, next){
if(!req.body.article) return next(new Error("no payload")); 
if(!req.collections) return next(new Error('collections not found'));
 req.collections.articles.insert(article, function(err, response){
   if(err) return next(err);
   res.send(response);
 })

}

exports.edit=function(req, res, next){
 if(!req.params.id) return next(new Error("id is not preset"));
 if(!req.collections) return next(new Error('collections not found'));
 req.collections.articles.updateById(req.params.id, {$set: req.body.article}, function(err, count){
 if(err) return next(err); 
 res.send({affectedCount: count});
 });
}

exports.del=function(req, res, next){

if(!req.params.id) return next(new Error("id is not preset"));
 if(!req.collections) return next(new Error('collections not found'));
 req.collections.articles.removeById(req.params.id, function(err, count){
 if(err) return next(err);
 res.send({affectedCount: count});
 });}
