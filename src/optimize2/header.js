var zpipe = (function() {
  var $inputIndex, $outputIndex, $inputBytes, $outputBytes, Module;

  $outputBytes = new Uint8Array(0x8000);
  Module = { noInitialRun: true };

  /* emscripten code */
