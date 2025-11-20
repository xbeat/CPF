# CPF Indicator Card Editor

## 1. Purpose of the Tool

This tool provides a web-based interface for editing the indicator cards of the Cognitive Penetration Framework (CPF).

The goal is to simplify the process of modifying and updating the JSON files for these cards while ensuring a secure and traceable workflow through GitHub integration.

## 2. The Modification Workflow

To ensure maximum security and version control, this editor **never directly modifies** the main branch of the repository. Instead, it follows a "proposal" workflow:

1.  **Loading**: The editor reads and displays the list of cards from the `main` branch of the configured GitHub repository, excluding any cards already in the proposal stage.
2.  **Editing**: The user selects a card, modifies its fields through a dedicated form, and sees a real-time preview of the changes.
3.  **Saving as a Proposal**: When the "Save" button is pressed, the system:
    a.  Prompts the user for an identifier (e.g., their name or initials).
    b.  Creates a **new branch** on the GitHub repository with a unique name (e.g., `proposal-indicator_1.1-user-1678886400000`).
    c.  Commits the modified card to this new branch, placing it inside a `proposals/` sub-directory.
4.  **Manual Review**: At this point, the editor's job is done. A repository administrator can go to GitHub, see the new branch, open a Pull Request, review the changes, and decide whether to approve and merge them into the `main` branch.

## 3. Environment Setup

Before you can use the editor, you must configure your local environment.

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your system.

### Step 1: Install Dependencies

Open a terminal in the `dashboard/` directory and run the following command:

```bash
npm install
```

This command will install all the necessary libraries for the server to run, including those for communicating with GitHub.

### Step 2: Create a GitHub Personal Access Token (PAT)

The server needs to authenticate with GitHub to read from and write to your repository.

1.  **Go to GitHub** and navigate to your account settings.
2.  Go to `Developer settings` > `Personal access tokens` > `Tokens (classic)`.
3.  Click **"Generate new token"** (or "Generate new token (classic)").
4.  Give the token a descriptive name (e.g., "CPF Card Editor").
5.  Set an **expiration date** (recommended for security).
6.  In the **"Select scopes"** section, check the **`repo`** box. This grants the token the necessary permissions to read files and create branches.
    ![GitHub Token Scope](https://i.imgur.com/i4m5tJj.png)
7.  Click **"Generate token"** and **copy the token immediately**. You will not be able to see it again.

> For a detailed guide from GitHub, [click here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).

### Step 3: Create the Configuration File

In the `dashboard/` directory, you will find a template file named `.env.github.example`.

1.  Create a copy of this file and name it `.env.github`.
2.  Open the `.env.github` file in a text editor and fill in the variables:

```env
# Your GitHub username or the organization that owns the repository
GITHUB_OWNER=your-github-username

# The exact name of the repository containing the indicator cards
GITHUB_REPO=your-repository-name

# The Personal Access Token (PAT) you just created
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Important**: The `.env.github` file contains sensitive credentials. It is already included in the `.gitignore` file to prevent it from being accidentally committed, but always ensure it is kept private.

## 4. Launching and Using the Editor

Once the setup is complete, you are ready to start.

1.  **Start the Server**: From your terminal, in the `dashboard/` directory, run:
    ```bash
    node server.js
    ```
2.  **Open the Editor**: Open your web browser and navigate to:
    [http://localhost:3000/dashboard/card-editor/](http://localhost:3000/dashboard/card-editor/)

3.  **Use the Interface**:
    - On the left, you will see the list of cards loaded from your repository.
    - Click a card to load it into the central editor.
    - Modify the fields as needed. The preview on the right will update in real-time.
    - When you are satisfied, click the **"Save"** button. You will be prompted for a name to identify your proposal, which will be used in the new branch name.
