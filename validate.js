var _ = require("lodash");

/* Define rules to validate forever chat payload */
var rules = [
  {
    name: "unique-sha",
    description: "Each record should have a unique sha",
    setup: function() {
      this._shaMap = {};
    },
    check: function(row) {
      if (this._shaMap[row.sha]) {
        logError(row, this, { duplicate: this._shaMap[row.sha] });
      } else {
        this._shaMap[row.sha] = row;
      }
    }
  },
  {
    name: "required-date",
    description: "Each date is set properly and in ISO-8601 format",
    check: function(row) {
      if (!(row.date && isValidDate(row.date))) {
        logError(row, this);
      }
    }
  },
  {
    name: "optional-date-read",
    description: "Optional date_read is in required format",
    check: function(row) {
      if (row.date_read && !isValidDate(row.date_read)) {
        logError(row, this);
      }
    }
  },
  {
    name: "optional-date-delivered",
    description: "Optional date_delivered is in required format",
    check: function(row) {
      if (row.date_delivered && !isValidDate(row.date_delivered)) {
        logError(row, this);
      }
    }
  },
  {
    name: "message-segments",
    description: "message-segments are correct",
    check: function(row) {
      let _this = this;
      if ((!row.message_segments) || (!row.message_segments.length > 0)) {
        logError(row, this, "should have message segments"); // should have message segments
      }
      else {
        row.message_segments.forEach(segment => {
          if (segment.type === 'text') {
            if (!segment.text) {
              logError(row, _this, "text segment needs a text node");
            }
          }
          else if (segment.type === 'link') {
            if (!segment.path) {
              logError(row, _this, "link segment needs a url");
            }
            if (!segment.text) {
              logError(row, _this, "link segment needs text");
            }
          }
          else if (segment.type === 'file') {
            if (!segment.path) {
              logError(row, _this, "file segment needs a path");
            }
          }
          else if (segment.type === 'reaction') {
            if (!row.associated_sha) {
              logError(row, _this, "reaction segment should have associated sha");
            }
          }
          else {
            logError(row, _this, `unknown segment type ${segment.type}`);
          }

          //
          // ```json
          // {"type": "text", "text": "Why hello there"}
          // ```
          // ##### Link Segment
          // ```json
          // {"type": "link", "text": "Whoa, unreal", "path": "http://latlmes.com/technology/why-we-need-a-new-chat-format-1"}
          // ```
          // ##### File Segment
          // ```json
          // {"type": "file", "file_type": "image/png", "path": "/path/to/image.png"}
          // ```
          // ##### Reaction Segment
          // ```json
          // {"type": "reaction", "reaction_type": "laughed"}

        });
      }

    }
  },
  {
    name: "attachment-array",
    description: "Attachment array has a type and a path",
    check: function(row) {
      let rule = this;
      let pathError = false;

      if (row.attachments && row.attachments.length > 0) {
        _.each(row.attachments, function(attachment) {
          if (!(attachment.path && attachment.path.length > 0)) {
            pathError = true;
          }
        });

        if (pathError) {
          logError(row, rule, "path is required");
        }
      }
    }
  },
  {
    name: "sender-required",
    description: "Sender is set",
    check: function(row) {
      if (!row.sender) {
        logError(row, this);
      }
    }
  },
  {
    name: "receiver-required",
    description: "Receiver is set",
    check: function(row) {
      if (!row.receiver || (row.receiver.length && row.receiver.length === 0)) {
        logError(row, this);
      }
    }
  },
  {
    name: "participants-format",
    description: "Participants always includes both sender and receivers",
    check: function(row) {
      let rule = this;
      let people = [].concat(row.receiver).push(row.sender);
      _.each(people, function(person) {
        if (!_.includes(row.participants, person)) {
          logError(row, rule);
        }
      });
    }
  }
];

var errorsByRow = {};

// function isNumeric(num) {
//   return !isNaN(num);
// }

function isValidDate(date) {
  var match = date.match(/^\d\d\d\d-\d\d-\d\dT\d\d\:\d\d\:\d\d/);
  return date && match && match.length > 0;
}

function logError(row, rule, details) {
  let errorRow = errorsByRow[row.sha];

  if (!rule.errorCount) rule.errorCount = 0;
  rule.errorCount = rule.errorCount + 1;

  if (!rule.recordsWithErrors) {
    rule.recordsWithErrors = [];
  }

  rule.recordsWithErrors.push({row: row, error: details});

  if (!errorRow) {
    errorRow = errorsByRow[row.sha] = {
      row: row
    };
  }

  let ruleError = errorRow[rule.name];
  if (!ruleError) {
    ruleError = errorRow[rule.name] = [];
  }
  if (details) {
    ruleError.push(details);
  }
}

function validate(data) {
  if (!data) data = [];

  _.each(rules, function(rule) {
    if (rule.setup) {
      rule.setup();
    }
  });

  _.each(data, function(row) {
    _.each(rules, function(rule) {
      if (rule.check) {
        rule.check(row);
      }
    });
  });

  _.each(rules, function(rule) {
    if (rule.final) {
      rule.final(data);
    }
  });

  let results = {};

  _.each(rules, function(rule) {
    results[rule.name] = {
      description: rule.description,
      errorCount: rule.errorCount || 0,
      erroredRecords: rule.recordsWithErrors || []
    };
  });

  return {
    recordsWithErrors: errorsByRow || [],
    ruleResults: results,
    checkedCount: data.length,
    errorCount: Object.keys(errorsByRow).length,
    version: "1.2"
  };
}

module.exports = validate;
