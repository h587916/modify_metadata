$(document).ready(function() {
    // Initialize tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();

    // Initialize DataTable (if you are using DataTables library)
    $('#csvTable').DataTable();

    // Handle Save Changes button click
    $('#saveBtn').click(function() {
        // Collect table data
        let tableData = [];
        $('#csvTable tbody tr').each(function() {
            let rowData = {};
            $(this).find('td').each(function(index) {
                let columnName = $('#csvTable thead th').eq(index).text();
                rowData[columnName] = $(this).text().trim();  // Use .text() for contenteditable cells, including dropdowns
            });
            tableData.push(rowData);
        });

        // Send data to server
        $.ajax({
            url: '/save_changes',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ data: tableData, filename: '{{ filename }}' }),
            success: function(response) {
                alert('Changes saved successfully!');
                window.location.href = response.download_url; // Redirect to the download URL
            },
            error: function(xhr, status, error) {
                alert('An error occurred while saving changes.');
            }
        });
    });

    // Handle dropdown selection
    $('#csvTable').on('click', '.dropdown-item', function(e) {
        e.preventDefault();
        var selectedValue = $(this).data('value');
        var cell = $(this).closest('td');
        
        // Update the displayed value
        cell.find('.dropdown-toggle').text(selectedValue);

        // If needed, update the actual content of the cell
        cell.attr('data-value', selectedValue);
    });
});
