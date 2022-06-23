
function downloadApp(canvas, fileAddress, percentage, callback) {
  var width = canvas.width;
  var height = canvas.height;
  var chunks = 1;
  var ctx = canvas.getContext('2d');

  new Promise(resolve => {
    // https://stackoverflow.com/a/47822013
    var xhr = new XMLHttpRequest();
    xhr.open('GET', fileAddress);
    xhr.onreadystatechange = () => {
      resolve(+xhr.getResponseHeader('Content-Length'));
      xhr.abort();
    };
    xhr.send();
  }).then(size => {
    Promise.all(new Array(chunks).fill().map((_, i) => {
      return new Promise(resolve => {
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = () => {
          if (xhr.readyState !== 4) {
            return;
          }
          window.URL = window.URL || window.webkitURL;

          resolve(xhr.response);
        };

        xhr.onprogress = function (evt) {
          if (evt.lengthComputable) {
            var x = (evt.loaded / evt.total) * (width / chunks);
            var y = (evt.loaded / evt.total) * 100;

            percentage.innerText = parseInt(y) + '%';
            ctx.fillStyle = '#40a060'; // #0193CD #66D4E5 #5CB85C
            ctx.fillRect(((width / chunks) * i), 0, x, height);
          }
        };

        xhr.open('GET', fileAddress);
        xhr.responseType = 'blob';
        var chunkSize = Math.floor(size / chunks);
        var start = i * chunkSize;
        var end = i === chunks - 1 ? size - 1 : ((i + 1) * chunkSize - 1);
        // https://stackoverflow.com/questions/15561508
        xhr.setRequestHeader('Range', `bytes=${start}-${end}`); // the bytes (incl.) you request
        xhr.send(null);
      });
    })).then(function (result) {
      // http://jsfiddle.net/kGLnP/5/
      var anchor = document.createElement('a');
      anchor.href = URL.createObjectURL(new Blob(result));
      anchor.download = 'application.zip';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      callback();
    });
  });
}
