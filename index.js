var mocha  = require('mocha');
var chai   = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var expect = chai.expect;
var assert = chai.assert;

var _ = require('underscore');

function findInvalidDates(dates) {
  var badDates = [];
  _.each(dates, function(d) {
    if (d.match(/^\d\d\d\d-\d\d-\d\dT\d\d\:\d\d\:\d\d/).length > 0) {
      // good
    }
    else {
      badDates.push(d);
    }
  });

  return badDates;
}

function runTests(promiseOrData) {
  // Give this a promise or data and it'll run through the tests to figure out
  // if the data conforms with the universal chat format

  describe('conforms to universal chat format V 1.0', function() {
    before(function(done) {
      this.timeout(30000);

      if ('function' === typeof promiseOrData.then) {
        return promiseOrData.then(function(d) {
          data = d;
          done();
        }, function(reason) {
          done();
        });
      } else {
          data = promiseOrData;
      }
    });

    it('should return lots of chats', function() {
      return expect(data.length).to.be.greaterThan(1);
    });

    it('each item has a unique sha', function() {
      var shaMap = {};
      var duplicates = [];

      var shas = _.map(data, function(d) {
        var s = d.sha;
        if (shaMap[s]) {
          duplicates.push(d);
          duplicates.push(shaMap[s]);
        }
        shaMap[s] = d;
        return s;
      });

      var uniques = _.unique(shas);
      expect(shas.length).to.be.equal(data.length, "each message should have a sha");
      expect(duplicates.length).to.be.equal(0, "each sha should be unique " + JSON.stringify(duplicates));
    });

    it('each date is set properly and in ISO-8601 format', function() {
      var dates = _.map(data, function(d) {
        return d.date;
      });

      expect(dates.length).to.be.equal(data.length);
      expect(findInvalidDates(dates).length).to.be.equal(0);
    });

    it('each date_read is set properly and in ISO-8601 format', function() {
      var dates = _.compact(_.map(data, function(d) {
        return d.date_read;
      }));

      expect(findInvalidDates(dates).length).to.be.equal(0);
    });

    it('each date_delivered is set properly and in ISO-8601 format', function() {
      var dates = _.compact(_.map(data, function(d) {
        return d.date_delivered;
      }));

      expect(findInvalidDates(dates).length).to.be.equal(0);
    });

    it('each date_read is set properly and in ISO-8601 format', function() {
      var dates = _.compact(_.map(data, function(d) {
        return d.date_read;
      }));

      expect(findInvalidDates(dates).length).to.be.equal(0);
    });

    it('attachment array is a thing', function() {
      var attachments = _.map(data, function(d) {
        return d.attachments;
      });

      _.each(attachments, function(d) {
        expect(d).to.be.a('array');
      });
    });

    it('participants always includes sender and receiver', function() {
      return _.each(data, function(d) {
        var message = d;
        expect(message.participants).to.contain(message.sender);
        _.each(message.receiver, function(r) {
          expect(message.participants).to.contain(r);
        });
      });
    });
  });
}

module.exports = runTests;
