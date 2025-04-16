How to run the application

Step 1: install all dependencies in backend
Step 2: install all dependencies in frontend
step 3: change the db path/url in .env
step 4: go to frontend and run the command:- npm run dev




## Docker Setup (PostgreSQL + pgAdmin)

To install the database instance + GUI:

1. Start Docker Containers
   From the project root directory, run:
   ```
   docker compose up -d
   ```
   This command will:
   - Pull postgreSQL and pgAdmin images from dockerhub
   - Create and start the containers in detached mode (without use your terminal).

2. Access pgAdmin GUI
   Open your browser and go to:
   http://localhost:5050.
  The login credentials (email & password) for pgAdmin are defined in the .env file.

3. Locate Your Tables in pgAdmin
   Inside pgAdmin, follow this path to explore your database tables:
   Servers > catalog > Databases > catalog > Schemas > public > Tables

4. Stop the Containers
   To stop and remove the containers:
   ```
   docker compose down
   ```

obs:
- I recommend installing the docker extension in vscode for easier container management than command line.