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
      expect(data.validations.ruleResults['unique-sha']['errorCount']).to.be.equal(0, "each message should have a unique sha");

      if (data.validations.ruleResults['unique-sha']['errorCount'] > 0) {
        prettyoutput(data.validations.ruleResults['unique-sha']['recordsWithErrors']);
      }
    });

    it('each item has a date in the correct format', function() {
      expect(data.validations.ruleResults['required-date']['errorCount']).to.be.equal(0, "each message should have a date in the correct format");

      if (data.validations.ruleResults['required-date']['errorCount'] > 0) {
        prettyoutput(data.validations.ruleResults['required-date']['recordsWithErrors']);
      }
    });

    it('each item that has a date_read is in the correct format', function() {
      expect(data.validations.ruleResults['optional-date-read']['errorCount']).to.be.equal(0, "each message should have a date_read in the correct format");

      if (data.validations.ruleResults['optional-date-read']['errorCount'] > 0) {
        prettyoutput(data.validations.ruleResults['optional-date-read']['recordsWithErrors']);
      }
    });

    it('each item that has a date_delivered is in the correct format', function() {
      expect(data.validations.ruleResults['optional-date-delivered']['errorCount']).to.be.equal(0, "each message should have a date_delivered in the correct format");

      if (data.validations.ruleResults['optional-date-delivered']['errorCount'] > 0) {
        prettyoutput(data.validations.ruleResults['optional-date-delivered']['recordsWithErrors']);
      }
    });

    it('each item with attachments should be in the correct format', function() {
      expect(data.validations.ruleResults['attachment-array']['errorCount']).to.be.equal(0, "each message should have a correct attachment");

      if (data.validations.ruleResults['attachment-array']['errorCount'] > 0) {
        prettyoutput(data.validations.ruleResults['attachment-array']['recordsWithErrors']);
      }
    });

    it('each item has a sender', function() {
      prettyoutput(data.validations.ruleResults['sender-required']);
      expect(data.validations.ruleResults['sender-required']['errorCount']).to.be.equal(0, "each message should have a sender ");

      if (data.validations.ruleResults['sender-required']['errorCount'] > 0) {
        prettyoutput(data.validations.ruleResults['sender-required']['recordsWithErrors']);
      }
    });

    it('each item that has a receiver in the correct format', function() {
      expect(data.validations.ruleResults['receiver-required']['errorCount']).to.be.equal(0, "each message should have a receiver in the correct format");

      if (data.validations.ruleResults['receiver-required']['errorCount'] > 0) {
        prettyoutput(data.validations.ruleResults['receiver-required']['recordsWithErrors']);
      }
    });

    it('each item has participants in the correct format', function() {
      expect(data.validations.ruleResults['participants-format']['errorCount']).to.be.equal(0, "each message should have a receiver in the correct format");

      if (data.validations.ruleResults['participants-format']['errorCount'] > 0) {
        prettyoutput(data.validations.ruleResults['participants-format']['recordsWithErrors']);
      }
    });
  });
}

module.exports = runTests;
