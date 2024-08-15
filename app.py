from flask import Flask, render_template, request, redirect, url_for, send_file, jsonify
import pandas as pd
import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'files/uploads/'
app.config['MODIFIED_FOLDER'] = 'files/modified/'

# Ensure the modified folder exists
os.makedirs(app.config['MODIFIED_FOLDER'], exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

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
        return redirect(url_for('edit_file', filename=file.filename))

@app.route('/edit/<filename>', methods=['GET'])
def edit_file(filename):
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    df = pd.read_csv(file_path)
    columns = df.columns.tolist()
    data = df.to_dict(orient='records')
    
    # Example tooltips
    tooltips = {
        "type": "Type of data (ordinal, binary, continuous, nominal)",
        "Nvalues": "Number of values",
        "gapwidth": "Width of gaps",
        "domainmin": "Minimum domain value",
        "domainmax": "Maximum domain value",
        "minincluded": "Is the minimum included?",
        "maxincluded": "Is the maximum included?",
        "plotmin": "Minimum value for plotting",
        "plotmax": "Maximum value for plotting"
    }

    tooltip_columns = ["type", "Nvalues", "gapwidth", "domainmin", "domainmax", "minincluded", "maxincluded", "plotmin", "plotmax"]

    return render_template('edit.html', data=data, columns=columns, column_tooltips=tooltips, filename=filename, tooltip_columns=tooltip_columns)

@app.route('/save_changes', methods=['POST'])
def save_changes():
    data = request.json
    table_data = data['data']
    filename = data['filename']
    modified_filename = f"{os.path.splitext(filename)[0]}-modified.csv"
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    modified_file_path = os.path.join(app.config['MODIFIED_FOLDER'], modified_filename)

    # Convert list of dicts to DataFrame
    df = pd.DataFrame(table_data)

    # Save DataFrame to CSV
    df.to_csv(modified_file_path, index=False)

    # Respond with a URL to download the modified file
    return jsonify({
        'download_url': f'/download/{modified_filename}'
    })

@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    return send_file(
        os.path.join(app.config['MODIFIED_FOLDER'], filename),
        as_attachment=True
    )

if __name__ == '__main__':
    app.run(debug=True)
