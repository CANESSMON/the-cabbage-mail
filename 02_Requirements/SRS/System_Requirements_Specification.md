# ⚙️ System Requirements Specification (SRS) - The Cabbage Mail

## 1. Functional Requirements

### FR-1: Multi-Client Management (Tenancy)
- **FR-1.1**: Admin can create, edit, deactivate, and view client accounts.
- **FR-1.2**: Each client account must have isolated subscriber lists, templates, and campaign records.
- **FR-1.3**: Support for custom client configuration (Client Name, Sender Email, Sender Name, AWS Region/Topic setup).

### FR-2: Subscriber & List Management
- **FR-2.1**: Support creating multiple contact lists per client.
- **FR-2.2**: Allow CSV batch import of subscribers with fields: Email, First Name, Last Name, Custom Tags.
- **FR-2.3**: Allow single subscriber manual add/delete/unsubscribe.

### FR-3: Campaign & Email Builder
- **FR-3.1**: Minimalistic WYSIWYG / HTML email editor.
- **FR-3.2**: Ability to save draft campaigns and select target subscriber list.
- **FR-3.3**: Variable personalization tags (e.g., `{{first_name}}`, `{{unsubscribe_link}}`).

### FR-4: AWS SNS / Cloud Infrastructure Integration
- **FR-4.1**: Integration with AWS SNS (Simple Notification Service) / SES for email message dispatching.
- **FR-4.2**: Handling bounce and complaint notification events via webhooks/topics.
- **FR-4.3**: Environment variable / secure key configuration for AWS credentials.

---

## 2. Non-Functional Requirements
- **NFR-1 (Performance)**: Fast page load (<1.5s) and responsive UI.
- **NFR-2 (Security)**: Data isolation between onboarded clients; secure storage of API keys/tokens.
- **NFR-3 (Usability)**: Clean, intuitive UI requiring no training.
- **NFR-4 (Reliability)**: Asynchronous queue processing for campaign dispatches to prevent timeouts.
