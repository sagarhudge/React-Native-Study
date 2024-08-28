To create a user login API using Node.js, TypeScript, and MySQL, we will set up a project that handles user roles, user registration (signup), and login. This setup will include separate files for configuration, models, routes, server setup, and environment variables, as well as handle CORS, request-response handling, and proper HTTP status codes.

### Step-by-Step Setup

1. **Initialize the Project:**
   - Create a new directory for the project and initialize it with `npm init`.
   - Install the necessary packages:
     ```bash
     npm install express mysql2 dotenv bcrypt jsonwebtoken cors
     npm install --save-dev typescript ts-node @types/node @types/express
     ```

2. **Configure TypeScript:**
   - Initialize TypeScript in your project:
     ```bash
     npx tsc --init
     ```
   - Update the `tsconfig.json` file to ensure the settings work well with Node.js:
   ```json
   {
     "compilerOptions": {
       "target": "ES6",
       "module": "commonjs",
       "strict": true,
       "esModuleInterop": true,
       "skipLibCheck": true,
       "forceConsistentCasingInFileNames": true,
       "outDir": "./dist",
       "rootDir": "./src"
     },
     "include": ["src/**/*"],
     "exclude": ["node_modules", "**/*.spec.ts"]
   }
   ```

3. **Project Structure:**
   Your project directory should look like this:
   ```
   /user-login-api
   ├── src
   │   ├── config
   │   │   └── db.ts
   │   ├── controllers
   │   │   └── userController.ts
   │   ├── models
   │   │   └── userModel.ts
   │   ├── routes
   │   │   └── userRoutes.ts
   │   ├── middleware
   │   │   └── errorMiddleware.ts
   │   └── server.ts
   ├── .env
   ├── package.json
   └── tsconfig.json
   ```

4. **Create the Files:**

   - **`src/config/db.ts`:** Database connection setup.
   ```typescript
   import mysql from 'mysql2';

   const connection = mysql.createConnection({
     host: process.env.DB_HOST,
     user: process.env.DB_USER,
     password: process.env.DB_PASS,
     database: process.env.DB_NAME
   });

   connection.connect((err) => {
     if (err) {
       console.error('Database connection failed: ' + err.stack);
       return;
     }
     console.log('Connected to MySQL database.');
   });

   export default connection;
   ```

   - **`src/models/userModel.ts`:** User model interface.
   ```typescript
   export interface User {
     id?: number;
     username: string;
     email: string;
     password: string;
     role: 'admin' | 'user';
   }
   ```

   - **`src/controllers/userController.ts`:** Handle request logic.
   ```typescript
   import { Request, Response } from 'express';
   import bcrypt from 'bcrypt';
   import jwt from 'jsonwebtoken';
   import connection from '../config/db';
   import { User } from '../models/userModel';

   // User Registration (Signup)
   export const registerUser = async (req: Request, res: Response) => {
     const { username, email, password, role } = req.body as User;
     try {
       // Check if user exists
       connection.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
         if (results.length > 0) return res.status(400).json({ message: 'User already exists' });

         // Hash password
         const hashedPassword = await bcrypt.hash(password, 10);
         const newUser: User = { username, email, password: hashedPassword, role };

         // Insert new user
         connection.query('INSERT INTO users SET ?', newUser, (err) => {
           if (err) throw err;
           res.status(201).json({ message: 'User registered successfully' });
         });
       });
     } catch (error) {
       res.status(500).json({ message: 'Server error' });
     }
   };

   // User Login
   export const loginUser = async (req: Request, res: Response) => {
     const { email, password } = req.body as User;
     try {
       connection.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
         if (results.length === 0) return res.status(404).json({ message: 'User not found' });

         const user = results[0] as User;
         const isPasswordValid = await bcrypt.compare(password, user.password);
         if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

         const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
         res.status(200).json({ message: 'Login successful', token });
       });
     } catch (error) {
       res.status(500).json({ message: 'Server error' });
     }
   };
   ```

   - **`src/routes/userRoutes.ts`:** Define routes for user-related actions.
   ```typescript
   import express from 'express';
   import { registerUser, loginUser } from '../controllers/userController';

   const router = express.Router();

   router.post('/register', registerUser);
   router.post('/login', loginUser);

   export default router;
   ```

- **`src/middleware/errorMiddleware.ts`:** Custom error handling middleware.
   ```typescript
   import { Request, Response, NextFunction } from 'express';

   export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
     const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
     res.status(statusCode).json({
       message: err.message,
       stack: process.env.NODE_ENV === 'production' ? null : err.stack,
     });
   };
   ```

- **`src/server.ts`:** Main server file to configure Express and middleware.
   ```typescript
   import express, { Application } from 'express';
   import dotenv from 'dotenv';
   import cors from 'cors';
   import userRoutes from './routes/userRoutes';
   import { errorHandler } from './middleware/errorMiddleware';
   import connection from './config/db';

   dotenv.config();

   const app: Application = express();

   // Middleware
   app.use(cors());
   app.use(express.json());

   // Routes
   app.use('/api/users', userRoutes);

   // Error Handling Middleware
   app.use(errorHandler);

   const PORT = process.env.PORT || 5000;

   // Start the server
   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
   ```

- **`.env`:** Environment variables for database configuration and JWT secret.
   ```
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=yourpassword
   DB_NAME=yourdbname
   JWT_SECRET=yourjwtsecret
   NODE_ENV=development
   ```

### 5. **Database Setup:**

Ensure your MySQL database is set up with the correct user table:

Run the following SQL to create the `users` table:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6. **Run the Server:**

Compile the TypeScript files and start the server:

```bash
npx tsc  # Compile TypeScript to JavaScript
node dist/server.js  # Run the compiled server
