// http://joelb.me/blog/2011/code-snippet-accessing-clipboard-images-with-javascript/
// We start by checking if the browser supports the
// Clipboard object. If not, we need to create a
// contenteditable element that catches all pasted data
if (!window.Clipboard) {
   var pasteCatcher = $('#files');

   // Firefox allows images to be pasted into contenteditable elements
   pasteCatcher.attr("contenteditable", "");

   // We can hide the element and append it to the body,
   //pasteCatcher.style.opacity = 0;
   //document.body.appendChild(pasteCatcher);

   // as long as we make sure it is always in focus
   pasteCatcher.focus();
   //document.addEventListener("click", function() { pasteCatcher.focus(); });
}
// Add the paste event listener
window.addEventListener("paste", pasteHandler);

/* Handle paste events */
function pasteHandler(e) {
   // We need to check if event.clipboardData is supported (Chrome)
   if (e.clipboardData) {
      // Get the items from the clipboard
      var items = e.clipboardData.items;
      if (items) {
         // Loop through all items, looking for any kind of image
         for (var i = 0; i < items.length; i++) {
            //if (items[i].type.indexOf("image") !== -1) {
               // We need to represent the image as a file,
               var blob = items[i].getAsFile();

			   if(blob !== null) {
               // and use a URL or webkitURL (whichever is available to the browser)
               // to create a temporary URL to the object
               var URLObj = window.URL || window.webkitURL;
               var source = URLObj.createObjectURL(blob);

               // The URL can then be used as the source of an image
               var img = createImage(source);
			   $('#files').append(img);
			   } else {
				   l(e.originalEvent.clipboardData.getData(items[i].type));
				   $('#files').append(items[i]);
			   }
            //}
         }
      }
   // If we can't handle clipboard data directly (Firefox),
   // we need to read what was pasted from the contenteditable element
   } else {
      // This is a cheap trick to make sure we read the data
      // AFTER it has been inserted.
      setTimeout(checkInput, 1);
   }
}

/* Parse the input in the paste catcher element */
function checkInput() {
   // Store the pasted content in a variable
   var child = pasteCatcher.children()[0];

   // Clear the inner html to make sure we're always
   // getting the latest inserted content
   pasteCatcher.innerHTML = "";

   if (child) {
      // If the user pastes an image, the src attribute
      // will represent the image as a base64 encoded string.
      if (child.tagName === "IMG") {
         createImage(child.src);
      }
   }
}

/* Creates a new image from a given source */
function createImage(source) {
   var pastedImage = new Image();
   pastedImage.onload = function() {
      // You now have the image!
   };
   pastedImage.src = source;

   return pastedImage;
}