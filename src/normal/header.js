var zpipe = (function() {
  function run($args, $inputBytes) {
    var $inputIndex, $outputIndex, $outputBytes, Module;

    $inputIndex = 0;
    $outputIndex = 0;
    $outputBytes = new Uint8Array(0x8000);
    Module = {
      arguments: $args,
      // 標準入力を1byteずつ読みだす
      stdin: function() {
        return $inputIndex < $inputBytes.length ?
          $inputBytes[$inputIndex++] : null;
      },
      // 標準出力に1byteずつ書きこむ
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