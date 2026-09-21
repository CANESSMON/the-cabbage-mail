# ⚙️ System Requirements Specification (SRS) - The Cabbage Mail

## 1. Functional Requirements

### FR-0: User Authentication & Self-Service Registration
- **FR-0.1**: Users can register independently by submitting Full Name, Business Email, Password, and Organization Name.
- **FR-0.2**: Users can log in securely using Email and Password, and log out of active sessions.
- **FR-0.3**: Automatic provisioning of an isolated workspace upon successful registration.
- **FR-0.4**: Session state persistence and protected router navigation.

### FR-1: Workspace & Sender Settings
- **FR-1.1**: User can configure their default Sender Name, Sender Email, and Reply-To Address.
- **FR-1.2**: User can configure AWS SNS / SES credentials or API connection parameters for their workspace.
- **FR-1.3**: Support for updating account profile and organization details.

### FR-2: Subscriber & List Management
- **FR-2.1**: Support creating multiple contact lists per user workspace.
- **FR-2.2**: Allow CSV batch import of subscribers with fields: Email, First Name, Last Name, Custom Tags.
- **FR-2.3**: Allow single subscriber manual add/delete/unsubscribe.

### FR-3: Campaign & Email Builder
- **FR-3.1**: Minimalistic WYSIWYG / HTML email editor.
- **FR-3.2**: Ability to save draft campaigns and select target subscriber list.
- **FR-3.3**: Personalization merge tags (e.g., `{{first_name}}`, `{{unsubscribe_link}}`).

### FR-4: AWS SNS / Cloud Infrastructure Integration
- **FR-4.1**: Integration with AWS SNS (Simple Notification Service) / SES for email message dispatching.
- **FR-4.2**: Handling bounce and complaint notification events via webhooks/topics.
- **FR-4.3**: Environment variable / secure key configuration for AWS credentials.

---

## 2. Non-Functional Requirements
- **NFR-1 (Performance)**: Fast page load (<1.5s) and responsive UI.
- **NFR-2 (Security)**: Password hashing, encrypted storage of tokens/keys, strict tenant data isolation.
- **NFR-3 (Usability)**: Intuitive self-service flow with step-by-step onboarding wizard.
- **NFR-4 (Reliability)**: Asynchronous queue processing for campaign dispatches to prevent web request timeouts.
