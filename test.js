require('mocha');
var chai   = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var expect = chai.expect;
var prettyoutput = require('prettyoutput');

function runTests(promiseOrData, name) {
  // Give this a promise or data and it'll run through the tests to figure out
  // if the data conforms with the universal chat format
  let data;

  describe('conforms to universal chat format (' + name + ')', function() {
    before(function(done) {
      this.timeout(45000);
      if ('function' === typeof promiseOrData.then) {
        return promiseOrData.then(function(d) {
          data = d;
          done();
        }, function() {
          done();
        });
      }
      else { // not a promise
        data = promiseOrData;
        done();
      }

    });

    it('each item has a unique sha', function() {
      if (data.validations.ruleResults['unique-sha']['errorCount'] > 0) {
        console.log(prettyoutput(data.validations.ruleResults['unique-sha']['erroredRecords'], {maxDepth: 7}));
      }
      expect(data.validations.ruleResults['unique-sha']['errorCount']).to.be.equal(0, "each message should have a unique sha");
    });

    it('each item has correct keys', function() {
      if (data.validations.ruleResults['correct-keys']['errorCount'] > 0) {
        console.log(prettyoutput(data.validations.ruleResults['receiver-required']['erroredRecords'], {maxDepth: 7}));
      }

      expect(data.validations.ruleResults['correct-keys']['errorCount']).to.be.equal(0, "each message should have the correct keys");
    });

    it('each item has a date in the correct format', function() {
      if (data.validations.ruleResults['required-date']['errorCount'] > 0) {
        console.log(prettyoutput(data.validations.ruleResults['required-date']['erroredRecords'], {maxDepth: 7}));
      }

      expect(data.validations.ruleResults['required-date']['errorCount']).to.be.equal(0, "each message should have a date in the correct format");
    });

    it('each item that has a date_read is in the correct format', function() {
      if (data.validations.ruleResults['optional-date-read']['errorCount'] > 0) {
        console.log(prettyoutput(data.validations.ruleResults['optional-date-read']['erroredRecords'], {maxDepth: 7}));
      }

      expect(data.validations.ruleResults['optional-date-read']['errorCount']).to.be.equal(0, "each message should have a date_read in the correct format");
    });

    it('each item that has a date_delivered is in the correct format', function() {
      if (data.validations.ruleResults['optional-date-delivered']['errorCount'] > 0) {
        // console.log(prettyoutput(data.validations.ruleResults['optional-date-delivered']['erroredRecords'], {maxDepth: 7}));
      }

      expect(data.validations.ruleResults['optional-date-delivered']['errorCount']).to.be.equal(0, "each message should have a date_delivered in the correct format");
    });

    it('each item with attachments should be in the correct format', function() {
      if (data.validations.ruleResults['attachment-array']['errorCount'] > 0) {
        console.log(prettyoutput(data.validations.ruleResults['attachment-array']['erroredRecords'], {maxDepth: 7}));
      }

      expect(data.validations.ruleResults['attachment-array']['errorCount']).to.be.equal(0, "each message should have a correct attachment");
    });

    it('each item with listed attachment should have attachment path', function() {
      if (data.validations.ruleResults['attachment-missing']['errorCount'] > 0) {
        console.log(prettyoutput(data.validations.ruleResults['attachment-missing']['erroredRecords'], {maxDepth: 7}));
      }

      expect(data.validations.ruleResults['attachment-missing']['errorCount']).to.be.equal(0, "each attachment should have a path");
    });

    it('each item has a sender', function() {
      if (data.validations.ruleResults['sender-required']['errorCount'] > 0) {
        console.log(prettyoutput(data.validations.ruleResults['sender-required']['erroredRecords'], {maxDepth: 7}));
      }

      expect(data.validations.ruleResults['sender-required']['errorCount']).to.be.equal(0, "each message should have a sender ");
    });

    it('each item that has a receiver in the correct format', function() {
      if (data.validations.ruleResults['receiver-required']['errorCount'] > 0) {
        console.log(prettyoutput(data.validations.ruleResults['receiver-required']['erroredRecords'], {maxDepth: 7}));
      }

      expect(data.validations.ruleResults['receiver-required']['errorCount']).to.be.equal(0, "each message should have a receiver in the correct format");
    });

    it('each item has participants in the correct format', function() {
      if (data.validations.ruleResults['participants-format']['errorCount'] > 0) {
        console.log(prettyoutput(data.validations.ruleResults['participants-format']['erroredRecords'], {maxDepth: 7}));
      }

      expect(data.validations.ruleResults['participants-format']['errorCount']).to.be.equal(0, "each message should have a receiver in the correct format");
    });
  });
}

module.exports = runTests;
