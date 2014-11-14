var fs  = require('fs');
var eol = '\n';
var delimiter = ',';

function load(filename, options) {
  // set default delimiter
  options           = options || {};
  options.eol       = options.eol || eol;
  options.delimiter = options.delimiter || delimiter;
  // load content
  console.assert(typeof filename === 'string', 'missing filename');
  var content = fs.readFileSync(filename, 'utf-8');
  console.assert(typeof content === 'string', 'missing content from ' + filename);
  var lines = content.split(options.eol);
  console.assert(lines.length > 1, 'invalid number of lines ' + lines.length + ' in file ' + filename);

  var results = [];
  var columns = getColumns(lines[0], options.delimiter);
  console.assert(Array.isArray(columns), 'could not get columns from first line ' + lines[0]);

  // loop over the available lines
  lines.forEach(function (line, index) {
    if (index === 0 || !line) {
      return; // we already have columns
    }

    // retrieve values from line
    var values = getColumns(line, options.delimiter);
    console.assert(Array.isArray(values), 'could not get values from line ' + line);
    console.assert(values.length === columns.length,
      'expected values from line ' + line + ' to match property names ' +
      ' from first line ' + lines[0]);

    // set values in object
    var obj = {};
    values.forEach(function (value, columnIndex) {
      obj[columns[columnIndex]] = value;
    });
    results.push(obj);
  });

  return results;
}

function getColumns(line, delimiter) {
  console.assert(typeof line === 'string', 'missing header line');
  var regex   = new RegExp("(\".*?\"\\\s*|[^\"" + delimiter + "]+)(?=\\\s*[" + delimiter + "]|\\\s*$)","g");
  var columns = line.match(regex);
  console.assert(columns.length > 1, 'invalid columns ' + JSON.stringify(columns) + ' from line ' + line);
  return stripQuotes(columns);
}

function stripQuotes(words) {
  console.assert(Array.isArray(words), 'missing an array');
  return words.map(function (word) {
    console.assert(typeof word === 'string', 'expected string, found ' + word);
    return word.trim();
    // return word.replace(/"/g, '');
  });
}

module.exports = load;
