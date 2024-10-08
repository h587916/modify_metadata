$(document).ready(function() {
    // Intialize history stacks
    let undoStack = [];
    let redoStack = [];

     // Save the current state of the table
     function saveState() {
        const tableState = $('#csvTable').html();
        undoStack.push(tableState);
        redoStack = []; // Clear redo stack whenever a new state is saved
    }

    // Restore given state
    function restoreState(state) {
        $('#csvTable').html(state);
    }

    // Function to collect the current table data
    function collectTableData() {
        let tableData = [];
        $('#csvTable tbody tr').each(function() {
            let rowData = {};
            $(this).find('td').each(function(index) {
                let columnName = $('#csvTable thead th').eq(index).text();
                if ($(this).hasClass('dropdown-cell')) {
                    rowData[columnName] = $(this).find('.dropdown-toggle-text').text().trim();
                } else {
                    rowData[columnName] = $(this).text().trim();
                }
            });
            tableData.push(rowData);
        });
        return tableData;
    }

    // Initialize tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();

    // Initialize Bootstrap tooltips for dropdown items
    $('#csvTable').on('mouseenter', '.dropdown-item', function() {
        $(this).tooltip('show');
    });

    // Hide Bootstrap tooltips for dropdown items on mouse leave
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
        let tableData = collectTableData();
        
        // Send data to server to save changes
        $.ajax({
            url: '/save_changes',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ data: tableData, filename: filename }),  // Use the filename variable
            success: function(response) {
                alert('Changes saved successfully!');
            },
            error: function(xhr, status, error) {
                alert('An error occurred while saving changes.');
            }
        });
    });

    // Handle Download button click
    $('#downloadBtn').click(function() {
        let tableData = collectTableData();
        
        // Send data to server to save as a downloadable file
        $.ajax({
            url: '/save_changes',  // Reuse the save_changes route to generate the download file
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ data: tableData, filename: filename }),  // Use the filename variable
            success: function(response) {
                window.location.href = response.download_url;  // Trigger the download
            },
            error: function(xhr, status, error) {
                alert('An error occurred while generating the download.');
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

    // Handle cell edit (for text input cells)
    $('#csvTable').on('input', '.editable-cell', function() {
        saveState();
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

        // Save the state after a dropdown selection
        saveState();

        // Close the dropdown menu
        cell.removeClass('show');
    });

    // Close dropdown if clicked outside
    $(document).click(function(e) {
        if (!$(e.target).closest('.dropdown-cell').length) {
            $('.dropdown-cell').removeClass('show');
        }
    });

    // Handle Undo button click
    $('#undoBtn').click(function() {
        if (undoStack.length > 1) {  // Ensure there is a previous state to revert to
            const currentState = undoStack.pop();
            redoStack.push(currentState);
            const previousState = undoStack[undoStack.length - 1];
            restoreState(previousState);
        }
    });

    // Handle Redo button click
    $('#redoBtn').click(function() {
        if (redoStack.length > 0) {  // Ensure there is a state to redo
            const nextState = redoStack.pop();
            undoStack.push(nextState);
            restoreState(nextState);
        }
    });

    saveState(); // Save initial state
});
