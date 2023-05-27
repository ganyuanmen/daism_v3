 
var toolbarOptions = [
    ['bold', 'italic', 'underline'],        // toggled buttons
    ['blockquote', 'code-block'],
    ['image'], 
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'align': [] }],
  ];
  
  var quill = new Quill('#editor', {
    modules: {
      toolbar: toolbarOptions
    },
    theme: 'snow'
  });