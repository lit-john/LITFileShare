var express = require('express');
var fs = require('fs');
var router = express.Router();

// Temporary global variable
console.log("Creating the files array");
var files = new Array();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/uploadFile', function(req, res, next) {
   res.render('fileUpload'); 
});

router.post('/uploadFile', function(req, res, next) {
   // A file has been uploaded
   console.log(req.files[0].filename);
   
   req.files[0]._id = Date.now();
   
   console.log(req.files[0]);
   
   files.push(req.files[0]);
   
    res.redirect('/files');
});

router.get('/files', function(req, res, next) {
    res.render('test', {theFiles: files});
});

router.get('/deleteFile/:fileID', function(req, res, next) {
    console.log("Just been asked to delete " + req.params.fileID);
    
    for (var i = 0; i < files.length; i++) {
        if (files[i]._id == req.params.fileID) {
            // We have got a match
            fs.unlink('./uploads/' + files[i].filename, function (error) {
               // do nothing 
            });
            
            files.splice(i,1);
            break;
        }
    }
    
    res.redirect('/files');
});

module.exports = router;
