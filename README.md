How to run the application

1. Install all dependencies in backend
2. Install all dependencies in frontend
3. Change the db path/url in .env
4. Go to frontend and run the command:- npm run dev




## Docker Setup (PostgreSQL + pgAdmin)
To install the database instance + GUI:

1 - Install docker and docker compose.
More infos in:
- https://medium.com/@tomer.klein/step-by-step-tutorial-installing-docker-and-docker-compose-on-ubuntu-a98a1b7aaed0
- https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04

   The installation diverge if you are in Mac, windows or linux. Depending on your SO, you will need to follow different tutorials.

2 - With docker and docker compose installed, run thw following command in the root folder:
   ```
   docker compose up -d
   ```
   This command will:
   - Pull postgreSQL and pgAdmin images from dockerhub
   - Create and start the containers in detached mode (without use your terminal).

3 - Access pgAdmin GUI
   Open your browser and go to:
   http://localhost:5050.
  The login credentials (email & password) for pgAdmin are defined in the .env file.

4 - Locate Your Tables in pgAdmin
   Inside pgAdmin, follow this path to explore your database tables:
   servers > catalog > databases > catalog > schemas > public > tables

   If you do not have the server, you need to register a new one.
   port: 5432
   host: postgres
   user: <POSTGRES_USER> (from .env)
   password: <POSTGRES_PASSWORD> (from .env)
   name: catalog

   Open the SQL Tool (Right click in databases and go to SQL Tool) and run the schema_v2.sql to
   create the tables.

5 - Stop the Containers
   To stop and remove the containers:
   ```
   docker compose down
   ```
### OBS:
I recommend installing the docker extension in vscode for easier container management than command line.