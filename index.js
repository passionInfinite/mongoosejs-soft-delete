let mongoose = require('mongoose');
let Model = mongoose.Model;

let indexField = 'deletedAt';
let indexFieldType = Date
let defaultType = 'Date'

function setIndexFieldType(opts) {
    if (opts.hasOwnProperty(indexField) && opts[indexField] ) {
        return opts[indexField];
    }
    return new Date();
}


function getSoftDeleteSchema() {
    return { [indexField]: eval(indexFieldType), deleted: true }
}



// mongoose.plugin(softDelete, { index: 'deleteAt', deletedAt: 'custom date function', type: 'Date'});

module.exports = exports = function (schema, opts) {
    opts = opts || {};

    /*
        For custom index field name
        for example: instead of deletedAt => delete
     */

    if (opts.hasOwnProperty('index')) {
        if (opts.index instanceof String ) {
            indexField = opts.index;
            if (typeof opts[indexField] === 'function' && opts.hasOwnProperty('type')) {
                defaultType = opts.type
            } else {
                throw "If your index field is function then specify the type attribute showing the" +
                " return type corresponding to the mongoose schema types."
            }
        } else {
            throw "Index field should be a string only."
        }
    }

    /*
        For custom index field value
        for example instead of deletedAt=true you can pass deletedAt=[custom date function]
        if you pass function to the index field you have to specify the type field which shows the return
        type of the custom function that is specified to the index field.
    */
    indexFieldType = setIndexFieldType(opts);

    if (indexFieldType && indexField) {
        schema.add({
            [indexField] : {
                type: defaultType,
                index: true
            },
            deleted: {
                type: 'Boolean',
                default: false
            }
        });
    } else {
        throw "The value of index can be custom date function, true or any value that you want to set." +
        " Except: null, undefined and false."
    }

    let overrideMethods = [
        'find',
        'findById',
        'findByIdAndUpdate',
        'findOne',
        'findOneAndUpdate',
        'replaceOne',
        'updateMany',
        'updateOne'
    ];


    overrideMethods.forEach(function (method) {
        schema.statics[method] = function () {
            return Model[method].apply(this, arguments).where('deleted').equals(false);
        };

        schema.statics[method + 'Deleted'] = function () {
            return Model[method].apply(this, arguments).where('deleted').equals(true);
        };

        schema.statics[method + 'WithDeleted'] = function () {
            return Model[method].apply(this, arguments);
        };
    });


    schema.statics.findOneAndRemove = function (conditions, callback) {
        return this.findOneAndUpdate(conditions, getSoftDeleteSchema(), { new: true }, callback);
    };

    schema.statics.findOneAndDelete = function (conditions, callback) {
        return this.findOneAndUpdate(conditions, getSoftDeleteSchema(), { new: true }, callback);
    };

    schema.statics.findByIdAndRemove = function (id, options = {}, callback) {
        return this.findByIdAndUpdate(id, getSoftDeleteSchema(), options, callback);
    };

    schema.statics.findByIdAndDelete = function (id, options = {}, callback) {
        return this.findByIdAndUpdate(id, getSoftDeleteSchema(), options, callback);
    };

    schema.statics.deleteOne = function (conditions, options = {}, callback) {
        return this.updateOne(conditions, getSoftDeleteSchema(), options, callback);
    };

    schema.statics.deleteMany = function (conditions, options = {}, callback) {
        return this.updateMany(conditions, getSoftDeleteSchema(), options, callback);
    };


    /*
       This function will not do soft delete.
       If you want to delete only one document pass the unique condition.
    */
    schema.statics.delete = function (conditions, options = {}, callback) {
        return this.deleteMany(conditions, options, callback);
    };

    /*
       This function helps you to restore the soft deleted document based on the conditions.
     */
    schema.statics.restore = function (conditions, options = {}, callback) {
        return this.updateMany(conditions, { [indexField]: null, deleted: false }, options, callback);
    };
};
