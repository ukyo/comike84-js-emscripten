function load(url) {
  var d = $.Deferred();
  var xhr = new XMLHttpRequest;
  xhr.open('GET', url);
  xhr.responseType = 'arraybuffer';
  xhr.onloadend = function() {
    d.resolve(new Uint8Array(xhr.response));
  };
  xhr.send();
  return d.promise();
}

function isSameArray(a, b) {
  if (a.length !== b.length) return false;
  for(var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

asyncTest('test compress and decompress', function() {
  $.when(load('pg30601.txt'), load('pg30601.txt.zlib'))
  .done(function(source, compressed) {
    var a = zpipe.compress(source);
    ok(isSameArray(a, compressed), 'zpipe.compress');
    var b = zpipe.decompress(a);
    ok(isSameArray(b, source), 'zpipe.decompress');

    var a = zpipe.compress(source);
    ok(isSameArray(a, compressed), 'zpipe.compress');
    var b = zpipe.decompress(a);
    ok(isSameArray(b, source), 'zpipe.decompress');

    start();
  })
})