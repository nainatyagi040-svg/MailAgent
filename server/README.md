## MailPilot Backend API Specification

This folder (`/server`) contains the Express backend for MailPilot.

### How to run
1. Copy `.env.example` to `.env` and fill in the values.
2. Run `npm install`
3. Run `npm start` (or `node index.js`)

### Frontend API Connections

To wire up the frontend to this backend, you will need to point your frontend API calls to `http://localhost:3001` (or your deployed URL). Here is the expected shape of the primary endpoints:

#### 1. Generate Task
- **URL**: `POST /api/agent/task`
- **Request Body**:
  ```json
  {
    "taskText": "Email Sarah and ask if she's free tomorrow",
    "userId": "uuid-from-auth"
  }
  ```
- **Response** (Success): Returns the created draft (`draft.id`).
- **Response** (Needs Email): If `needsEmailPrompt: true` is returned, prompt the user for an email address.

#### 2. Send Draft (Starts 30s Window)
- **URL**: `POST /api/agent/send`
- **Request Body**:
  ```json
  {
    "draftId": "uuid",
    "userId": "uuid-from-auth"
  }
  ```
- **Behavior**: The backend will wait 30 seconds before firing Mailtrap.

#### 3. Undo Send
- **URL**: `POST /api/agent/undo`
- **Request Body**:
  ```json
  {
    "draftId": "uuid",
    "userId": "uuid-from-auth"
  }
  ```

#### 4. Fetch Activity
- **URL**: `GET /api/activity?userId=uuid-from-auth`
- **Response**: Array of activity objects joined with draft details.

#### 5. Fetch Analytics
- **URL**: `GET /api/analytics?userId=uuid-from-auth`
- **Response**: `{ totalSent: 10, totalPending: 2, sendsByDay: { "2023-10-01": 5 } }`
