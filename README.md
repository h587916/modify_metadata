# Modify Metadata Application

This is a simple web-based application built with Flask, designed to modify metadata files used in the OPM.

## Getting Started

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/h587916/modify_metadata.git
    cd modify_metadata
    ```

2. **Create a virtual environment**:
    ```bash
    python -m venv venv
    ```

3. **Activate the virtual environment**:
    - On Windows:
        ```bash
        venv\Scripts\activate
        ```
    - On macOS/Linux:
        ```bash
        source venv/bin/activate
        ```

4. **Install the required packages**:
    ```bash
    pip install -r requirements.txt
    ```

### Running the Application

5. **Start the flask app**:
    ```bash
    flask run
    ```

6. **Access the application**:
    * Open your web browser and navigate to `http://127.0.0.1:5000`.

### Usage

1. **Upload a metadata.csv file**
    - On the homepage, click "Choose File" to select a CSV file from your computer.
    - Click "Upload" to proceed to the editing screen.
2. **Edit the file**
    - Inline edit any cell by clicking on it.
    - Get information about the metadata fields by hovering the mouse over it.
3. **Save and Download**
    - After editing, click "Save Changes" to save the file. The file is stored in files/modified.
    - Also a download link will be provided for you to download the modified file.