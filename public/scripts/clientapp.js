$(document).ready(function() {
    $('#submit').on('click', postCurrentPerson);
    $('body').on('load', postAllPeople());
    $('#employee-container').on('click', '.delete-button', deletePerson);
});

var total_monthly_salary = 0;

function postCurrentPerson() {
    event.preventDefault();

    var values = {};
    $.each($('#employeeForm').serializeArray(), function(i, field) {
        values[field.name] = field.value;
    });

    console.log(values);

    $('#employeeForm').find('input[type=text]').val('');
    $('#employeeForm').find('input[type=number]').val('');

    $.ajax({
        type: 'POST',
        url: '/employees',
        data: values,
        success: function(data) {
            if(data) {
                // everything went ok
                console.log('from server:', data);

                appendPerson(data);

            } else {
                console.log('error');
            }
        }
    });
}

function appendPerson() {
    $.ajax({
        type: 'GET',
        url: '/employees',
        success: function(data) {
            var first_name = data[data.length-1].first_name;
            var last_name = data[data.length-1].last_name;
            var emp_id = data[data.length-1].emp_id;
            var job_title = data[data.length-1].job_title;
            var annual_salary = parseFloat(data[data.length-1].annual_salary);
            var monthly_salary = parseFloat(annual_salary) / 12;
            var id = data[data.length-1].id;

            $('#employee-container').append('<div></div>');
            var $el = $('#employee-container').children().last();

            $el.append('<p class="emp">Employee Name: ' + first_name + ' ' + last_name + '</p>');
            $el.append('<p class="emp">Employee ID: ' + emp_id + '</p>');
            $el.append('<p class="emp">Employee Job Title: ' + job_title + '</p>');
            $el.append('<p class="emp">Employee Yearly Salary: $' + annual_salary.toFixed(2) + '</p>');
            $el.append('<p class="emp">Employee Monthly Salary: $' + monthly_salary.toFixed(2) + '</p>');
            $el.append('<button type="button" class="delete-button" id="' + id + '">Delete Employee</button>');
            $el.append('<hr width="350px" align="left"/>');

            getSalary();
        }
    })
}

function postAllPeople() {

    $.ajax({
        type: 'GET',
        url: '/employees',
        success: function(data) {

            data.forEach(function(person, i) {

                var first_name = person.first_name;
                var last_name = person.last_name;
                var emp_id = person.emp_id;
                var job_title = person.job_title;
                var annual_salary = parseFloat(person.annual_salary);
                var id = person.id;
                monthly_salary = parseFloat(annual_salary) / 12;

                $('#employee-container').append('<div></div>');
                var $el = $('#employee-container').children().last();

                $el.append('<p class="emp">Employee Name: ' + first_name + ' ' + last_name + '</p>');
                $el.append('<p class="emp">Employee ID: ' + emp_id + '</p>');
                $el.append('<p class="emp">Employee Job Title: ' + job_title + '</p>');
                $el.append('<p class="emp">Employee Yearly Salary: $' + annual_salary.toFixed(2) + '</p>');
                $el.append('<p class="emp">Employee Monthly Salary: $' + monthly_salary.toFixed(2) + '</p>');
                $el.append('<button type="button" class="delete-button" id="' + id + '">Delete Employee</button>');
                $el.append('<hr width="350px" align="left"/>');

                getSalary();
            })
        }
    })
}

function deletePerson() {

    $(this).parent().remove();
    var empId = $(this).attr('id');
    console.log('empId: ' + empId);

    $.ajax({
        type: 'POST',
        url: '/employees/updateActive',
        data: {id: empId},
        success: function(data) {
            console.log('total monthly salary: ' + data);
            total_monthly_salary = data;
            getSalary();
        }
    });
}

function getSalary() {

    $.ajax({
        type: 'GET',
        url: '/employees/getSalary',
        success: function(data) {
            console.log('total monthly salary: ' + data);

            monthlySalary = data / 12;

            $('#totalSalary').text('Total Monthly Salary: $' + monthlySalary.toFixed(2));
        }
    });
}


