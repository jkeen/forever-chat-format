var mocha  = require('mocha');
var chai   = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var expect = chai.expect;
var assert = chai.assert;
var _ = require('lodash');

function findInvalidDates(data, field, allowBlank) {
  var badDates = [];

  _.each(data, function(d) {
    let date = d[field];

    if (allowBlank && !date) {
      // good
    }
    else {
      var match = date.match(/^\d\d\d\d-\d\d-\d\dT\d\d\:\d\d\:\d\d/)
      if (date && match && match.length > 0) {
        // good
      }
      else {
        badDates.push(d);
      }
    }
  });

  return badDates;
}

function runTests(promiseOrData, name) {
  // Give this a promise or data and it'll run through the tests to figure out
  // if the data conforms with the universal chat format

  describe('conforms to universal chat format (' + name + ')', function() {
    before(function(done) {
      this.timeout(45000);

      if ('function' === typeof promiseOrData.then) {
        return promiseOrData.then(function(d) {
          data = d;
          done();
        }, function(reason) {
          done();
        });
      }
      else { // not a promise
        data = promiseOrData;
        done();
      }
    });

    it('should return lots of chats', function() {
      return expect(data.length).to.be.greaterThan(1);
    });

    it('each item has a unique sha', function() {
      var shaMap = {};
      var duplicates = [];
      var blanks     = [];

      var shas = _.map(data, function(d, i) {
        var s = d.sha;

        if (!s) {
          console.log('found blank: ');
          console.log(d);
          blanks.push(d);
        }
        else if (!!shaMap[s]) {
          console.log('found duplicate');
          console.log('-------');
          console.log(d);
          console.log('-------');
          console.log(shaMap[s]);

          duplicates.push(d);
          duplicates.push(shaMap[s]);
        }
        shaMap[s] = d;
        return s;
      });

      expect(blanks.length).to.be.equal(0, "each message should have a sha");
      expect(duplicates.length).to.be.equal(0, "each sha should be unique ");

    });

    it('each date is set properly and in ISO-8601 format', function() {
      let invalidDates = findInvalidDates(data, 'date');
      if (invalidDates.length > 0) {
        console.log(JSON.stringify(invalidDates));
      }

      expect(invalidDates.length).to.be.equal(0);
    });

    it('each date_read is set properly and in ISO-8601 format', function() {
      let invalidDates = findInvalidDates(data, 'date_read', true);
      if (invalidDates.length > 0) {
        console.log(JSON.stringify(invalidDates));
      }

      expect(invalidDates.length).to.be.equal(0);
    });

    it('each date_delivered is set properly and in ISO-8601 format', function() {
      let invalidDates = findInvalidDates(data, 'date_delivered', true);
      if (invalidDates.length > 0) {
        console.log(JSON.stringify(invalidDates));
      }

      expect(invalidDates.length).to.be.equal(0);
    });

    it('attachment array is a thing', function() {
      var attachments = _.map(data, function(d) {
        return d.attachments;
      });

      _.each(attachments, function(d) {
        expect(d).to.be.a('array');
      });
    });

    it('attachment array has a type and a path', function() {
      var withAttachments = _.filter(data, function(d) {
        return (d.attachments.length > 0);
      });
      _.each(withAttachments, function(d) {
        _.each(d.attachments, function(attachment) {
          expect(attachment.path.length).to.be.greaterThan(0);
          expect(attachment.type.length).to.be.greaterThan(0);
        });
      });
    });

    it('sender and receiver are set, and participants always includes both', function() {
      return _.each(data, function(d) {
        var message = d;

        if (!message.sender || !message.receiver || message.receiver.length === 0 || !_.includes(message.participants, message.sender)) {
          console.log(message);
        }
        else if (!_.includes(_.map(message.receiver, r => _.includes(message.participants, r)), true)) {
          console.log(message);
        }

        if (!message.is_from_me || message.is_from_me === 0) {
          expect(message.sender).to.be.a('string', "sender should not be blank");
        }
        expect(message.receiver).to.be.a('array');
        expect(message.receiver.length).to.be.greaterThan(0, "should include one or more receivers");

        let people = [].concat(message.receiver).push(message.sender)
        _.each(people, function(r) {
          expect(message.participants).to.contain(r, "participants should include sender and receivers");
        });


      });
    });
  });
}

module.exports = runTests;
