let mongoose = require('mongoose');
let Model = mongoose.Model;

// mongoose.plugin(softDelete, { index: 'deleteAt', deletedAt: 'custom date function' });

module.exports = exports = function (schema, opts) {
    opts = opts || {};

    let indexField = 'deletedAt';

    function setIndexFieldType(opts) {
        if (opts.hasOwnProperty(indexField) && opts[indexField] ) {
            return opts[indexField];
        }
        return new Date();
    }

    function getSoftDeleteSchema() {
        if (typeof indexFieldType === 'function') {
            return { [indexField]: eval(indexFieldType), deleted: true }
        }
        else {
            return { [indexField]: indexFieldType, deleted: true }
        }
    }

    /*
        For custom index field value
        for example instead of deletedAt=true you can pass deletedAt=[custom date function]
        if you pass function to the index field then make sure it returns types supported by the mongoose
        schema types.
    */
    let indexFieldType = setIndexFieldType(opts);
    let defaultType = typeof indexFieldType

    /*
        For custom index field name
        for example: instead of deletedAt => delete
     */
    if (opts.hasOwnProperty('index')) {
        if (opts.hasOwnProperty(opts.index)) {
            if (typeof opts.index === 'string') {
                indexField = opts.index;
            } else {
                throw "Index field should be a string only."
            }
        } else {
            throw "Index field should be defined."
        }
    }

    if (indexFieldType && indexField) {
        schema.add({
            [indexField] : {
                type: defaultType,
                index: true
            },
            deleted: {
                type: Boolean,
                default: false
            }
        });
    } else {
        throw "The value of index can be custom date function, true or any value that you want to set." +
        " Except: null, undefined and false."
    }

    let overrideMethods = [
        'find',
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

    schema.statics.findById = function () {
        return Model['findOne'].apply(this, {}).where('_id', arguments[0]).where('deleted').equals(false)
    }

    schema.statics.findByIdDeleted = function () {
        return Model['findOne'].apply(this, {}).where('_id', arguments[0]).where('deleted').equals(true)
    }

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

    schema.statics.removeOne = function (conditions, options = {}, callback) {
        return this.updateOne(conditions, getSoftDeleteSchema(), options, callback);
    };

    schema.statics.removeMany = function (conditions, options = {}, callback) {
        return this.updateMany(conditions, getSoftDeleteSchema(), options, callback);
    };

    /*
       This function helps you to restore the soft deleted document based on the conditions.
     */
    schema.statics.restore = function (conditions, options = {}, callback) {
        return this.updateManyWithDeleted(conditions, { [indexField]: null, deleted: false }, options, callback);
    };
};
