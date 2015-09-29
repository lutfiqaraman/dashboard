// function to format the date that will be displayed in the from/to fields after you select the date
$(function() {
    $( "#fromDate" ).datepicker(
        { dateFormat: 'dd/mm/yy' }
    );
    $( "#toDate" ).datepicker(
        { dateFormat: 'dd/mm/yy' }
    );
});

// function to display the from/to fields  when you click on the calendar link
function openContent() {
    document.getElementById('calendarForm').style.display = 'block';
}


