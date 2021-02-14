var express = require('express');
var fs = require('fs');
var path = require('path');
var sidebar = require('../helpers/sidebar');
var Models = require('../models');
var md5 = require('MD5');  //MD5 IS A PROFILE-PICTURE-BASED-ON-EMAIL SERVICE

module.exports = {
    index: function(req, res){
        //DECLARE OUR EMPTY viewModel VARIABLE OBJECT
        var viewModel = {
            image: {},
            comments: []
        };

        //FIND THE IMAGE BY SEARCHING THE FILENAME MATCHING THE URL PARAMETER
        Models.Image.findOne(
            {filename: {$regex: req.params.image_id}},
            function(err, image){
                if(err){
                    throw err
                }
                if(image){
                    //IF THE IMAGE WAS FOUND, INCREMENT THE IMAGE'S VIEWS COUNTER
                    image.views++;
                    viewModel.image = image; //SAVE THE IMAGE OBJECT TO THE viewModel
                    image.save();  //SAVE THE MODEL SINCE IT HAS BEEN UPDATED
                    Models.Comment.find(             //FIND ALL COMMENTS WITH SAME image_id AS THE IMAGE
                        {image_id: image._id}, {}, {sort: {'timestamp': 1}},
                        function(err, comments){
                            if(err){throw err}

                            viewModel.comments = comments;  //SAVE THE COMMENTS COLLECTION TO THE viewModel
                            sidebar(viewModel, function(viewModel){   //EXTERNAL STUFF:-  A SIDEBAR NEEDS TO BE BUILT
                                res.render('image', viewModel);    //RENDER THE PAGE VIEW WITH ITS viewModel
                            });
                        }
                    );
                }else{
                    res.redirect('/');  //IF NO IMAGE WAS FOUND, SIMPLY GO BACK TO THE HOMEPAGE 
                }
            }
        );
    },
    create: function(req, res){
        var saveImage = function(){
            var possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
            var imgUrl = '';

            for(let i=0; i<6; i+=1){
                imgUrl += possible.charAt(Math.floor(Math.random()*possible.length));
            }

            Models.Image.find({filename: imgUrl}, function(err, images){ //CHECKING IF THE IMAGE ALREADY EXISTS
                if(images.length > 0){
                    saveImage(); //IT EXISTS!!!   THEN REITERATE, THUS GENERATING ANOTHER RANDOM imgUrl
                }else{//IT DOESN'T ALREADY EXIST, THEN PROCEED TO SAVE IT TO DATABASE
                    var tempPath = req.file.path;
                    var ext = path.extname(req.file.originalname).toLowerCase();
                    var targetPath = path.resolve('./public/upload/' + imgUrl + ext);
        
                    if(ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif'){
                        fs.rename(tempPath, targetPath, function(err){
                            if(err){
                                throw err;
                            }
                            var newImg = new Models.Image({   //CREATING A NEW RECORD/DOCUMENT FASHIONED AFTER THE PRE-DEFINED SCHEMA IN '/models/image.js'
                                title: req.body.title,
                                description: req.body.description,
                                filename: imgUrl + ext
                            });
                            newImg.save(function(err, image){
                                if(err){throw err}
                                console.log('Successfully inserted image:' + image.filename);
                                res.redirect('/images/' + image.uniqueId)  //RECALL THAT 'uniqueId' is a virtual property in the schema for Image model
                            })
                        });
                    }else{
                        fs.unlink(tempPath, function(){
                            if(err){
                                throw err;
                            }
                            res.json(500, {error: 'Only image files are allowed.'});
                        });
                    }
                }
            })
        };
        saveImage();
    },
    like: function(req, res){
        //THE req OBJECT HOLDS THE IMAGE ID ON: req.params.image_id. USE THIS UNIQUE VALUE TO SEARCH THE DATABASE
        Models.Image.findOne(
            {filename: {$regex: req.params.image_id}},
            function(err, image){
                if(!err && image){
                    image.likes++ ;
                    image.save(function(err){ //SAVE THE UPDATE TO THE DATABASE
                        if(err){
                            res.json(err);
                        }else{
                            res.json({likes: image.likes});
                        }
                    });
                }
            }
        );
    },
    comment: function(req, res){
        Models.Image.findOne(
            {filename: {$regex: req.params.image_id}},
            function(err, image){
                if(!err && image){
                    var newComment = new Models.Comment({
                        name: req.body.name,
                        email: req.body.email,
                        comment: req.body.comment,
                        gravatar: md5(req.body.email),
                        image_id: image._id,
                    });
                    newComment.save(function(err, comment){
                        if(err){
                            throw err;
                        }
                        res.redirect('/images/' + image.uniqueId + '#' + comment._id);
                    });
                }else{
                    res.redirect('/');
                }
            }
        )
    },
    remove: function(req, res){
        Models.Image.findOne(
            {filename: {$regex: req.params.image_id}},
            function(err, image){
                if(err){
                    throw err;
                }
                fs.unlink(  //UNLINK REMOVES A FILE FROM THE FILE SYSTEM, GIVEN THE FILE PATH AS FIRST PARAM
                    path.resolve('./public/upload/' + image.filename),
                    function(err){
                        if(err){
                            throw err;
                        }
                        Models.Comment.remove(  //REMOVING THE COMMENT ASSOCIATED WITH THE IMAGE
                            {image_id: image._id},
                            function(err){
                               image.remove(  //CALLING REMOVE() ON A MONGO DB DOCUMENT (TO DELETE IT) JUST LIKE YOU WOULD CALL SAVE() ON SUCH AN OBJECT, TO SAVE IT TO THE DATABASE
                                   function(err){
                                       if(!err){
                                           res.json(true)
                                       }else{
                                           res.json(false)
                                       }
                                   }
                               );
                            }
                        );
                    }
                );
            }
        );
    }
}