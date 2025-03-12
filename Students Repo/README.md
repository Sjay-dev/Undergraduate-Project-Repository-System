# Final Year Project Documentation

## Overview
This project is a backend application built using Node.js and Express.js, designed to manage documentation entries and file uploads for students and lecturers. It utilizes MongoDB for data storage and GridFS for file management.

## Project Structure
```
Students Repo
├── controllers
│   ├── documentationController.js
│   └── fileController.js
├── middleware
│   ├── errorHandler.js
│   └── validateTokenHandler.js
├── models
│   ├── documentationModel.js
│   ├── groupModel.js
│   ├── studentModel.js
│   └── userModel.js
├── routes
│   ├── documentationRoutes.js
│   └── fileRoutes.js
├── config
│   └── dbConnection.js
├── server.js
└── README.md
```

## Features
- **Documentation Management**: Create, read, update, and delete documentation entries.
- **File Upload and Management**: Upload files using GridFS, retrieve all files, download specific files, and delete files.

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd Students Repo
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Set up your MongoDB connection in the `.env` file.

## Usage
1. Start the server:
   ```
   npm start
   ```
2. Access the API at `http://localhost:5000/api`.

## API Endpoints
### Documentation Endpoints
- `GET /api/documentations`: Retrieve all documentation entries.
- `POST /api/documentations`: Create a new documentation entry.
- `GET /api/documentations/:id`: Retrieve a single documentation entry by ID.
- `PUT /api/documentations/:id`: Update a documentation entry.
- `DELETE /api/documentations/:id`: Delete a documentation entry.

### File Management Endpoints
- `POST /api/files/upload`: Upload a new file.
- `GET /api/files`: Retrieve all uploaded files.
- `GET /api/files/:filename`: Download a specific file.
- `DELETE /api/files/:id`: Delete a specific file.

## Middleware
- **Error Handling**: Custom middleware to handle errors throughout the application.
- **Token Validation**: Middleware to validate user tokens for protected routes.

## Models
- **Documentation Model**: Defines the schema for documentation entries.
- **Group Model**: Defines the schema for groups.
- **Student Model**: Defines the schema for students.
- **User Model**: Defines the schema for users.

## Controllers
- **Documentation Controller**: Handles all operations related to documentation.
- **File Controller**: Manages file uploads and retrievals using GridFS.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License.