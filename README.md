# Mongoosejs Soft Delete Plugin
[![Build Status](https://travis-ci.com/passionInfinite/mongoosejs-soft-delete.svg?branch=master)](https://travis-ci.com/passionInfinite/mongoosejs-soft-delete)
[![GitHub license](https://img.shields.io/github/license/passionInfinite/mongoosejs-soft-delete.svg)](https://github.com/passionInfinite/mongoosejs-soft-delete/blob/master/LICENSE)

A lightweight plugin that enables the soft delete functionality for documents in MongoDB.
This code is based on [mongoose-delete](https://github.com/dsanel/mongoose-delete).

### Usage Guidelines

* [Basic Usage](https://github.com/passionInfinite/mongoosejs-soft-delete#basic-usage)
* [Advance Usage](https://github.com/passionInfinite/mongoosejs-soft-delete#advance-usage)

### How it Works
    
* [Functions performing with Mongoose](https://github.com/passionInfinite/mongoosejs-soft-delete#how-it-works)

### Functions Support

* [Find and update functions](https://github.com/passionInfinite/mongoosejs-soft-delete#functions-available)
* [Hard and soft delete functions](https://github.com/passionInfinite/mongoosejs-soft-delete)

### Handling Hooks

* [removeMany and removeOne hooks](https://github.com/passionInfinite/mongoosejs-soft-delete#hooks)

# Installation
Install using [npm](https://www.npmjs.com/package/mongoosejs-soft-delete)

```npm install mongoosejs-soft-delete```

# Usage
You can use this plugin with or without passing the options to the plugin.

### Basic Usage

```js
let softDelete = require('mongoosejs-soft-delete');
let SampleSchema = new mongoose.Schema({
    comment: String
})
SampleSchema.plugin(softDelete) //Without passing any parameters.

let Sample = mongoose.model('Sample', SampleSchema);
let document = new Sample({
    comment: "This plugin is awesome."
});
   
let sampleId = mongoose.Types.ObjectId("507f1f77bcf86cd799439011");

//This will do soft delete for one document.
Sample.removeOne({ _id: sampleId }, function (err, res) {});
Sample.findByIdDeleted(sampleId, function(err, doc) {
    //doc.deletedAt will be current timestamp
    //doc.deleted will be true
})

//This will do soft delete for multiple document.
Sample.removeMany({ _id: sampleId }, function (err, res) {});

// If you want to perform hard delete.
//For deleting one document.
Sample.deleteOne({ _id: sampleId }, callback);

//For deleting multiple documents.
Sample.deleteMany(conditions, callback);

```

By default, basic usage will set the `deleted` and `deletedAt` field.
The type of `deleted` field will be `Boolean` whereas `deletedAt` will have the current timestamp.

### Advance Usage

If you want to change the default behaviour of the plugin. For example, instead
of deletedAt you want to have custom field and the value of that custom field should be
a custom function then you can use this second option.

```js
let softDelete = require('mongoosejs-soft-delete');
let SampleSchema = new mongoose.Schema({
    comment: String
})

//To define our on custom field pass two params: index and define that index.

function getCustom() {
    return true;
}

SampleSchema.plugin(softDelete, { index: 'custom', custom: getCustom()) 

let Sample = mongoose.model('Sample', SampleSchema);
let document = new Sample({
    comment: "This plugin is awesome."
});
   
let sampleId = mongoose.Types.ObjectId("507f1f77bcf86cd799439011");

//This will do soft delete for one document.
Sample.removeOne({ _id: sampleId }, function (err, res) {});
Sample.findByIdDeleted(sampleId, function(err, doc) {
    //doc.custom will be true
    //doc.deleted will be true
})

//This will do soft delete for multiple document.
Sample.removeMany({ _id: sampleId }, function (err, res) {});

// If you want to perform hard delete.
//For deleting one document.
Sample.deleteOne({ _id: sampleId }, callback);

//For deleting multiple documents.
Sample.deleteMany(conditions, callback);

``` 

**If you are passing your own custom function make sure it 
has some return type. Any return type except the `function`.**

Also you can directly assign certain value the index field value.

```
    SampleSchema.plugin(softDelete, { index: 'custom', custom: true });
```
# How it works

**We haven't override the mongoose deleteOne and deleteMany function
so it will perform hard delete (not soft delete).**

Below table shows the functions that will do soft delete.

| Mongoose Function |  Under Hood Performs |
|:-----------------:|:--------------------:|
|     findById      |    findOne           |
|     findOneAndRemove | findOneAndUpdate  |
|    findOneAndDelete | findOneAndUpdate   |
|    findByIdAndRemove | findByIdAndUpdate |
|    findByIdAndDelete| findByIdAndUpdate  |
|  removeOne         |  updateOne          |
|  removeMany        |  updateMany         |


# Functions Support



For the following method we have methods to query the non-soft-deleted documents,
soft deleted (suffix: Deleted) document and both of the documents(suffix: withDeleted).

| Non-Deleted Documents | Soft Deleted Documents      | All Documents                 |
|:---------------------:|:---------------------------:|:-----------------------------:|
|find                   |    findDeleted              |  findWithDeleted              |
|findByIdAndUpdate      |    findByIdAndUpdateDeleted |  findByIdAndWithUpdateDeleted |
|findOne                |    findOneDeleted           |  findOneWithDeleted           |
|findOneAndUpdate       |    findOneAndUpdateDeleted  |  findOneAndUpdateWithDeleted  |
|replaceOne             |    replaceOneDeleted        |  replaceOneWithDeleted        |
|updateMany             |    updateManyDeleted        |  updateManyWithDeleted        |
|updateOne              |    updateOneDeleted         |  updateOneWithDeleted         |

### Hard and soft delete functions

The following method performs delete feature.

| Function              | Type       |      
|:---------------------:|:----------:|
| deleteOne             | Hard Delete|
| deleteMany            | Hard Delete|
| removeOne             | Soft Delete|
| removeMany            | Soft Delete|


### Hooks

Using mongoose hooks for soft delete.
There is always a case like you want to remove the related documents on soft delete
then you can always use the below hook.

**Note: This hook is only useful if you call removeOne and removeMany and
 always passing the required constraint for fetching relational data**

```js
   let softDelete = require('mongoosejs-soft-delete');
   let SampleSchema = new mongoose.Schema({
       comment: String
   })
   
   SampleSchema.plugin(softDelete);
   
   //This hook will run if you use Model.removeOne() method.
   SampleSchema.post('updateOne', async function() {
        if (this._update.deleted) {
            //this doc is deleted so you can easily perform clean up here.
        }
   });
   
   
   //This hook will run if you use Model.removeMany() method.
   SampleSchema.post('updateMany', async function() {
        if (this._update.deleted) {
            //do your clean up work.
        }
   });
 
```

Also, you can use the `_conditions` to the query parameters
that you passed while calling the removeMany or removeOne method.

 
 
# License
Copyright (c) 2018 [Hardik Patel](http://github.com/passioninfinite) and [Parth Patel](http://github.com/parth7676)
Code released under [MIT](https://github.com/passionInfinite/mongoosejs-soft-delete/blob/master/LICENSE)
