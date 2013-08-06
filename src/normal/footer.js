    return new Uint8Array($outputBytes.buffer.slice(0, $outputIndex));
  }

  return {
    compress: run.bind(null, []),
    decompress: run.bind(null, ['-d'])
  };
})();
