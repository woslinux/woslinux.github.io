'use strict';

function ImageViewer(array, index, x, y, width, height) {
  var imageViewer = document.getElementById('image-viewer');
  var imageViewerContainer = document.getElementById('image-viewer-container');
  var imageViewerClose = document.getElementById('image-viewer-close');

  imageViewerClose.onclick = function() {
    imageViewer.classList.remove('visible');
  };
  imageViewer.classList.add('visible');

  imageViewerContainer.innerHTML = '';
  array.forEach(function(item, index1) {
    var image = document.createElement('img');
    image.src = item;
    imageViewerContainer.appendChild(image);

    imageViewer.style.left = x + 'px';
    imageViewer.style.top = y + 'px';
    imageViewer.style.width = width + 'px';
    imageViewer.style.height = height + 'px';
    imageViewer.style.transition = 'none';
    setTimeout(function() {
      imageViewer.style.transition = null;
    }, 5);
    setTimeout(function() {
      imageViewer.style.left = null;
      imageViewer.style.top = null;
      imageViewer.style.width = null;
      imageViewer.style.height = null;
    }, 10);
    setTimeout(function() {
      if (index1 == index) {
        image.scrollIntoView();
      }
    }, 500);
  });
}
