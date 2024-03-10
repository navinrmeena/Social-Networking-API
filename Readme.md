# Summary of this project

This project is a complex backend project that is built with nodejs, expressjs, mongodb, mongoose, jwt, bcrypt, and many more. This project is a complete backend project that has all the features that a backend project should have.
We are building a complete Social-Networking API with all the features like login, signup, upload video, like, dislike, comment, reply, subscribe, unsubscribe, and many more.

Project uses all standard practices like JWT, bcrypt, access tokens, refresh Tokens and many more. We have spent a lot of time in building this project and we are sure that you will learn a lot from this project.

## Getting Started - Your Project Name Here

This project provides an API for managing users, posts, and following functionalities.

### Prerequisites

- Node.js and npm (or yarn) installed on your system. You can check the versions by running `node -v` and `npm -v` (or `yarn -v`) in your terminal.
- A code editor or IDE of your choice (e.g., Visual Studio Code, WebStorm).

### Installation

1. Clone this repository:

   ```bash
   git clone https://your-github-repo-url.git
   ```

2. Navigate to the project directory:

   ```bash
   cd your-project-name
   ```

3. Install dependencies:

   ```bash
   npm install  # or yarn install
   ```

### Environment Variables

**Important:** Create a `.env` file in the project root directory. This file should contain sensitive information like database connection details and secret keys. **Do not** commit this file to version control.

Here's an example `.env` file:

```
PORT=8000
MONGODB_URI=mongodb+srv://xyz:<passowrd>@cluster0.uxyz2t0.mongodb.net
CORS_ORIGIN=*
ACCESS_TOKEN_SECRTE=l!XtnVIaRKuc-YLBb1Zw/v33O2RkLV0Ml4K9DkOa-7y3hZNsrXfPbD8u0ie8eW1k
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRTE=v3kSWK3A4qLSVM
REFRESH_TOKEN_EXPIRY=10d
JWT_SECRET=JWTS3CR3T


CLOUDINARY_CLOUD_NAME=xxxxxx
CLOUDINARY_API_KEY=xxxxxxxxx

CLOUDINARY_API_SECRET=xxxxxxxxxx

```

**Make sure to replace the placeholders with your actual values.**

### Running the application

1. Start the server:

   ```bash
   npm run dev  # or yarn run dev
   ```

This will start the server and listen for incoming requests on the default port (usually 8000).

### API Documentation

[API Documentation -DOC](https://docs.google.com/document/d/1K1AVEbKZi06Sj2wasWoQdJkSOW4uhp_JyA_H7J6LiaE/edit?usp=sharing)
