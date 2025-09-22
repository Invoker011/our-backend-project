Full-Stack Blog Application

This is a simple full-stack blog application built for learning and experimentation. The app allows users to sign up, log in, and create, edit, and delete posts, which are stored in a database.

Features

Homepage – Introduction to the project

User Authentication – Sign-up and login functionality

Dashboard – Displays all posts created by the user

Post Management

Create a new post

Edit an existing post

Delete a post

Database Integration – All posts are saved and retrieved from the database

Tech Stack

Frontend: EJS Templates, JavaScript

Backend: Node.js, Express.js

Database: (Your DB type, e.g., MongoDB / MySQL – add here)

Hosting

This project was initially hosted on a Linux server using DreamHost. Hosting has been discontinued (it was $5/month). You can still clone the repo and run it locally.

Getting Started
1. Clone the Repository
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>

2. Install Dependencies
npm install

3. Setup Environment

Create a .env file with your database credentials and other required environment variables.
(See .env.example if available.)

Note: The repository is public, but sensitive files (like .env and database files) are already listed in .gitignore.

4. Run the Application
npm start


Visit http://localhost:3000 in your browser.

Important Security Note

For simplicity, passwords are not hashed in the current version.
If you plan to host this application, make sure you enable password hashing for security:

// Example using bcrypt (already included in package.json)
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);


This will protect user data if the application is deployed in production.

Contribution

Feel free to fork this repository, make changes, and submit pull requests.
This project is open-source and meant for learning purposes.

License

This project is available under the MIT License.


This project is available under the MIT License.
