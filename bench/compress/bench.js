function bench(src, callback) {
  var s = '';
  s += 'importScripts("http://' + location.host + src + '");';
  s += 'var callback = ' + callback + ';';
  s += "\
    onmessage = function(e) {\
      var xhr = new XMLHttpRequest;\
      xhr.open('GET', 'http://" + location.host + "/test/pg30601.txt');\
      xhr.responseType = 'arraybuffer';\
      xhr.onloadend = function() {\
        var data = new Uint8Array(xhr.response);\
        var start = Date.now();\
        for (var i = 0; i < 50; ++i) {\
          callback(data);\
        }\
        postMessage(Date.now() - start);\
      };\
      xhr.send();\
    };";
  var worker = new Worker(URL.createObjectURL(new Blob([s])));
  worker.postMessage('');
  worker.onmessage = function(e) {
    document.write(+e.data / 50);
  };
}