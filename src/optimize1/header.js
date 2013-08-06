var zpipe = (function() {
  var $inputIndex, $outputIndex, $inputBytes, $outputBytes, Module;

  $outputBytes = new Uint8Array(0x8000);
  Module = {
    noInitialRun: true,
    stdin: function() {
      return $inputIndex < $inputBytes.length ?
        $inputBytes[$inputIndex++] : null;
    },
    stdout: function(x) {
      if (x === null) return;
      if ($outputIndex === $outputBytes.length) {
        var tmp = new Uint8Array($outputBytes.length * 2);
        tmp.set($outputBytes);
        $outputBytes = tmp;
      }
      $outputBytes[$outputIndex++] = x;
    }
  };

  /* emscripten code */
