  function $run(args, inputBytes) {
    $inputIndex = 0;
    $outputIndex = 0;
    $inputBytes = inputBytes;

    FS.streams[1].eof = false;
    FS.streams[1].error = false;
    FS.streams[2].eof = false;
    FS.streams[2].error = false;

    Module.callMain(args);
    return new Uint8Array($outputBytes.buffer.slice(0, $outputIndex));
  }

  return {
    compress: $run.bind(null, []),
    decompress: $run.bind(null, ['-d'])
  };
})();