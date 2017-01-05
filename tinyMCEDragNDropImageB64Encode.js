function base64EncodeAndTinyMceInsert (files) {
  for (var i = 0; i < files.length; i++) {
    if (files[i].size > 1000000)
      files[i].allowed = confirm(files[i].name + " fait plus de 1mo et peut prendre du temps à insérer, voulez-vous continuer ?")
  }

  for (var i = 0; i < files.length; i++) {
    if (files[i].allowed !== false && files[i].type.match('image.*')) {
      var img = document.createElement('img')

      var fr = new FileReader()

      fr.readAsDataURL(files[i])

      fr.onloadend = function (e) {
        img.src = e.target.result
        tinymce.activeEditor.execCommand('mceInsertContent', false, img.outerHTML)
      }
    }
  }
}

tinymce.init({
    plugins: [],
    toolbar: [
      "customInsertImage",
    ],
    paste_data_images: true,
    setup: function ($editor) {
      //////////////////////////////////////////////
      // add custom btn to handle image by selecting them with system explorer
      $editor.addButton('customInsertImage', {
        icon: 'mce-ico mce-i-image',
        onclick: function () {
          if ($('#hidden_tinymce_fileinput').length > 0) $('#hidden_tinymce_fileinput').remove()

          fileTag = document.createElement('input')
          fileTag.id = 'hidden_tinymce_fileinput'
          fileTag.type = 'file'
          $('body').append(fileTag)

          $('#hidden_tinymce_fileinput').on('change', function () {
            base64EncodeAndTinyMceInsert($(this)[0].files)
          })

          $('#hidden_tinymce_fileinput').click()
        }
      })

      //////////////////////////////////////////////
      // Handle drag & drop image into TinyMce by encoding them in base64 (to avoid uploading them somewhere and keep saving comment in string format)
      $editor
      .on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
        e.preventDefault()
        e.stopPropagation()
      })
      .on('drop', function(e) {
        base64EncodeAndTinyMceInsert(e.dataTransfer.files)
      })
    }
});
