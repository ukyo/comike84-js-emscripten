  function _read(fildes, buf, nbyte) {
    // ssize_t read(int fildes, void *buf, size_t nbyte);
    // http://pubs.opengroup.org/onlinepubs/000095399/functions/read.html
    var stream = FS.streams[fildes];
    if (!stream) {
      ___setErrNo(ERRNO_CODES.EBADF);
      return -1;
    } else if (!stream.isRead) {
      ___setErrNo(ERRNO_CODES.EACCES);
      return -1;
    } else if (nbyte < 0) {
      ___setErrNo(ERRNO_CODES.EINVAL);
      return -1;
    } else {
      var bytesRead;
      if (stream.object.isDevice) {
        if (stream.object.input) {
          /*
          bytesRead = 0;
          while (stream.ungotten.length && nbyte > 0) {
            HEAP8[((buf++)|0)]=stream.ungotten.pop()
            nbyte--;
            bytesRead++;
          }
          for (var i = 0; i < nbyte; i++) {
            try {
              var result = stream.object.input();
            } catch (e) {
              ___setErrNo(ERRNO_CODES.EIO);
              return -1;
            }
            if (result === null || result === undefined) break;
            bytesRead++;
            HEAP8[(((buf)+(i))|0)]=result
          }
          */
          bytesRead = Math.min($inputBytes.length - $inputIndex, nbyte);
          HEAPU8.set($inputBytes.subarray($inputIndex, $inputIndex + bytesRead), buf);
          $inputIndex += bytesRead;
          return bytesRead;
        } else {
          ___setErrNo(ERRNO_CODES.ENXIO);
          return -1;
        }
      } else {
        var ungotSize = stream.ungotten.length;
        bytesRead = _pread(fildes, buf, nbyte, stream.position);
        if (bytesRead != -1) {
          stream.position += (stream.ungotten.length - ungotSize) + bytesRead;
        }
        return bytesRead;
      }
    }
  }

  function _write(fildes, buf, nbyte) {
    // ssize_t write(int fildes, const void *buf, size_t nbyte);
    // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
    var stream = FS.streams[fildes];
    if (!stream) {
      ___setErrNo(ERRNO_CODES.EBADF);
      return -1;
    } else if (!stream.isWrite) {
      ___setErrNo(ERRNO_CODES.EACCES);
      return -1;
    } else if (nbyte < 0) {
      ___setErrNo(ERRNO_CODES.EINVAL);
      return -1;
    } else {
      if (stream.object.isDevice) {
        if (stream.object.output) {
          /*
          for (var i = 0; i < nbyte; i++) {
            try {
              stream.object.output(HEAP8[(((buf)+(i))|0)]);
            } catch (e) {
              ___setErrNo(ERRNO_CODES.EIO);
              return -1;
            }
          }
          stream.object.timestamp = Date.now();
          return i;
          */
          var outputBytesLen, needLen, tmp;
          outputBytesLen = $outputBytes.length;
          needLen = $outputIndex + nbyte;
          if (outputBytesLen < needLen) {
            while (outputBytesLen < needLen) outputBytesLen *= 2;
            tmp = new Uint8Array(outputBytesLen);
            tmp.set($outputBytes);
            $outputBytes = tmp;
          }
          $outputBytes.set(HEAPU8.subarray(buf, buf + nbyte), $outputIndex);
          $outputIndex += nbyte;
          return nbyte;
        } else {
          ___setErrNo(ERRNO_CODES.ENXIO);
          return -1;
        }
      } else {
        var bytesWritten = _pwrite(fildes, buf, nbyte, stream.position);
        if (bytesWritten != -1) stream.position += bytesWritten;
        return bytesWritten;
      }
    }
  }

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