# Modify Metadata Application

This is a simple web-based application built with Flask, designed to create and modify metadata files.

## Getting Started

### Prerequisites

Make sure you have the following installed on your system:
- **Python 3.12** - Download and install from [Python's official site](https://www.python.org/downloads/)
- **Git** - [Installation guide](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- **R** - Download from [CRAN](https://cran.r-project.org/mirrors.html)

### Setting Up `R_HOME` Environment Variable

To successfully run this project, you need to set the `R_HOME` environment variable on your computer. This environment variable should point to the directory where R is installed. Follow the steps below to configure it:

#### 1. Locate Your R Installation Directory

- If you have R installed, you should find it in a directory similar to one of these:
  - `C:\Program Files\R\R-x.x.x\` (where `x.x.x` is the version number of R installed)
  - `C:\Users\YourUsername\Documents\R\R-x.x.x\`

If you do not have R installed, please download and install it from the [official R website](https://cran.r-project.org/mirrors.html).

#### 2. Set the `R_HOME` Environment Variable

On Windows:
1. Press `Win + S` and type **Environment Variables**.
2. Click on **Edit the system environment variables**.
3. In the **System Properties** window, click on **Environment Variables...**.
4. Under **System variables** (or **User variables** if you only want to set it for your user), click **New...**.
5. In the **Variable name** field, enter: `R_HOME`.
6. In the **Variable value** field, enter the path to your R installation directory. For example:
    - `C:\Program Files\R\R-x.x.x\`
7. Click **OK** to close each window and apply

### Installation

1. **Make sure to have Python 3.12 activated**:
   ```bash
   python --version
  
2. **Clone the repository**:
    ```bash
    git clone https://github.com/h587916/modify_metadata.git
    cd modify_metadata
    ```

3. **Create a virtual environment**:
    ```bash
    python -m venv venv
    ```

4. **Activate the virtual environment**:
    - On Windows:
        ```bash
        venv\Scripts\activate
        ```
    - On macOS/Linux:
        ```bash
        source venv/bin/activate
        ```

5. **Install the required packages**:
    ```bash
    pip install -r requirements.txt
    ```

## Running the Application

1. **Start the flask app**:
    ```bash
    flask run
    ```

2. **Access the application**:
    * Open your web browser and navigate to `http://127.0.0.1:5000`.


do you have some improvements to this README.md file+
