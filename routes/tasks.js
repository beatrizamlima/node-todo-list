const MongoClient = require('mongodb').MongoClient
ObjectId = require('mongodb').ObjectId
var mongo = require('mongodb');
BSON = mongo.BSONPure;

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
}

exports.addTask = function(req, res) {
    var task = req.body
    db.collection('tasks', function(err, collection) {
        collection.insert(task, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'})
            } else {
                console.log('Saved on database')
                res.redirect('/')
            }
        })
    })
}

exports.findByTask = function(req, res) {
    var task = req.params.task
    var description
    console.log('Retrieving task: ' + task)
    db.collection('tasks', function(err, collection) {
        collection.findOne({'task':task}, function(err, result) {
            res.render('task.hbs', {task: result.task, description: result.description})
        })
    })
}

exports.deleteTask = function(req, res) {
    var task = req.params.task
    console.log('Deleting task: ' + task)
    db.collection('tasks', function(err, collection) {
        collection.remove({'task':task}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err})
            } else {
                res.redirect('/tasks')
            }
        })
    })
}

exports.updateTask = function(req, res) {
    var task = req.body
    var newtask = task.newtask
    var oldtask = task.task
    var description = task.description

    db.collection('tasks', function(err, collection) {
        collection.update({'task':oldtask}, {'task':newtask, 'description':description}, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating task: ' + err)
                res.send({'error':'An error has occurred'})
            } else {
                res.redirect('/tasks')
            }
        })
    })
}