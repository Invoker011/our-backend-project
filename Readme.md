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

Would you like me to include a section with screenshots (placeholders you can later replace) so the README looks more professional when someone views your repo on GitHub?

You said:
Database used in SQLlite
ChatGPT said:

Perfect — let’s update the README to mention SQLite as the database.
Here’s the improved version with that included (and I also added a placeholder section for screenshots, so your README looks polished on GitHub):

Full-Stack Blog Application

This is a simple full-stack blog application built for learning and experimentation. The app allows users to sign up, log in, and create, edit, and delete posts, which are stored in a SQLite database.

Features

Homepage – Introduction to the project

User Authentication – Sign-up and login functionality

Dashboard – Displays all posts created by the user

Post Management

Create a new post

Edit an existing post

Delete a post

Database Integration – Posts are stored and retrieved from a SQLite database

Tech Stack

Frontend: EJS Templates, JavaScript

Backend: Node.js, Express.js

Database: SQLite

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

Note: The repository is public, but sensitive files (like .env and SQLite database files) are already listed in .gitignore.

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

Screenshots

You can add screenshots here for better understanding:

Homepage

Dashboard

Create Post

Edit/Delete Post

Contribution

Feel free to fork this repository, make changes, and submit pull requests.
This project is open-source and meant for learning purposes.

License

This project is available under the MIT License.

Would you like me to add a “Future Improvements” section (e.g., password hashing, better UI, user roles, pagination) to show that you plan to enhance it further? This usually makes a README look more professional and signals active development.

You said:
Linus Ubuntu 
ChatGPT said:

Got it — you want to clearly mention that you hosted it on Linux (Ubuntu).
Here’s the polished final version of your README with Ubuntu + SQLite explicitly stated and a new Future Improvements section added (this will make your project look more complete and professional):

Full-Stack Blog Application

This is a simple full-stack blog application built for learning and experimentation. The app allows users to sign up, log in, and create, edit, and delete posts, which are stored in a SQLite database.

Features

Homepage – Introduction to the project

User Authentication – Sign-up and login functionality

Dashboard – Displays all posts created by the user

Post Management

Create a new post

Edit an existing post

Delete a post

Database Integration – Posts are stored and retrieved from a SQLite database

Tech Stack

Frontend: EJS Templates, JavaScript

Backend: Node.js, Express.js

Database: SQLite

Environment: Linux (Ubuntu)

Hosting

This project was initially hosted on a Linux (Ubuntu) server using DreamHost.
Hosting has been discontinued (it was $5/month). You can still clone the repo and run it locally.

Getting Started
1. Clone the Repository
git clone https://github.com/Invoker011/our-backend-project.git

2. Install Dependencies
npm install

3. Setup Environment

Create a .env file with your database credentials and other required environment variables.
(See .env.example if available.)

Note: The repository is public, but sensitive files (like .env and SQLite database files) are already listed in .gitignore.

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


Future Improvements

Add password hashing & authentication security (bcrypt already included)

Implement user roles (admin / regular user)

Add pagination or search for posts

Improve UI/UX with modern styling

Containerize with Docker for easy deployment

Contribution

Feel free to fork this repository, make changes, and submit pull requests.
This project is open-source and meant for learning purposes.

License

This project is available under the MIT License.