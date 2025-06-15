# EasyRunFinal
Final Repository designed to be the second Capstone Project
The App is designed to be a conceptional solution for percieved scheduling issues within a transportation work environment specifically inspired by the challenges faced at JobCorps. The Primary goals  is to provide a centralized workflow  for managing employee schedules and transportation requests, aiming to streamline operations that were inherently decentralized and stricken with a high volume of unorganized requests.
  The application presents a Minimum Viable Product(MVP). While it provides a functional core, some features envisioned for a comprehensive solution have been foundationalized for future iterations but were not implemented due to complexity and time constraints.
  ---
Key Features & Functionality
  ---
User Roles and Permissions

The application's access and Functionality are manager-centric imposing distinct limitations on other user roles
  -> Manager: Possesses full administrative control. Managers can:
      -Create, Edit, and Delete Employee profiles
      -Create, Edit, and Delete Schedules.
      -Create, Edit, and Delete Trips.
      -Create, Edit, and Delete Trip-Requests.
  -> Counselor: Focused on client/student management.Counselors can:
      -View Schedules, Employees, and Trips.
      -Create Trip Requests. But cannot Edit them
      -Cannot edit, delete, or create other elements(Schedules, Employees, Trips)
  -> Security and Transportation Personnel: Primarily have access for Operational Awareness and contact info
    -View Schedules, Employees, Trips.
    -They cannot create, edit, or delete any elements
  ---
Core WorkFlow
  ---
Work flow for the app proceeds as follows.

Step 1-> Seed File used to create a 'Throw Away' Manager profile for initial startup and configuration. this profile is simply labeled and simply passworded to allow the user to create a manager account with beefier security measures such as a better password.
Step 2-> The manager (under their new profile) logs in and creates Employees which become viewable on the Employee page. The manager then can use the employee to create a schedule for said employee and edit or delete profiles. 

Step 3-> Scheduling a Trip can be done by both the manager or counselor (if manager has created that profile). The manager can look at scheduled employees and approve or deny the trip and puts it in on the Trip form to formally create the trip. For this MVP, while it is assumed at a more developed stage that multiple managers will use the system to input trips and can have multiple managers, the initial setup encourages a single manager account for simplicity

Step 4-> Finalizing the Trip. The Manager finalizes the Trip by inputing the time and destination into the Trip Form which allows the Trip to be viewed by all personnell as a formal task.

The Manager as mentioned before can create Trip-Requests (multiple managers can operate and approve trip requests, but for the sake of the MVP it assumed a single manager account will be created). The trip requests can be viewed as of right now and used to create a trip.
In future iterations will allow the manager to edit and delete trip-requests to fit the situation or to help clean the database to avoid clutter.

  ---
Technical Stack
  ---
Backend:
-Node.js: JavaScript runtime Environment
-Express.js: Web application framework for building RESTful APIS
-JSON Web Tokens(JWT): For secure user authentication
-Bcrypt: For password hashing and security
-nodemon: Development utility for automatic server restarts

Frontend:
-React.js: Javascript library for building user interfaces.
-Vite: Fast frontend build tool
-React Router DOM: For client-side routing.
-Axios: Promise-based HTTP client for API requests.
-Context API: For global state management(e.g., authentication).

  ---
Testing
  ---
  Tests for this application are distributed across both the frontend and backend.
    -Backend Testing
      Utilizes Jest and Supertest for framework and making HTTP assertions
    -Frontend Testing: Employs Jest as the test Runner and React Test Library. This is       meant to simulate user interaction
    -Manual/Exploratory Test: Directly testing by interacting with the app UX/UI.

Future Project Development and Cut out Features

(The first is the ability for the manager to edit or delete the Trip-Request, Schedules, and Trips created. These weren't added due to complexity and time constraints but are fully intended to be within the project)

(On the Back end Twilio functionality was added but not implemented on the front end. This was due to a lack of ability to apply the function in a testable, stable way as well as time constraints. This will be added in future iterations. It is intended that the manager will be able to message updates to the transportation worker regarding updates, cancellations and other pertinent information regarding a trip).

(The use of a map function to help develop a projected ETA for Transportation Workers to reach a Destination and return).

(A pool function where the Employee is able to be assigned to runs and mark their available or unavailable status dynamically did not make it in there due to time constraints).








