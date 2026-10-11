# CareFlow — Hospital Appointment & Patient Queue Management System

CareFlow is a full-stack hospital appointment and patient queue management system designed to simplify appointment scheduling, patient check-in, queue tracking, and consultation management.

The platform connects patients, doctors, and administrators through a centralized system that improves patient flow, reduces unnecessary waiting, and makes hospital operations more organized.

## Problem Statement

Traditional hospital appointment systems often focus on scheduling without providing an integrated way to manage patient check-in, queue positions, consultation progress, and waiting times. This can lead to long waiting periods, inefficient patient flow, and difficulties managing daily appointments.

## Solution

CareFlow integrates appointment scheduling, patient check-in, queue management, consultation tracking, and in-app notifications into one platform. Role-based access ensures that patients, doctors, and administrators can access the features relevant to their responsibilities.

## Key Features

### Patient Features

- User registration and login
- JWT-based authentication
- Book appointments with available doctors and services
- Select available appointment dates and time slots
- View, update, and cancel appointments
- Check in for scheduled appointments
- Receive queue numbers after check-in
- Track queue positions and patients ahead
- View estimated waiting times
- Receive in-app notifications about queue progress and consultation turns

### Doctor Features

- Secure doctor authentication
- View and manage daily patient queues
- Call the next waiting patient
- Skip patients when necessary and handle skipped patients according to queue rules
- Start and complete consultations
- Track patient progress through queue and consultation statuses

### Administrator Features

- View hospital statistics through an administrative dashboard
- Manage departments, doctors, staff, and services
- View and manage patient information
- View and filter appointments
- Monitor hospital resources and appointment activity

### Queue Management

- Automatic queue number assignment during check-in
- Queue ordering based on check-in order and queue rules
- Track waiting, called, in-progress, skipped, and completed statuses
- Calculate the number of patients ahead
- Estimate waiting times
- Update queue status as consultations progress

### Notifications

- Check-in confirmations
- Queue progress updates
- Notifications when a patient's turn approaches
- Doctor call notifications

## Queue Workflow

1. Patient books an appointment.
2. Patient arrives at the hospital.
3. Patient checks in.
4. The system assigns a queue number.
5. Patient waits and monitors queue progress.
6. Doctor calls the patient.
7. Consultation begins.
8. Doctor completes the consultation.

Skipped patients are handled according to the queue management rules.

## Technology Stack

### Frontend

- React
- JavaScript
- Vite
- Tailwind CSS
- Axios
- React Router
- Lucide React

### Backend

- Python
- Django
- Django REST Framework
- Django REST Framework Simple JWT

### Database

- PostgreSQL

### Development and Testing

- Git and GitHub
- Visual Studio Code
- Postman
- Django REST Framework Browsable API

## System Architecture

CareFlow follows a client-server architecture consisting of three main layers.

### Frontend

The React frontend provides dedicated interfaces for patients, doctors, and administrators. It communicates with the backend through HTTP requests to RESTful API endpoints.

### Backend

The Django REST Framework backend handles authentication, appointment scheduling, patient check-in, queue management, consultation tracking, notifications, and hospital administration.

### Database

PostgreSQL stores application data, including user accounts, doctors, services, departments, appointments, queue records, and notifications.

JWT authentication protects authorized resources, while role-based permissions control access to application features.

## Project Structure

The project is organized into separate frontend and backend applications.

```text
care-flow/
├── backend/
│   ├── accounts/
│   ├── appointments/
│   ├── queue_management/
│   ├── notifications/
│   ├── careflow/
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

The directory structure above is illustrative. Actual directory and file names may vary depending on the repository configuration.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Python
- Node.js and npm
- PostgreSQL
- Git

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/Idahk19/care-flow.git
cd care-flow
```

#### 2. Set Up the Backend

Navigate to the backend directory:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv my_env
```

Activate the virtual environment on Windows:

```bash
my_env\Scripts\activate
```

On macOS or Linux:

```bash
source my_env/bin/activate
```

Install the backend dependencies:

```bash
pip install -r requirements.txt
```

#### 3. Configure Environment Variables

Create a `.env` file in the backend directory and configure the environment variables required by your Django settings.

Typical configuration includes:

- Django secret key
- Debug mode
- Database connection settings
- Allowed hosts
- Other required application settings

Never commit your `.env` file or production credentials to GitHub.

#### 4. Configure the Database

Create a PostgreSQL database and update the database configuration to match your environment.

Apply the database migrations:

```bash
python manage.py migrate
```

Create an administrator account if required:

```bash
python manage.py createsuperuser
```

Start the Django development server:

```bash
python manage.py runserver
```

The backend will typically be available at `http://127.0.0.1:8000/`.

#### 5. Set Up the Frontend

Open a separate terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install the frontend dependencies:

```bash
npm install
```

Configure the frontend API base URL using the environment variable expected by your Axios configuration.

Start the development server:

```bash
npm run dev
```

Open the local frontend URL displayed by Vite in your browser.

### Configuration Notes

- Ensure the frontend API URL points to the correct backend address.
- Configure the database connection before running migrations.
- Verify that the backend's CORS settings allow requests from the frontend origin.
- Use environment variables for sensitive configuration.
- Refer to the existing project settings for the exact environment variable names and directory structure.

## API Overview

The backend exposes RESTful API endpoints for the application's main functionality.

| Feature | Description |
|---|---|
| Authentication | User registration, login, and JWT authentication |
| Appointments | Booking, viewing, updating, and cancelling appointments |
| Queue Management | Patient check-in, queue assignment, and status updates |
| Doctor Operations | Queue handling and consultation management |
| Notifications | Retrieving notifications and tracking queue updates |
| Departments | Managing hospital departments |
| Doctors | Managing doctor information |
| Services | Managing hospital services |
| Administration | Dashboard statistics and appointment oversight |

The exact endpoint paths depend on the Django URL configuration.

Authenticated requests use JWT access tokens in the authorization header. Protected endpoints enforce the permissions configured by the backend.

The Django REST Framework Browsable API and Postman can be used to inspect and test available endpoints.

## Authentication and Security

CareFlow uses JSON Web Tokens through Django REST Framework Simple JWT to authenticate API requests.

The authentication workflow includes:

1. The user registers or logs in.
2. The backend validates the user's credentials.
3. The backend returns authentication tokens and relevant user information.
4. The frontend includes the access token in authenticated API requests.
5. The backend validates tokens and applies the appropriate permissions.

Role-based access control separates patient, doctor, and administrator functionality.

Production deployments should use secure configuration, appropriate token handling, restricted CORS origins, valid allowed hosts, and `DEBUG=False`.

## Testing

### Backend Testing

Run the Django automated test suite:

```bash
python manage.py test
```

### API Testing

Use Postman or the Django REST Framework Browsable API to test:

- User registration and login
- JWT authentication
- Protected endpoints and role-based permissions
- Appointment booking and cancellation
- Appointment slot availability
- Patient check-in and queue number assignment
- Queue ordering and status transitions
- Doctor queue actions
- Consultation completion
- Notification creation and retrieval

### Frontend Testing

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Deployment

CareFlow supports separate frontend and backend deployments.

### Backend Deployment

The Django backend can be deployed to a Python-compatible hosting platform such as Render.

Deployment requirements include:

- Configure production environment variables.
- Connect a PostgreSQL database.
- Set `DEBUG=False`.
- Configure `ALLOWED_HOSTS`.
- Configure CORS for the deployed frontend.
- Apply database migrations.
- Configure static file handling.
- Use a production WSGI server such as Gunicorn.

### Frontend Deployment

The React frontend can be deployed to a static hosting platform such as Vercel.

Before deployment:

- Configure the production API base URL.
- Install dependencies and verify the production build.
- Ensure the backend permits requests from the deployed frontend domain.
- Verify that application routes work correctly after deployment.

## Future Improvements

Potential improvements for future versions include:

- Appointment reminders before scheduled visits
- More accurate waiting-time predictions using historical consultation data
- Live queue updates without manual page refreshes
- Enhanced analytics for hospital administrators
- Improved accessibility and mobile responsiveness

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Author

**Idah Karwitha**

Full-Stack Developer

- GitHub: [@Idahk19](https://github.com/Idahk19)
- Repository: [CareFlow](https://github.com/Idahk19/care-flow)

## Acknowledgements

CareFlow was developed as a software project to explore full-stack web development, REST API design, authentication, appointment scheduling, and patient queue management.