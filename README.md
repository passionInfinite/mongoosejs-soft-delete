# Mongoosejs Soft Delete Plugin
A lightweight plugin that enables the soft delete functionality for documents in MongoDB.
This code is based on [mongoose-delete](https://github.com/dsanel/mongoose-delete).

[![Build Status](https://travis-ci.com/passionInfinite/mongoose-soft-delete.svg?branch=master)](https://travis-ci.com/passionInfinite/mongoose-soft-delete)




# Installation
Install using [npm](https://www.npmjs.com/package/mongoosejs-soft-delete)

```npm install mongoosejs-soft-delete```

# Usage
You can use this plugin with or without passing the options to the plugin.

# Basic Usage

```
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

# Advance Usage

If you want to change the default behaviour of the plugin. For example, instead
of deletedAt you want to have custom field and the value of that custom field should be
a custom function then you can use this second option.

```
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

# Functions Available

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

The following method performs delete feature.

| Function              | Type       |      
|:---------------------:|:----------:|
| deleteOne             | Hard Delete|
| deleteMany            | Hard Delete|
| removeOne             | Soft Delete|
| removeMany            | Soft Delete|

# License
Copyright (c) 2018 [Hardik Patel](http://github.com/passioninfinite) and [Parth Patel](http://github.com/parth7676)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated 
documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.