from flask import Flask, render_template, request, redirect, url_for, send_file, jsonify
import pandas as pd
import os
from rpy2.robjects.packages import importr
from rpy2.robjects import pandas2ri, conversion, default_converter

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'files/uploads/'
app.config['METADATA_FOLDER'] = 'files/metadata/'

# Ensure the modified folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['METADATA_FOLDER'], exist_ok=True)

@app.route('/')
def upload():
    return render_template('upload.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'No file part', 400
    file = request.files['file']
    if file.filename == '':
        return 'No selected file', 400
    if file:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)

        data = pd.read_csv(file_path)

        with conversion.localconverter(default_converter):
            # Activate the conversion between pandas and R dataframes
            pandas2ri.activate()

            # Import the 'inferno' R package
            inferno = importr('inferno')
            
            # Convert pandas DataFrame to R DataFrame
            r_data = pandas2ri.py2rpy(data)

            # Build the metadata file
            metadata_file_path = os.path.join(app.config['METADATA_FOLDER'], 'metadata_' + file.filename)
            inferno.buildmetadata(data=r_data, file=metadata_file_path)

            # Deactivate the conversion between pandas and R dataframes
            pandas2ri.deactivate()

        return redirect(url_for('edit_file', filename='metadata_' + file.filename))

@app.route('/edit/<filename>', methods=['GET'])
def edit_file(filename):
    file_path = os.path.join(app.config['METADATA_FOLDER'], filename)
    df = pd.read_csv(file_path)
    columns = df.columns.tolist()
    data = df.fillna('').to_dict(orient='records')  # Replace NaN with empty strings
    
    # Example tooltips
    tooltips = {
        "type": "Type of data (nominal, ordinal, continuous)",
        "datastep": "Width of gaps",
        "domainmin": "Minimum domain value",
        "domainmax": "Maximum domain value",
        "minincluded": "Is the minimum included?",
        "maxincluded": "Is the maximum included?",
        "plotmin": "Minimum value for plotting",
        "plotmax": "Maximum value for plotting"
    }

    tooltip_columns = ["type", "datastep", "domainmin", "domainmax", "minincluded", "maxincluded", "plotmin", "plotmax"]

    return render_template('edit.html', data=data, columns=columns, column_tooltips=tooltips, filename=filename, tooltip_columns=tooltip_columns)

@app.route('/save_changes', methods=['POST'])
def save_changes():
    data = request.json
    table_data = data['data']
    filename = data['filename']
    modified_filename = f"{os.path.splitext(filename)[0]}.csv"
    file_path = os.path.join(app.config['METADATA_FOLDER'], filename)
    modified_file_path = os.path.join(app.config['METADATA_FOLDER'], modified_filename)

    # Load the original CSV file
    original_df = pd.read_csv(file_path)
    original_columns = original_df.columns.tolist()

    # Convert list of dicts to DataFrame
    df = pd.DataFrame(table_data)

    # Clean incoming DataFrame column names
    df.columns = df.columns.str.strip().str.replace('\n', '').str.replace(' ', '')

    # Reorder columns to match original CSV
    df = df[original_columns]

    # Save DataFrame to CSV
    df.to_csv(modified_file_path, index=False)

    # Respond with a URL to download the modified file
    return jsonify({
        'download_url': f'/download/{modified_filename}'
    })

@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    return send_file(
        os.path.join(app.config['METADATA_FOLDER'], filename),
        as_attachment=True
    )

if __name__ == '__main__':
    app.run(debug=True)
