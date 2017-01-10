const MongoClient = require('mongodb').MongoClient
var db

MongoClient.connect('mongodb://root:123@ds159978.mlab.com:59978/tasksdb', (err, database) => {
  if (err) return console.log(err)
  db = database
})

exports.findAll = function(req, res) {
  db.collection('tasks').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('tasks.hbs', {tasks: result})
  })
};

exports.addTask = function(req, res) {
    var task = req.body;
    console.log('Adding task: ' + JSON.stringify(task));
    db.collection('tasks', function(err, collection) {
        collection.insert(task, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.redirect('/')
            }
        });
    });
}

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving task: ' + id);
    db.collection('tasks', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.updateWine = function(req, res) {
    var id = req.params.id;
    var wine = req.body;
    console.log('Updating task: ' + id);
    console.log(JSON.stringify(wine));
    db.collection('tasks', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, wine, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating task: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(wine);
            }
        });
    });
}

exports.deleteWine = function(req, res) {
    var id = req.params.id;
    console.log('Deleting task: ' + id);
    db.collection('tasks', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}