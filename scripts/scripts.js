$(document).ready(function() {
	$('#bear-submit').click(function() {
		if (!$.isNumeric('#bear-age')) {
			alert('Age must be a number');
		}
	});
});

function validate(evt) {
  var theEvent = evt || window.event;

  var key = theEvent.keyCode || theEvent.which;

  key = String.fromCharCode( key );

  var regex = /[0-9]|\./;

  if( !regex.test(key) ) {
    theEvent.returnValue = false;
    if(theEvent.preventDefault) theEvent.preventDefault();

    $('#bear-age-span').addClass('text-danger');
    $('#bear-age-div').addClass('has-warning');

    $('#bear-age-span').append(' <strong>Must be numeric!</strong>');
  }
}