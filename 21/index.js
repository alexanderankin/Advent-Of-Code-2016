var fs = require('fs');

function getFileContents(path, cb) {
  fs.readFile(path, {
    encoding: 'ascii'
  }, cb);
}

// getFileContents('./test', function (err, data) {
//  console.log(data.substring(0, 10));
// });

var command_expressions = require('./command_expressions');

function assignCommand(line) {
  for (i in command_expressions) {
    if (command_expressions[i].regex.test(line)) {
      return {
        subroutine: command_expressions[i].subroutine,
        args: command_expressions[i].regex.exec(line).slice(1)
      }
    }
  }
}

function scramble(filename, done) {
  getFileContents(filename, function (err, data) {
    if (err) return done(err);

    var lines = data.split('\n');
    var input = lines.shift();
    console.log('input is', input);

    var output = lines.map(function (line) {
      var assignedCommand = assignCommand(line);
      var sr     = assignedCommand.subroutine;
      var args   = assignedCommand.args;

      console.log(sr);

      return function(input) { return sr.apply(null, [input].concat(args))};
    }).reduce(function function_name(string, next) {

      console.log(next(string));

      return next(string);
    }, input);

    done(null, output);
  });
}

scramble('./test', function (err, result) {
  console.log(result);
});

function unscramble(filename, done) {
  getFileContents(filename, function (err, data) {
    if (err) return done(err);

    var lines = data.split('\n');
    var input = lines.shift();
    console.log('input is', (input = 'decab'));

    lines.reverse();

    var output = lines.map(function (line) {
      var assignedCommand = assignCommand(line);
      var sr     = assignedCommand.subroutine;
      var args   = assignedCommand.args;

      return function(input) { return sr.apply(null, [input].concat(args))};
    }).reduce(function function_name(string, next) {
      return next(string);
    }, input);

    done(null, output);
  });
}

// unscramble('./test', function (err, result) {
//   console.log(result);
// });
