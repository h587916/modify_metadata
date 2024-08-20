$(document).ready(function() {
    // Initialize tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();

    // Initialize Bootstrap tooltips for dropdown items
    $('#csvTable').on('mouseenter', '.dropdown-item', function() {
        $(this).tooltip('show');
    });

    $('#csvTable').on('mouseleave', '.dropdown-item', function() {
        $(this).tooltip('hide');
    });

    // Initialize DataTable
    $('#csvTable').DataTable({
        paging: false,
        searching: false,
        info: false,
        ordering: false,
        lengthChange: false,
    });

    // Handle Save Changes button click
    $('#saveBtn').click(function() {
        // Collect table data
        let tableData = [];
        $('#csvTable tbody tr').each(function() {
            let rowData = {};
            $(this).find('td').each(function(index) {
                let columnName = $('#csvTable thead th').eq(index).text();
                
                // Get the content based on whether it's a dropdown or regular cell
                if ($(this).hasClass('dropdown-cell')) {
                    // Get the selected value from the dropdown
                    rowData[columnName] = $(this).find('.dropdown-toggle-text').text().trim();
                } else {
                    // Get the text content for regular cells
                    rowData[columnName] = $(this).text().trim();
                }
            });
            tableData.push(rowData);
        });

        // Send data to server
        $.ajax({
            url: '/save_changes',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ data: tableData, filename: filename }),  // Use the filename variable
            success: function(response) {
                alert('Changes saved successfully!');
                window.location.href = response.download_url; // Redirect to the download URL
            },
            error: function(xhr, status, error) {
                alert('An error occurred while saving changes.');
            }
        });
    });

    // Handle cell click to show dropdown
    $('#csvTable').on('click', '.dropdown-cell', function() {
        // Close all dropdowns
        $('.dropdown-cell').not(this).removeClass('show');
        // Toggle the clicked dropdown
        $(this).toggleClass('show');
    });

    // Handle dropdown selection
    $('#csvTable').on('click', '.dropdown-item', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var selectedValue = $(this).data('value');
        var cell = $(this).closest('.dropdown-cell');

        // Update the displayed value
        cell.find('.dropdown-toggle-text').text(selectedValue);

        // Update the actual content of the cell
        cell.attr('data-value', selectedValue);  // Ensure the data-value contains only the selected value

        // Close the dropdown menu
        cell.removeClass('show');
    });

    // Close dropdown if clicked outside
    $(document).click(function(e) {
        if (!$(e.target).closest('.dropdown-cell').length) {
            $('.dropdown-cell').removeClass('show');
        }
    });
});
