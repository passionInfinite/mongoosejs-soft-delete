let mongoose = require('mongoose');
let Model = mongoose.Model;

let indexField = 'deletedAt';
let indexFieldType = Date

function setIndexFieldType(opts) {
    if (opts.hasOwnProperty(indexField) && opts[indexField] ) {
        return opts[indexField];
    }
    return Date;
}


function getSoftDeleteSchema() {
    return { [indexField]: indexFieldType }
}



// mongoose.plugin(softDelete, { index: 'delete', deletedAt: 'custom date function'});

module.exports = exports = function softDelete(schema, opts) {
    opts = opts || {};

    /*
        For custom index field name
        for example: instead of deletedAt => delete
     */

    if (opts.hasOwnProperty('index')) {
        if (opts.index instanceof String ) {
            indexField = opts.index;
        } else {
            throw "Index field should be a string only."
        }
    }

    /*
        For custom index field value
        for example instead of deletedAt=true you can pass deletedAt=[custom date function]
    */
    indexFieldType = setIndexFieldType(opts);

    if (indexFieldType && indexField) {
        schema.add({ [indexField] : indexFieldType, index: indexField });
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
            return Model[method].apply(this, arguments).where(indexField).equals(null);
        };

        schema.statics[method + 'Deleted'] = function () {
            return Model[method].apply(this, arguments).where(indexField).ne(null);
        };

        schema.statics[method + 'WithDeleted'] = function () {
            return Model[method].apply(this, arguments);
        };
    });


    schema.statics.findOneAndRemove = function (conditions, callback) {
        return this.findOneAndUpdate(conditions, getSoftDeleteSchema(), callback);
    };

    schema.statics.findOneAndDelete = function (conditions, callback) {
        return this.findOneAndUpdate(conditions, getSoftDeleteSchema(), callback);
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
        return this.updateMany(conditions, { [indexField]: null }, options, callback);
    };
};
