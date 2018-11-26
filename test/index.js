let chai = require('chai')
let mongoose = require('mongoose')
let softDelete = require('../')


//Setup mongodb connection
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true })

beforeEach(function (done) {
    if (mongoose.connection.readyState === 1) {
        mongoose.connection.db.dropDatabase(done);
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
    });
});
