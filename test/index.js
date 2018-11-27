let chai = require('chai')
let mongoose = require('mongoose')
let softDelete = require('../')


//Setup mongodb connection
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true })

beforeEach(function (done) {
    if (mongoose.connection.readyState === 1) {
        mongoose.connection.dropDatabase(done);
    } else {
        done()
    }
});



describe("mongoose plugin without any opts passed to it", function () {
    let SampleSchema = new mongoose.Schema({ test: Boolean }, { collection: 'samples' });
    //By default it should add 'deletedAt' as index and the type will be Date.
    SampleSchema.plugin(softDelete)

    let SampleModel = mongoose.model('Sample', SampleSchema);

    it("findOneAndRemove should work as soft delete", async function () {
        let sampleDoc = new SampleModel({ test: true });
        let doc = await sampleDoc.save();

        let response = await SampleModel.findOneAndRemove({ test: true });
        chai.expect(response).to.have.a.property('deletedAt');

        response = await SampleModel.findById(doc._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(doc._id);
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findDeleted({ _id: doc._id });
        chai.expect(response[0]).to.have.a.property('deleted').equal(true)
    });

    it("findOneAndDelete should work as soft delete", async function () {
        let sampleDoc = new SampleModel({ test: true });
        let doc = await sampleDoc.save();

        let response = await SampleModel.findOneAndDelete({ test: true });
        chai.expect(response).to.have.a.property('deletedAt');

        response = await SampleModel.findById(doc._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(doc._id);
        chai.expect(response).to.have.a.property('deleted').equal(true)

    });

    it("findByIdAndRemove should work as soft delete", async function () {
        let sampleDoc = new SampleModel({ test: true });
        let doc = await sampleDoc.save();

        let response = await SampleModel.findByIdAndRemove(doc._id);
        chai.expect(response).to.have.a.property('deletedAt');

        response = await SampleModel.findById(doc._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(doc._id);
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findWithDeleted({ _id: doc._id });
        chai.expect(response[0]).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findDeleted({ _id: doc._id });
        chai.expect(response[0]).to.have.a.property('deleted').equal(true)
    });

    it("findByIdAndDelete should work as soft delete", async function () {
        let sampleDoc = new SampleModel({ test: true });
        let doc = await sampleDoc.save();

        let response = await SampleModel.findByIdAndDelete(doc._id);
        chai.expect(response).to.have.a.property('deletedAt');

        response = await SampleModel.findById(doc._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(doc._id);
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findDeleted({ _id: doc._id });
        chai.expect(response[0]).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findOneDeleted({ _id: doc._id });
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findOne({ _id: doc._id });
        chai.expect(response).equals(null)
    });

    it("removeOne should work as soft delete", async function () {
        let sampleDoc = new SampleModel({ test: true });
        let doc = await sampleDoc.save();

        let response = await SampleModel.removeOne({_id:doc._id});
        chai.expect(response).to.have.a.property('ok').to.have.equal(1);
        chai.expect(response).to.have.a.property('n').to.have.equal(1);

        response = await SampleModel.findById(doc._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(doc._id);
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findDeleted({ _id: doc._id });
        chai.expect(response[0]).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findOneDeleted({ _id: doc._id });
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findOne({ _id: doc._id });
        chai.expect(response).equals(null)
    });

    it("removeMany should work as soft delete", async function () {
        let sampleDoc = new SampleModel({ test: true });
        let doc = await sampleDoc.save();

        let sampleDocOne = new SampleModel({ test: true });
        let docOne = await sampleDocOne.save();

        let sampleDocTwo = new SampleModel({ test: true });
        let docTwo = await sampleDocTwo.save();

        let sampleDocThree = new SampleModel({ test: true });
        let docThree = await sampleDocThree.save();

        let response = await SampleModel.removeMany({ test:true });
        chai.expect(response).to.have.a.property('ok').to.have.equal(1);
        chai.expect(response).to.have.a.property('n').to.have.equal(4);

        response = await SampleModel.findById(doc._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(doc._id);
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findDeleted({ _id: doc._id });
        chai.expect(response[0]).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findOneDeleted({ _id: doc._id });
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findOne({ _id: doc._id });
        chai.expect(response).equals(null)

        response = await SampleModel.findById(docOne._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(docOne._id);
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findDeleted({ _id: docOne._id });
        chai.expect(response[0]).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findOneDeleted({ _id: docOne._id });
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findOne({ _id: docOne._id });
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(docTwo._id);
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findDeleted({ _id: docTwo._id });
        chai.expect(response[0]).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findOneDeleted({ _id: docTwo._id });
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findOne({ _id: docTwo._id });
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(docThree._id);
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findDeleted({ _id: docThree._id });
        chai.expect(response[0]).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findOneDeleted({ _id: docThree._id });
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findOne({ _id: docThree._id });
        chai.expect(response).equals(null)
    });

    it("deleteOne should work as hard delete", async function () {
        let sampleDoc = new SampleModel({ test: true });
        let doc = await sampleDoc.save();true

        let response = await SampleModel.deleteOne({ _id: doc._id })
        chai.expect(response).to.have.a.property('ok').to.have.equal(1);
        chai.expect(response).to.have.a.property('n').to.have.equal(1);

        response = await SampleModel.findById(doc._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(doc._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findDeleted({ _id: doc._id });
        chai.expect(response).to.be.empty

        response = await SampleModel.findOneDeleted({ _id: doc._id });
        chai.expect(response).equals(null)

        response = await SampleModel.findOne({ _id: doc._id });
        chai.expect(response).equals(null)
    });

    it("deleteMany should work as soft delete", async function () {
        let sampleDoc = new SampleModel({ test: true });
        let doc = await sampleDoc.save();

        let sampleDocOne = new SampleModel({ test: true });
        let docOne = await sampleDocOne.save();

        let sampleDocTwo = new SampleModel({ test: true });
        let docTwo = await sampleDocTwo.save();

        let sampleDocThree = new SampleModel({ test: true });
        let docThree = await sampleDocThree.save();

        let response = await SampleModel.deleteMany({ test:true });
        chai.expect(response).to.have.a.property('ok').to.have.equal(1);
        chai.expect(response).to.have.a.property('n').to.have.equal(4);

        response = await SampleModel.findById(doc._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(doc._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findDeleted({ _id: doc._id });
        chai.expect(response).to.be.empty

        response = await SampleModel.findOneDeleted({ _id: doc._id });
        chai.expect(response).equals(null)

        response = await SampleModel.findOne({ _id: doc._id });
        chai.expect(response).equals(null)

        response = await SampleModel.findById(docOne._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(docOne._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findDeleted({ _id: docOne._id });
        chai.expect(response).to.be.empty

        response = await SampleModel.findOneDeleted({ _id: docOne._id });
        chai.expect(response).equals(null)

        response = await SampleModel.findOne({ _id: docOne._id });
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(docTwo._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findDeleted({ _id: docTwo._id });
        chai.expect(response).to.be.empty

        response = await SampleModel.findOneDeleted({ _id: docTwo._id });
        chai.expect(response).equals(null)

        response = await SampleModel.findOne({ _id: docTwo._id });
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(docThree._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findDeleted({ _id: docThree._id });
        chai.expect(response).to.be.empty

        response = await SampleModel.findOneDeleted({ _id: docThree._id });
        chai.expect(response).equals(null)

        response = await SampleModel.findOne({ _id: docThree._id });
        chai.expect(response).equals(null)
    });
});

describe("mongoose plugin with any opts passed to it", function () {
    let SecondSampleSchema = new mongoose.Schema({ test: Boolean }, { collection: 'samples' });
    //By default it should add 'deletedAt' as index and the type will be Date.
    SecondSampleSchema.plugin(softDelete, { index: 'myType', myType: true })

    let SampleModel = mongoose.model('SecondSample', SecondSampleSchema);

    it("findOneAndRemove should work as soft delete", async function () {
        let sampleDoc = new SampleModel({ test: true });
        let doc = await sampleDoc.save();

        let response = await SampleModel.findOneAndRemove({ test: true });
        chai.expect(response).to.have.a.property('myType');

        response = await SampleModel.findById(doc._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(doc._id);
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findDeleted({ _id: doc._id });
        chai.expect(response[0]).to.have.a.property('deleted').equal(true)
    });

    it("findOneAndDelete should work as soft delete", async function () {
        let sampleDoc = new SampleModel({ test: true });
        let doc = await sampleDoc.save();

        let response = await SampleModel.findOneAndDelete({ test: true });
        chai.expect(response).to.have.a.property('myType');

        response = await SampleModel.findById(doc._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(doc._id);
        chai.expect(response).to.have.a.property('deleted').equal(true)

    });

    it("findByIdAndRemove should work as soft delete", async function () {
        let sampleDoc = new SampleModel({ test: true });
        let doc = await sampleDoc.save();

        let response = await SampleModel.findByIdAndRemove(doc._id);
        chai.expect(response).to.have.a.property('myType');

        response = await SampleModel.findById(doc._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(doc._id);
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findWithDeleted({ _id: doc._id });
        chai.expect(response[0]).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findDeleted({ _id: doc._id });
        chai.expect(response[0]).to.have.a.property('deleted').equal(true)
    });

    it("findByIdAndDelete should work as soft delete", async function () {
        let sampleDoc = new SampleModel({ test: true });
        let doc = await sampleDoc.save();

        let response = await SampleModel.findByIdAndDelete(doc._id);
        chai.expect(response).to.have.a.property('myType');

        response = await SampleModel.findById(doc._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(doc._id);
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findDeleted({ _id: doc._id });
        chai.expect(response[0]).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findOneDeleted({ _id: doc._id });
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findOne({ _id: doc._id });
        chai.expect(response).equals(null)
    });

    it("removeOne should work as soft delete", async function () {
        let sampleDoc = new SampleModel({ test: true });
        let doc = await sampleDoc.save();

        let response = await SampleModel.removeOne({_id:doc._id});
        chai.expect(response).to.have.a.property('ok').to.have.equal(1);
        chai.expect(response).to.have.a.property('n').to.have.equal(1);

        response = await SampleModel.findById(doc._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(doc._id);
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findDeleted({ _id: doc._id });
        chai.expect(response[0]).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findOneDeleted({ _id: doc._id });
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findOne({ _id: doc._id });
        chai.expect(response).equals(null)
    });

    it("removeMany should work as soft delete", async function () {
        let sampleDoc = new SampleModel({ test: true });
        let doc = await sampleDoc.save();

        let sampleDocOne = new SampleModel({ test: true });
        let docOne = await sampleDocOne.save();

        let sampleDocTwo = new SampleModel({ test: true });
        let docTwo = await sampleDocTwo.save();

        let sampleDocThree = new SampleModel({ test: true });
        let docThree = await sampleDocThree.save();

        let response = await SampleModel.removeMany({ test:true });
        chai.expect(response).to.have.a.property('ok').to.have.equal(1);
        chai.expect(response).to.have.a.property('n').to.have.equal(4);

        response = await SampleModel.findById(doc._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(doc._id);
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findDeleted({ _id: doc._id });
        chai.expect(response[0]).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findOneDeleted({ _id: doc._id });
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findOne({ _id: doc._id });
        chai.expect(response).equals(null)

        response = await SampleModel.findById(docOne._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(docOne._id);
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findDeleted({ _id: docOne._id });
        chai.expect(response[0]).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findOneDeleted({ _id: docOne._id });
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findOne({ _id: docOne._id });
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(docTwo._id);
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findDeleted({ _id: docTwo._id });
        chai.expect(response[0]).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findOneDeleted({ _id: docTwo._id });
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findOne({ _id: docTwo._id });
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(docThree._id);
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findDeleted({ _id: docThree._id });
        chai.expect(response[0]).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findOneDeleted({ _id: docThree._id });
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findOne({ _id: docThree._id });
        chai.expect(response).equals(null)
    });

    it("deleteOne should work as hard delete", async function () {
        let sampleDoc = new SampleModel({ test: true });
        let doc = await sampleDoc.save();true

        let response = await SampleModel.deleteOne({ _id: doc._id })
        chai.expect(response).to.have.a.property('ok').to.have.equal(1);
        chai.expect(response).to.have.a.property('n').to.have.equal(1);

        response = await SampleModel.findById(doc._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(doc._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findDeleted({ _id: doc._id });
        chai.expect(response).to.be.empty

        response = await SampleModel.findOneDeleted({ _id: doc._id });
        chai.expect(response).equals(null)

        response = await SampleModel.findOne({ _id: doc._id });
        chai.expect(response).equals(null)
    });

    it("deleteMany should work as soft delete", async function () {
        let sampleDoc = new SampleModel({ test: true });
        let doc = await sampleDoc.save();

        let sampleDocOne = new SampleModel({ test: true });
        let docOne = await sampleDocOne.save();

        let sampleDocTwo = new SampleModel({ test: true });
        let docTwo = await sampleDocTwo.save();

        let sampleDocThree = new SampleModel({ test: true });
        let docThree = await sampleDocThree.save();

        let response = await SampleModel.deleteMany({ test:true });
        chai.expect(response).to.have.a.property('ok').to.have.equal(1);
        chai.expect(response).to.have.a.property('n').to.have.equal(4);

        response = await SampleModel.findById(doc._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(doc._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findDeleted({ _id: doc._id });
        chai.expect(response).to.be.empty

        response = await SampleModel.findOneDeleted({ _id: doc._id });
        chai.expect(response).equals(null)

        response = await SampleModel.findOne({ _id: doc._id });
        chai.expect(response).equals(null)

        response = await SampleModel.findById(docOne._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(docOne._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findDeleted({ _id: docOne._id });
        chai.expect(response).to.be.empty

        response = await SampleModel.findOneDeleted({ _id: docOne._id });
        chai.expect(response).equals(null)

        response = await SampleModel.findOne({ _id: docOne._id });
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(docTwo._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findDeleted({ _id: docTwo._id });
        chai.expect(response).to.be.empty

        response = await SampleModel.findOneDeleted({ _id: docTwo._id });
        chai.expect(response).equals(null)

        response = await SampleModel.findOne({ _id: docTwo._id });
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(docThree._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findDeleted({ _id: docThree._id });
        chai.expect(response).to.be.empty

        response = await SampleModel.findOneDeleted({ _id: docThree._id });
        chai.expect(response).equals(null)

        response = await SampleModel.findOne({ _id: docThree._id });
        chai.expect(response).equals(null)
    });
});

describe("mongoose plugin with custom function passed to opts", function () {
    function getCustom() {
        return new Date()
    }

    let ThirdSampleSchema = new mongoose.Schema({ test: Boolean }, { collection: 'samples' });
    //By default it should add 'deletedAt' as index and the type will be Date.
    ThirdSampleSchema.plugin(softDelete, { index: 'custom', custom: getCustom()})

    let SampleModel = mongoose.model('ThirdSample', ThirdSampleSchema);

    it("findOneAndRemove should work as soft delete", async function () {
        let sampleDoc = new SampleModel({ test: true });
        let doc = await sampleDoc.save();

        let response = await SampleModel.findOneAndRemove({ test: true });
        chai.expect(response).to.have.a.property('custom');

        response = await SampleModel.findById(doc._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(doc._id);
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findDeleted({ _id: doc._id });
        chai.expect(response[0]).to.have.a.property('deleted').equal(true)
    });

    it("findOneAndDelete should work as soft delete", async function () {
        let sampleDoc = new SampleModel({ test: true });
        let doc = await sampleDoc.save();

        let response = await SampleModel.findOneAndDelete({ test: true });
        chai.expect(response).to.have.a.property('custom');

        response = await SampleModel.findById(doc._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(doc._id);
        chai.expect(response).to.have.a.property('deleted').equal(true)

    });

    it("findByIdAndRemove should work as soft delete", async function () {
        let sampleDoc = new SampleModel({ test: true });
        let doc = await sampleDoc.save();

        let response = await SampleModel.findByIdAndRemove(doc._id);
        chai.expect(response).to.have.a.property('custom');

        response = await SampleModel.findById(doc._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(doc._id);
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findWithDeleted({ _id: doc._id });
        chai.expect(response[0]).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findDeleted({ _id: doc._id });
        chai.expect(response[0]).to.have.a.property('deleted').equal(true)
    });

    it("findByIdAndDelete should work as soft delete", async function () {
        let sampleDoc = new SampleModel({ test: true });
        let doc = await sampleDoc.save();

        let response = await SampleModel.findByIdAndDelete(doc._id);
        chai.expect(response).to.have.a.property('custom');

        response = await SampleModel.findById(doc._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(doc._id);
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findDeleted({ _id: doc._id });
        chai.expect(response[0]).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findOneDeleted({ _id: doc._id });
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findOne({ _id: doc._id });
        chai.expect(response).equals(null)
    });

    it("removeOne should work as soft delete", async function () {
        let sampleDoc = new SampleModel({ test: true });
        let doc = await sampleDoc.save();

        let response = await SampleModel.removeOne({_id:doc._id});
        chai.expect(response).to.have.a.property('ok').to.have.equal(1);
        chai.expect(response).to.have.a.property('n').to.have.equal(1);

        response = await SampleModel.findById(doc._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(doc._id);
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findDeleted({ _id: doc._id });
        chai.expect(response[0]).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findOneDeleted({ _id: doc._id });
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findOne({ _id: doc._id });
        chai.expect(response).equals(null)
    });

    it("removeMany should work as soft delete", async function () {
        let sampleDoc = new SampleModel({ test: true });
        let doc = await sampleDoc.save();

        let sampleDocOne = new SampleModel({ test: true });
        let docOne = await sampleDocOne.save();

        let sampleDocTwo = new SampleModel({ test: true });
        let docTwo = await sampleDocTwo.save();

        let sampleDocThree = new SampleModel({ test: true });
        let docThree = await sampleDocThree.save();

        let response = await SampleModel.removeMany({ test:true });
        chai.expect(response).to.have.a.property('ok').to.have.equal(1);
        chai.expect(response).to.have.a.property('n').to.have.equal(4);

        response = await SampleModel.findById(doc._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(doc._id);
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findDeleted({ _id: doc._id });
        chai.expect(response[0]).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findOneDeleted({ _id: doc._id });
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findOne({ _id: doc._id });
        chai.expect(response).equals(null)

        response = await SampleModel.findById(docOne._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(docOne._id);
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findDeleted({ _id: docOne._id });
        chai.expect(response[0]).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findOneDeleted({ _id: docOne._id });
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findOne({ _id: docOne._id });
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(docTwo._id);
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findDeleted({ _id: docTwo._id });
        chai.expect(response[0]).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findOneDeleted({ _id: docTwo._id });
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findOne({ _id: docTwo._id });
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(docThree._id);
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findDeleted({ _id: docThree._id });
        chai.expect(response[0]).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findOneDeleted({ _id: docThree._id });
        chai.expect(response).to.have.a.property('deleted').equal(true)

        response = await SampleModel.findOne({ _id: docThree._id });
        chai.expect(response).equals(null)
    });

    it("deleteOne should work as hard delete", async function () {
        let sampleDoc = new SampleModel({ test: true });
        let doc = await sampleDoc.save();true

        let response = await SampleModel.deleteOne({ _id: doc._id })
        chai.expect(response).to.have.a.property('ok').to.have.equal(1);
        chai.expect(response).to.have.a.property('n').to.have.equal(1);

        response = await SampleModel.findById(doc._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(doc._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findDeleted({ _id: doc._id });
        chai.expect(response).to.be.empty

        response = await SampleModel.findOneDeleted({ _id: doc._id });
        chai.expect(response).equals(null)

        response = await SampleModel.findOne({ _id: doc._id });
        chai.expect(response).equals(null)
    });

    it("deleteMany should work as soft delete", async function () {
        let sampleDoc = new SampleModel({ test: true });
        let doc = await sampleDoc.save();

        let sampleDocOne = new SampleModel({ test: true });
        let docOne = await sampleDocOne.save();

        let sampleDocTwo = new SampleModel({ test: true });
        let docTwo = await sampleDocTwo.save();

        let sampleDocThree = new SampleModel({ test: true });
        let docThree = await sampleDocThree.save();

        let response = await SampleModel.deleteMany({ test:true });
        chai.expect(response).to.have.a.property('ok').to.have.equal(1);
        chai.expect(response).to.have.a.property('n').to.have.equal(4);

        response = await SampleModel.findById(doc._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(doc._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findDeleted({ _id: doc._id });
        chai.expect(response).to.be.empty

        response = await SampleModel.findOneDeleted({ _id: doc._id });
        chai.expect(response).equals(null)

        response = await SampleModel.findOne({ _id: doc._id });
        chai.expect(response).equals(null)

        response = await SampleModel.findById(docOne._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(docOne._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findDeleted({ _id: docOne._id });
        chai.expect(response).to.be.empty

        response = await SampleModel.findOneDeleted({ _id: docOne._id });
        chai.expect(response).equals(null)

        response = await SampleModel.findOne({ _id: docOne._id });
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(docTwo._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findDeleted({ _id: docTwo._id });
        chai.expect(response).to.be.empty

        response = await SampleModel.findOneDeleted({ _id: docTwo._id });
        chai.expect(response).equals(null)

        response = await SampleModel.findOne({ _id: docTwo._id });
        chai.expect(response).equals(null)

        response = await SampleModel.findByIdDeleted(docThree._id);
        chai.expect(response).equals(null)

        response = await SampleModel.findDeleted({ _id: docThree._id });
        chai.expect(response).to.be.empty

        response = await SampleModel.findOneDeleted({ _id: docThree._id });
        chai.expect(response).equals(null)

        response = await SampleModel.findOne({ _id: docThree._id });
        chai.expect(response).equals(null)
    });
});
