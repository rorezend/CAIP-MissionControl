# SPEC.md — CAIP Mission Control

---

## 1. Title & Executive Summary

**CAIP Mission Control** is a team-shared web application designed for CAIP (Customer-focused Account Intelligence & Partnership) teams to capture, organize, and act on account activity — and to generate a polished executive newsletter with minimal manual effort.

**Who it's for:**
- Primary: CAIP team members who manage enterprise accounts collaboratively
- Secondary: Executives and leadership who consume the weekly newsletter
- Tertiary (future): Managers and directors who need cross-team rollups and reporting

**Why it matters:**
Today, CAIP teams track account activity in scattered tools — email threads, chat messages, personal notes, spreadsheets, and CRM fields. This fragmentation makes it nearly impossible to answer: *"What happened this week that actually matters, who owns the next step, and how do we tell that story to leadership?"* CAIP Mission Control creates a single, shared system of record that enforces clarity, accountability, and executive-quality storytelling as first-class outputs.

---

## 2. Executive TL;DR

- **Business value:** Shared visibility into account health, risk, and wins across the full CAIP team reduces blind spots and accelerates customer outcomes.
- **Team impact:** Team members spend less time reconstructing what happened and more time on high-value customer work; follow-up accountability improves measurably.
- **Exec storytelling:** An executive-ready weekly newsletter is generated in minutes rather than hours, built directly from the team's logged activity.
- **Single system of record:** Replaces fragmented tracking across tools with one authoritative, searchable feed of account activity.
- **Risk reduction:** Explicit importance scoring and risk tagging surface critical issues before they escalate.

---

## 3. Context & Why the Current Process Fails

### Fragmentation
Activity lives in Slack, email, Salesforce notes, Confluence pages, personal notebooks, and calendar invites. No single place shows what the team collectively did or needs to do for any given account this week.

### Manual effort
The weekly executive update requires one or more team members to manually gather information from all those sources, de-duplicate, write narrative summaries, and format an email. This takes 2–4+ hours per cycle and is error-prone.

### Missed follow-ups
Follow-up items are captured inconsistently — sometimes in meeting notes, sometimes not at all. Ownership is often implicit rather than explicit, leading to items falling through the cracks.

### Inconsistent exec storytelling
Without a structured template or shared data source, the weekly newsletter varies in tone, completeness, and emphasis. Leadership cannot rely on it as a consistent source of truth about what's happening across accounts.

---

## 4. Target Users & Personas

### Primary: CAIP Team Members
- Engineers, account managers, and technical program managers who attend customer meetings, deliver workshops, run exec briefings, and drive internal coordination across accounts.
- **Needs:** A fast, low-friction way to log what they did, why it matters, and what needs to happen next — and to see what teammates have logged.
- **Key pain:** Currently juggle multiple tools with no shared system.

### Secondary: Exec Peers / Leadership
- VPs, Directors, and exec stakeholders who consume the weekly newsletter.
- **Needs:** A concise, outcome-focused digest of what happened, what's at risk, and what the team needs from them.
- **Key pain:** Inconsistent updates that require follow-up to understand the real picture.

### Tertiary (Future): Managers / Directors
- Leaders who want roll-up views across multiple CAIP teams or portfolios.
- **Needs:** Aggregated metrics, account health indicators, team activity trends.
- **Note:** This persona is out of scope for MVP but must be designed for.

---

## 5. Goals & Non-Goals

### Goals

1. **Team-shared activity tracking** — Any team member can log activity for any account; all teammates see the shared feed.
2. **Importance & impact scoring** — Activities carry a structured score so the team can filter by what truly matters.
3. **Follow-up accountability** — Every follow-up has an owner, a due date, and a status; overdue items are surfaced prominently.
4. **Weekly executive newsletter generation** — The system drafts a newsletter from logged activity with minimal manual editing.
5. **Clarity over automation** — The system enhances human judgment; it does not attempt to replace it.

### Non-Goals

- **Full CRM replacement** — CAIP Mission Control is not a Salesforce alternative; it complements existing CRM tools.
- **Heavy workflow automation (MVP)** — No automated email sending, no real-time integrations, no AI models in MVP.
- **Personal to-do management** — This is a team tool, not an individual task manager.
- **Billing or contract management** — Out of scope entirely.

---

## 6. Scope Definition

### MVP (Must Have)

| # | Feature |
|---|---------|
| 1 | Shared account registry — create/edit accounts visible to all team members |
| 2 | Shared activity feed — log internal and external activities against accounts |
| 3 | Importance tagging — mark activities with importance level and impact type |
| 4 | Follow-up management — create follow-ups with owner, due date, and status |
| 5 | Newsletter draft generation — produce a structured draft from the week's high-importance activities |
| 6 | Basic user roles — Admin, Contributor, Viewer |
| 7 | Search and filter — filter activities and follow-ups by account, date, importance, and status |
| 8 | CSV and Markdown export for newsletter and activity data |

### Phase 2 / Later

| # | Feature |
|---|---------|
| 1 | Calendar integration — pull meeting metadata automatically |
| 2 | Email integration — log customer emails as activities |
| 3 | CRM integration — sync account data from Salesforce / HubSpot |
| 4 | Notes integration — pull Confluence / Notion pages as activity artifacts |
| 5 | AI-assisted summarization — auto-generate activity summaries and newsletter bullets |
| 6 | Cross-team rollup views — aggregate data across multiple CAIP teams |
| 7 | Notifications and reminders — Slack/email alerts for overdue follow-ups |
| 8 | Mobile-optimized native experience |

---

## 7. Key Team User Journeys

### Journey 1: Log an Activity
1. Team member navigates to **Activities → New Activity**.
2. Selects one or more accounts.
3. Chooses activity type (e.g., Customer Meeting, Internal Sync, Workshop, Exec Briefing).
4. Enters a title, a brief description, and the date.
5. Adds contributors (team members and/or external contacts).
6. Sets importance level (Low / Medium / High / Critical) and impact type (Revenue, Risk, Relationship, Technical).
7. Toggles **Exec Visibility** if this should appear in the newsletter.
8. Saves. Activity appears immediately in the shared feed.

### Journey 2: Create and Assign a Follow-Up
1. Team member opens an existing activity.
2. Clicks **Add Follow-Up**.
3. Enters the follow-up title, description, owner (team member), and due date.
4. Sets status: **Open**.
5. Saves. Follow-up appears in the shared follow-ups tracker and on the owner's dashboard.

### Journey 3: Generate the Weekly Newsletter
1. Newsletter editor navigates to **Newsletter → New Issue**.
2. Selects the time window (default: last 7 days).
3. System pre-populates sections with activities and follow-ups that meet inclusion thresholds (see Section 10).
4. Editor reviews, edits, promotes, or removes items from each section.
5. Adds any manual highlights or asks.
6. Previews the newsletter in exec-ready format.
7. Exports as Markdown or copies rich text for email.

### Journey 4: Review the Shared Activity Feed
1. Team member opens the **Activity Feed** view.
2. Filters by account, contributor, date range, importance, or activity type.
3. Reviews what teammates have logged; adds comments or follow-ups to existing activities.
4. Identifies gaps (accounts with no recent activity) and logs new activities accordingly.

### Journey 5: Track Follow-Up Completion
1. Team member opens the **Follow-Ups** view.
2. Views all open follow-ups, sortable by due date, owner, and account.
3. Updates the status of their own follow-ups (Open → In Progress → Done).
4. Admin can reassign overdue follow-ups.

---

## 8. Functional Requirements

### A. Teams & Accounts

| ID | Requirement |
|----|-------------|
| A1 | The system shall support a single team workspace shared by all team members. |
| A2 | Admins shall be able to create, edit, and archive accounts. |
| A3 | Each account shall have: name, description, tier (Strategic / Standard / Emerging), primary owner (team member), and status (Active / At Risk / Churned / Prospect). |
| A4 | Accounts shall display a summary panel showing recent activities, open follow-ups, and last activity date. |
| A5 | Archived accounts shall be hidden from default views but searchable and restorable. |

### B. Activities

| ID | Requirement |
|----|-------------|
| B1 | Any team member shall be able to create an activity. |
| B2 | Activities shall be associated with at least one account. |
| B3 | Activity types shall include: Customer Meeting, Internal Sync, Workshop, Exec Briefing, Email Thread, Phone Call, Deliverable Submitted, Other. |
| B4 | Activities shall capture: title (required), description (optional, rich text), date (required), type (required), direction (Internal / External / Both), contributors (one or more team members), and external participants (optional free-text names). |
| B5 | Activities shall support file or URL attachments (links only in MVP; file upload in Phase 2). |
| B6 | Activities shall be editable by any Contributor or Admin; edits are audited. |
| B7 | Activities shall support free-form tags (e.g., "Q2 QBR", "renewal risk"). |
| B8 | The activity feed shall be sorted by date descending by default. |

### C. Importance / Impact Controls

| ID | Requirement |
|----|-------------|
| C1 | Each activity shall have an **Importance** field: Low, Medium, High, Critical (required; default Medium). |
| C2 | Each activity shall have an **Impact Type** field (multi-select): Revenue, Risk Mitigation, Relationship, Technical Delivery, Strategic. |
| C3 | Each activity shall have an **Exec Visibility** toggle (boolean; default off). When toggled on, the activity is a candidate for the newsletter. |
| C4 | The system shall compute an **Importance Score** (1–10) based on the scoring model defined in Section 11. The score shall be displayed but non-blocking. |
| C5 | Activities with Importance = Critical shall be highlighted visually in the feed. |
| C6 | The feed shall be filterable by Importance, Impact Type, and Exec Visibility. |

### D. Follow-Ups & Ownership

| ID | Requirement |
|----|-------------|
| D1 | Follow-ups shall be creatable from any activity or from the global Follow-Ups view. |
| D2 | Each follow-up shall have: title (required), description (optional), owner (required — exactly one team member), due date (required), status (Open / In Progress / Done / Cancelled), and linked activity (optional). |
| D3 | Follow-up status shall be updatable by the owner or any Admin. |
| D4 | The Follow-Ups view shall display all open follow-ups with visual indicators for: overdue (past due date), due today, and due this week. |
| D5 | Follow-ups shall be filterable by owner, account, status, and due date range. |
| D6 | Overdue open follow-ups shall appear in the next newsletter draft as a **Risks & Blockers** candidate. |

### E. Newsletter Builder

| ID | Requirement |
|----|-------------|
| E1 | Admins and designated Contributors shall be able to create a new newsletter issue. |
| E2 | The system shall generate a draft from activities and follow-ups meeting inclusion thresholds (see Section 10). |
| E3 | The newsletter builder shall present each default section (see Section 10) with pre-populated candidate items. |
| E4 | Editors shall be able to promote items into sections, remove items, reorder items within a section, and add free-text bullets. |
| E5 | Each newsletter issue shall have a status: Draft, In Review, Published. |
| E6 | Published newsletter issues shall be read-only. |
| E7 | The newsletter shall be exportable as Markdown and as plain-text formatted for email paste. |
| E8 | The system shall retain a history of all published newsletter issues. |
| E9 | Editors shall be able to set the time window for the draft (default: last 7 calendar days). |

### F. Views, Filters, Search

| ID | Requirement |
|----|-------------|
| F1 | A global **Activity Feed** shall show all activities sorted by date with filter controls. |
| F2 | An **Account View** shall show all activities and follow-ups for a single account. |
| F3 | A **Follow-Ups Tracker** shall show all follow-ups with owner, status, due date, and linked account. |
| F4 | A **Dashboard** shall show: total activities this week, open follow-ups, overdue follow-ups, and a link to the latest newsletter draft. |
| F5 | A **Newsletter Archive** shall list all newsletter issues by date with status. |
| F6 | Global search shall search across activity titles, descriptions, account names, follow-up titles, and tags. Results shall link to the source record. |

### G. Permissions & Roles

| ID | Requirement |
|----|-------------|
| G1 | Three roles shall be supported: **Admin**, **Contributor**, **Viewer**. |
| G2 | **Admin**: full access including user management, account management, and newsletter publishing. |
| G3 | **Contributor**: can create and edit activities and follow-ups, update their own follow-up statuses, and contribute to newsletter drafts. Cannot publish a newsletter or manage users. |
| G4 | **Viewer**: read-only access to all content. Cannot create or edit. |
| G5 | All team members default to Contributor on sign-up. |
| G6 | An audit log shall record: who created/edited/deleted each activity, follow-up, and newsletter issue, and when. |

---

## 9. Data Model (Conceptual)

### Team
| Field | Required | Notes |
|-------|----------|-------|
| id | Yes | UUID |
| name | Yes | e.g., "CAIP West" |
| created_at | Yes | timestamp |
| settings | No | JSON blob (newsletter defaults, etc.) |

*Relationships:* has many Users, has many Accounts.

---

### Account
| Field | Required | Notes |
|-------|----------|-------|
| id | Yes | UUID |
| team_id | Yes | FK → Team |
| name | Yes | string |
| description | No | rich text |
| tier | Yes | enum: Strategic, Standard, Emerging |
| status | Yes | enum: Active, At Risk, Churned, Prospect |
| primary_owner_id | Yes | FK → User |
| archived | Yes | boolean, default false |
| created_at | Yes | timestamp |
| updated_at | Yes | timestamp |

*Relationships:* belongs to Team; has many Activities, FollowUps.

---

### Activity
| Field | Required | Notes |
|-------|----------|-------|
| id | Yes | UUID |
| team_id | Yes | FK → Team |
| account_ids | Yes | array of FK → Account (at least one) |
| title | Yes | string |
| description | No | rich text |
| date | Yes | date |
| type | Yes | enum: Customer Meeting, Internal Sync, Workshop, Exec Briefing, Email Thread, Phone Call, Deliverable Submitted, Other |
| direction | Yes | enum: Internal, External, Both |
| importance | Yes | enum: Low, Medium, High, Critical |
| impact_types | No | array of enum: Revenue, Risk Mitigation, Relationship, Technical Delivery, Strategic |
| exec_visibility | Yes | boolean, default false |
| importance_score | Yes | integer 1–10 (computed) |
| tags | No | array of strings |
| url_attachments | No | array of URLs |
| created_by_id | Yes | FK → User |
| created_at | Yes | timestamp |
| updated_at | Yes | timestamp |

*Relationships:* belongs to Team; linked to one or more Accounts; has many Contributors (via junction table), has many FollowUps, has many Tags.

---

### Contributor (Activity ↔ User junction)
| Field | Required | Notes |
|-------|----------|-------|
| activity_id | Yes | FK → Activity |
| user_id | Yes | FK → User |
| role | No | e.g., "Lead", "Attendee", "Author" |

---

### FollowUp
| Field | Required | Notes |
|-------|----------|-------|
| id | Yes | UUID |
| team_id | Yes | FK → Team |
| title | Yes | string |
| description | No | text |
| owner_id | Yes | FK → User |
| due_date | Yes | date |
| status | Yes | enum: Open, In Progress, Done, Cancelled |
| activity_id | No | FK → Activity |
| account_id | No | FK → Account |
| created_by_id | Yes | FK → User |
| created_at | Yes | timestamp |
| updated_at | Yes | timestamp |

*Relationships:* belongs to Team; optionally linked to Activity and Account.

---

### NewsletterIssue
| Field | Required | Notes |
|-------|----------|-------|
| id | Yes | UUID |
| team_id | Yes | FK → Team |
| title | Yes | string (e.g., "Week of March 10, 2025") |
| time_window_start | Yes | date |
| time_window_end | Yes | date |
| status | Yes | enum: Draft, In Review, Published |
| created_by_id | Yes | FK → User |
| published_at | No | timestamp |
| created_at | Yes | timestamp |
| updated_at | Yes | timestamp |

*Relationships:* belongs to Team; has many NewsletterSections.

---

### NewsletterSection
| Field | Required | Notes |
|-------|----------|-------|
| id | Yes | UUID |
| newsletter_issue_id | Yes | FK → NewsletterIssue |
| section_type | Yes | enum: Wins, Key Customer Moves, Risks & Blockers, Metrics & Outcomes, Next Week Priorities, Asks & Help Needed, Custom |
| title | Yes | string (default from section_type) |
| position | Yes | integer (sort order) |
| items | Yes | JSON array of {text: string, activity_id?: UUID, follow_up_id?: UUID} |

---

### Tag
| Field | Required | Notes |
|-------|----------|-------|
| id | Yes | UUID |
| team_id | Yes | FK → Team |
| name | Yes | string, unique per team |

*Relationships:* has many Activities (via junction table).

---

### User
| Field | Required | Notes |
|-------|----------|-------|
| id | Yes | UUID |
| team_id | Yes | FK → Team |
| email | Yes | string, unique |
| display_name | Yes | string |
| role | Yes | enum: Admin, Contributor, Viewer |
| created_at | Yes | timestamp |
| last_active_at | No | timestamp |

---

### AuditLog
| Field | Required | Notes |
|-------|----------|-------|
| id | Yes | UUID |
| team_id | Yes | FK → Team |
| actor_id | Yes | FK → User |
| action | Yes | enum: created, updated, deleted, published |
| entity_type | Yes | string (e.g., "Activity", "FollowUp") |
| entity_id | Yes | UUID |
| diff | No | JSON (field-level diff for updates) |
| created_at | Yes | timestamp |

---

## 10. Newsletter Format & Rules

### Default Sections (in order)

| # | Section | Purpose |
|---|---------|---------|
| 1 | **Wins / Progress** | Achievements, milestones, successful customer outcomes |
| 2 | **Key Customer Moves** | Significant customer meetings, exec engagements, relationship developments |
| 3 | **Risks & Blockers** | Items at risk, escalations, overdue follow-ups |
| 4 | **Metrics / Outcomes** | Quantifiable results: deals influenced, workshops delivered, NPS, etc. |
| 5 | **Next Week Priorities** | Most important things the team is working on next week |
| 6 | **Asks / Help Needed** | What the team needs from leadership, other teams, or exec sponsors |

Custom sections may be added per issue by the editor.

### Inclusion Rules

An activity qualifies as a newsletter candidate if **all** of the following are true:
1. `exec_visibility = true`, **OR** `importance = Critical`, **OR** `importance = High` and `impact_type` includes Revenue or Risk Mitigation.
2. `date` falls within the newsletter's selected time window (default: last 7 calendar days).
3. The activity is not already included in a previously published newsletter issue for the same time window.

An open follow-up qualifies for **Risks & Blockers** if:
- `status = Open` or `In Progress`, **AND**
- `due_date ≤ today + 3 days` **OR** `due_date < today` (overdue).

### Tone and Style Rules
- **Executive-ready**: Assume the reader has 60 seconds per section. Lead with outcomes, not process.
- **Concise**: Each bullet should be ≤ 2 sentences. Avoid jargon.
- **Outcome-focused**: Prefer "Closed 3-day workshop with ACME resulting in signed expansion SOW" over "Ran ACME workshop."
- **Action-oriented for next steps**: Next week priorities and Asks should name an owner and a clear deliverable.
- Editors are expected to review and refine auto-populated items before publishing. The system provides a starting draft, not a final document.

---

## 11. Importance & Prioritization Logic

### Scoring Model

The **Importance Score** (1–10) is computed as the weighted sum of the following signals:

| Signal | Options | Weight |
|--------|---------|--------|
| Importance level | Low=1, Medium=3, High=6, Critical=10 | 40% |
| Revenue / pipeline influence | None=0, Indirect=2, Direct=5 | 25% |
| Risk level | None=0, Low=2, High=5 | 20% |
| Exec visibility toggle | Off=0, On=5 | 10% |
| Urgency (due in ≤7 days or already overdue) | No=0, Yes=3 | 5% |

**Formula:**
```
raw = (importance_value × 0.40)
    + (revenue_value × 0.25)
    + (risk_value × 0.20)
    + (exec_toggle_value × 0.10)
    + (urgency_value × 0.05)

score = round(normalize(raw) × 10, 0)   # normalized to 1–10 scale
```

**Assumption:** The normalization range is calibrated to a max raw score of ~10.25 (Critical + Direct Revenue + High Risk + Exec On + Urgent). Scores are rounded to the nearest integer and clamped to [1, 10].

### Concrete Examples

**Example 1 — Routine Internal Sync (Score: 2)**
- Importance: Low → 1 × 0.40 = 0.40
- Revenue: None → 0 × 0.25 = 0
- Risk: None → 0 × 0.20 = 0
- Exec toggle: Off → 0 × 0.10 = 0
- Urgency: No → 0 × 0.05 = 0
- Raw = 0.40 → normalized Score ≈ **2**

**Example 2 — High-Stakes Customer QBR with Revenue Impact (Score: 8)**
- Importance: High → 6 × 0.40 = 2.40
- Revenue: Direct → 5 × 0.25 = 1.25
- Risk: None → 0 × 0.20 = 0
- Exec toggle: On → 5 × 0.10 = 0.50
- Urgency: No → 0 × 0.05 = 0
- Raw = 4.15 → normalized Score ≈ **8**

**Example 3 — Critical Escalation, Risk of Churn (Score: 10)**
- Importance: Critical → 10 × 0.40 = 4.00
- Revenue: Direct → 5 × 0.25 = 1.25
- Risk: High → 5 × 0.20 = 1.00
- Exec toggle: On → 5 × 0.10 = 0.50
- Urgency: Yes (follow-up overdue) → 3 × 0.05 = 0.15
- Raw = 6.90 → normalized Score ≈ **10**

---

## 12. Non-Functional Requirements

### Security & Privacy
- All data is scoped to a team; users can only access data for their own team.
- Authentication is required; support SSO (SAML / OIDC) in Phase 2; username/password + MFA in MVP.
- HTTPS enforced for all connections.
- No customer PII (names, contact details) shall be stored in activity descriptions — teams use account-level identifiers only.

**Assumption:** Initial deployment is on a trusted internal network; public-internet deployment requires a security review before launch.

### Auditability
- All create, update, delete, and publish actions on Activities, FollowUps, and NewsletterIssues must be recorded in an AuditLog with actor, timestamp, and field-level diff.
- Audit log is read-only; no record may be deleted.
- Audit log is accessible to Admins only.

### Performance
- Activity feed page load: < 2 seconds for up to 500 activities per team.
- Global search: < 1 second for text queries across up to 5,000 records.
- Newsletter draft generation: < 5 seconds.
- The system shall support up to 50 concurrent users per team in MVP.

### Mobile-Friendly UX
- All core views (activity feed, follow-ups tracker, account view, dashboard) must be usable on mobile browsers (responsive design, minimum 375px viewport).
- The newsletter builder may be desktop-only in MVP.

### Availability
- Target uptime: 99.5% (approximately 3.6 hours downtime per month).
- Scheduled maintenance windows communicated 24 hours in advance.

### Data Retention
- All data retained indefinitely unless explicitly archived or deleted by an Admin.
- Deleted records are soft-deleted (flagged, not removed) and recoverable within 30 days by an Admin.

---

## 13. High-Level Architecture (Conceptual)

### Option A: Simple Stack (Fast MVP)

Best for: getting to v1 quickly with a small team (2–3 engineers).

```
┌────────────────────────────┐
│   Browser (SPA / React)    │
└────────────┬───────────────┘
             │ REST API (JSON)
┌────────────▼───────────────┐
│   Backend (Node.js /       │
│   Python / Ruby — single   │
│   monolithic service)      │
└────────────┬───────────────┘
             │
┌────────────▼───────────────┐
│   Relational DB            │
│   (PostgreSQL)             │
└────────────────────────────┘
             │
        File/Object Store
         (S3 / local FS)
         for exports
```

- **Authentication:** Session-based or JWT; single auth provider.
- **Newsletter generation:** Server-side template rendering; Markdown file generated on request.
- **Export:** Markdown and plain-text generated server-side and streamed to browser.
- **Deployment:** Single server or PaaS (Heroku, Render, Railway).

### Option B: Scalable Team-Ready Stack

Best for: enterprise-grade reliability, future integrations, and multi-team support.

```
┌────────────────────────────┐
│   Browser (React / Next.js)│
└────────────┬───────────────┘
             │ GraphQL or REST
┌────────────▼───────────────┐
│   API Gateway / BFF        │
│   (Node.js / Go)           │
└─────┬───────────┬──────────┘
      │           │
┌─────▼──┐  ┌────▼────────────┐
│Core API│  │ Newsletter      │
│Service │  │ Generator Svc   │
└────┬───┘  └────┬────────────┘
     │           │
┌────▼───────────▼────────────┐
│  PostgreSQL (primary store) │
│  + Read replica             │
└─────────────────────────────┘
             │
     ┌───────▼────────┐
     │ Object Store   │
     │ (S3/GCS)       │
     │ — exports      │
     │ — attachments  │
     └────────────────┘
             │
     ┌───────▼────────┐
     │ Auth Service   │
     │ (OIDC / SSO)   │
     └────────────────┘
```

- **Audit logging:** Separate audit log table (append-only) with change events.
- **Newsletter generation flow:**
  1. Editor requests draft → API queries activities/follow-ups matching inclusion rules → groups by section → returns structured JSON.
  2. Editor reviews and edits in-browser.
  3. On export, server renders Markdown template and returns file.
- **Export mechanisms:** REST endpoint `GET /newsletter/:id/export?format=markdown|text` returns the appropriate format as a downloadable file.

**Recommendation:** Start with Option A, design the data model to support Option B migration.

---

## 14. Integrations

### MVP Integrations

| Integration | Value | Minimum Data Required |
|-------------|-------|-----------------------|
| **Manual entry** | Core workflow; zero dependencies | N/A |
| **CSV export** | Enables activity data backup, sharing, and offline analysis | All activity fields as flat CSV |
| **Markdown export** | Newsletter published to Confluence, Notion, or email | Newsletter sections rendered as Markdown |

### Phase 2 Integrations

| Integration | Value | Minimum Data Required |
|-------------|-------|-----------------------|
| **Google Calendar / Outlook** | Auto-create activity stubs from meeting invites | Event title, attendees, date/time, description |
| **Gmail / Outlook Email** | Log customer emails as activities without manual entry | Subject, sender/recipients, date, body snippet |
| **Salesforce / HubSpot CRM** | Sync account names, tiers, and opportunity data | Account name, tier, primary contact, deal stage |
| **Confluence / Notion** | Attach notes and meeting summaries as activity artifacts | Page title, URL, last modified date |
| **Slack** | Post newsletter to a channel; receive follow-up reminders | Channel webhook, user mention IDs |
| **AI Summarization (LLM)** | Auto-summarize lengthy descriptions into exec-ready bullets | Activity description text |

---

## 15. Success Metrics

| Metric | Target (End of MVP Quarter) | How Measured |
|--------|----------------------------|--------------|
| % of team activities captured weekly | ≥ 80% of team members log at least 3 activities per week | Activity log count per user per week |
| Follow-up completion rate | ≥ 70% of follow-ups closed by due date | FollowUp status vs. due date |
| Newsletter production time | < 30 minutes from draft generation to publish | Timestamp difference: issue created → published |
| Newsletter consistency | Weekly newsletter issued for ≥ 90% of weeks | Count of published issues / calendar weeks |
| Exec engagement | ≥ 3 exec stakeholders reference newsletter content in meetings per month | Qualitative tracking (survey or count) |
| Adoption | ≥ 80% of CAIP team members active in the app within 4 weeks of launch | User last_active_at |

---

## 16. Acceptance Criteria (Testable)

| ID | Criterion | Pass Condition |
|----|-----------|----------------|
| AC-01 | **Activity creation** | A Contributor can create an activity with all required fields; the activity appears in the shared feed immediately for all team members. |
| AC-02 | **Multi-account activity** | An activity can be associated with more than one account; it appears in the account view for each associated account. |
| AC-03 | **Importance filtering** | Filtering the activity feed by Importance = High returns only activities with importance set to High or Critical. |
| AC-04 | **Exec visibility toggle** | Activities with exec_visibility = true appear as newsletter candidates in the newsletter builder; activities with exec_visibility = false do not appear as candidates unless they meet alternative thresholds (Importance = Critical). |
| AC-05 | **Follow-up creation** | A Contributor can create a follow-up with owner, due date, and status; the follow-up appears in the Follow-Ups Tracker. |
| AC-06 | **Follow-up status update** | The owner of a follow-up can update its status; any Admin can also update it; a Contributor who is not the owner cannot update another Contributor's follow-up status. |
| AC-07 | **Overdue follow-up visibility** | A follow-up whose due_date is in the past and whose status is Open or In Progress is visually flagged as overdue in the Follow-Ups Tracker. |
| AC-08 | **Newsletter draft generation** | Creating a new newsletter issue for the last 7 days pre-populates each section with at least one qualifying activity or follow-up (given sufficient data meeting inclusion rules); the draft is editable before publishing. |
| AC-09 | **Newsletter export** | A published newsletter issue can be exported as a valid Markdown file and as plain text; both formats include all sections and bullets from the published issue. |
| AC-10 | **Role-based access — Viewer** | A Viewer can view all activities, follow-ups, and published newsletters but cannot create, edit, or delete any record. All create/edit UI elements are hidden or disabled for Viewers. |
| AC-11 | **Role-based access — Contributor** | A Contributor can create activities and follow-ups and update their own follow-up statuses but cannot publish a newsletter or manage users. |
| AC-12 | **Role-based access — Admin** | An Admin can manage users (assign roles), publish newsletter issues, archive accounts, and view the audit log. |
| AC-13 | **Audit log** | Every create, edit, and delete action on an Activity records an AuditLog entry with the actor's user ID, action type, entity ID, and timestamp. |
| AC-14 | **Global search** | A search query matching partial text in an activity title returns the matching activity in results within 1 second. |
| AC-15 | **Team isolation** | A user from Team A cannot view, create, or modify any data belonging to Team B even with a valid authentication token. |

---

## 17. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Adoption — team doesn't log activities consistently** | High | High | Keep logging friction minimal (quick-add UI, mobile-friendly); reinforce via weekly team ritual; show value through the newsletter immediately. |
| **Data quality — activities logged without meaningful detail** | Medium | High | Require only essential fields (title, date, account, importance); add optional fields progressively; show examples of well-formed vs. sparse entries in onboarding. |
| **Over-complexity in MVP** | Medium | Medium | Strictly enforce non-goals; defer Phase 2 features; timebox MVP to core journeys only; use a simple stack (Option A). |
| **Newsletter not adopted by execs** | Medium | Medium | Share the first issue manually alongside the existing format; iterate based on exec feedback; ensure tone rules are enforced in onboarding. |
| **Follow-up accountability friction** | Medium | Medium | Make follow-up assignment the natural last step of any activity log; show owner's own overdue follow-ups on their dashboard home screen. |
| **Team isolation / data leakage** | Low | Critical | Enforce team_id scoping at every query level in the API; add automated tests for cross-team isolation on every endpoint. |
| **Scope creep into CRM territory** | Low | High | Refer to non-goals in every sprint planning; product owner sign-off required for any new entity beyond the defined data model. |

---

## 18. Open Questions

| # | Question / Assumption | Owner | Resolution Target |
|---|----------------------|-------|-------------------|
| OQ-01 | **Assumption:** The team operates as a single workspace. Multi-team support is deferred to Phase 2 even if multiple CAIP sub-teams exist. Confirm this is acceptable for launch. | Product Owner | Pre-MVP |
| OQ-02 | **Assumption:** No customer PII is stored in the system (activity descriptions use account names and role titles only). Confirm with Legal / Privacy. | Legal | Pre-MVP |
| OQ-03 | **Assumption:** Authentication in MVP is username/password + MFA only; SSO is Phase 2. Confirm if SSO is required at launch for corporate IT compliance. | IT / Security | Pre-MVP |
| OQ-04 | What is the expected team size (number of CAIP team members) at launch? This determines whether Option A or Option B architecture is required for MVP. | Engineering Lead | Pre-design |
| OQ-05 | Should the newsletter be emailed directly, or is copy-paste into email sufficient for MVP? Direct email sending adds SendGrid/SES integration complexity. | Product Owner | Sprint 1 |
| OQ-06 | Who is the "Newsletter Editor" — any Admin, or a designated role? The current spec allows any Admin. Should there be a dedicated Newsletter role? | Product Owner | Sprint 1 |
| OQ-07 | **Assumption:** The Importance Score is computed server-side on save and stored. If weights need to be tunable per team, this adds complexity. Confirm whether the scoring weights are fixed globally or configurable. | Product Owner | Sprint 2 |
| OQ-08 | Should tags be predefined (team-managed) or freeform? Currently spec'd as freeform strings. Predefined tags improve consistency but add admin overhead. | Product Owner | Sprint 1 |
| OQ-09 | What is the maximum number of accounts per team in MVP? This affects pagination and performance design. | Engineering Lead | Pre-design |
| OQ-10 | Are external participants (customer names) stored as structured records or as free text? Storing them as records enables future contact-level tracking but requires more upfront data model work. | Product Owner | Sprint 1 |

---

## 19. Milestones

### Milestone 1 — MVP (Target: ~8 weeks)
- [ ] Authentication (username/password + MFA)
- [ ] User management (Admin assigns roles)
- [ ] Account management (create, edit, archive)
- [ ] Activity logging (all required fields, importance scoring)
- [ ] Follow-up management (create, assign, status update)
- [ ] Activity feed with filtering
- [ ] Account view with activity and follow-up summary
- [ ] Dashboard (weekly summary stats)
- [ ] Newsletter draft generation, editing, and export
- [ ] Audit log (read-only, Admin access)
- [ ] CSV export of activities and follow-ups

**Exit criteria:** All 15 acceptance criteria pass; at least 3 CAIP team members have used the system for 2 consecutive weeks.

### Milestone 2 — Team Adoption (Target: ~4 weeks post-MVP)
- [ ] Mobile-responsive polish across all views
- [ ] Global search
- [ ] Newsletter archive view
- [ ] Onboarding guide and in-app tooltips
- [ ] Performance baseline established (load tests for 50 concurrent users)

**Exit criteria:** ≥ 80% of team members active weekly; follow-up completion rate ≥ 60%.

### Milestone 3 — Newsletter v1 (Target: ~4 weeks after Milestone 2)
- [ ] Exec distribution mechanism (copy-to-email polish or direct send via integration)
- [ ] Newsletter issue history and archive browsing
- [ ] Importance Score display and explanation in UI
- [ ] First calendar integration (Phase 2 kickoff)

**Exit criteria:** Newsletter issued for 4 consecutive weeks; exec stakeholders actively referencing it.

---

## 20. Appendix

### A. Glossary

| Term | Definition |
|------|-----------|
| **Activity** | Any discrete piece of work or interaction logged against one or more accounts (meeting, email, deliverable, etc.). |
| **Account** | An enterprise customer or prospect that the CAIP team manages. |
| **Contributor** | A CAIP team member with create/edit access in the system. |
| **Exec Visibility** | A flag on an activity indicating it should be considered for the executive newsletter. |
| **Follow-Up** | A discrete next action with an owner, due date, and status; may or may not be linked to an activity. |
| **Importance Score** | A computed 1–10 score reflecting the overall significance of an activity based on multiple weighted signals. |
| **Newsletter Issue** | One weekly edition of the executive newsletter, covering a specific time window. |
| **Newsletter Section** | A named grouping within a newsletter issue (e.g., "Wins / Progress"). |
| **Team** | The shared workspace for a CAIP sub-team; all data is scoped to a team. |

---

### B. Text-Only Wireframe Descriptions

#### B1. Dashboard (Home)
```
┌─────────────────────────────────────────────────────────────────┐
│ CAIP Mission Control          [Team: CAIP West]   [User: Jane]  │
├─────────────────────────────────────────────────────────────────┤
│  This Week at a Glance                                          │
│  ┌──────────────┐  ┌────────────────┐  ┌─────────────────────┐ │
│  │ 12 Activities│  │ 7 Open Follow- │  │  3 Overdue         │ │
│  │ logged       │  │ Ups            │  │  Follow-Ups         │ │
│  └──────────────┘  └────────────────┘  └─────────────────────┘ │
│                                                                 │
│  Latest Newsletter:  "Week of Mar 10"  [View]  [New Draft]      │
│                                                                 │
│  My Open Follow-Ups                              [See All →]   │
│  • [Overdue] Send QBR deck to ACME — Due Mar 8                 │
│  • [Due Today] Schedule renewal call with BetaCorp             │
│  • [Due Fri] Deliver POC results to GammaTech                  │
└─────────────────────────────────────────────────────────────────┘
```

#### B2. Activity Feed
```
┌─────────────────────────────────────────────────────────────────┐
│ Activity Feed              [+ New Activity]                     │
├──────────────────────────────────────────────────────────────── │
│ Filters: [Account ▾] [Type ▾] [Importance ▾] [Date Range ▾]   │
├─────────────────────────────────────────────────────────────────┤
│ ● [CRITICAL] ACME Renewal Risk Escalation          Mar 10      │
│   Exec Briefing · ACME Corp · Risk Mitigation · Score: 10      │
│   "Exec sponsor flagged risk of non-renewal due to P1 bug..."  │
│   Contributors: Jane, Tom    [2 Follow-Ups]  [👁 Exec Visible] │
├─────────────────────────────────────────────────────────────────┤
│   [HIGH] BetaCorp Expansion Workshop Day 2           Mar 9     │
│   Workshop · BetaCorp · Revenue · Score: 8                     │
│   "Completed Day 2 of 3-day expansion workshop..."             │
│   Contributors: Sarah   [1 Follow-Up]                          │
├─────────────────────────────────────────────────────────────────┤
│   [MEDIUM] Internal Q2 Planning Sync                 Mar 8     │
│   Internal Sync · (no account) · Score: 3                      │
│   Contributors: Full Team                                       │
└─────────────────────────────────────────────────────────────────┘
```

#### B3. New Activity Form
```
┌─────────────────────────────────────────────────────────────────┐
│ New Activity                                          [Cancel]  │
├─────────────────────────────────────────────────────────────────┤
│ Title *          [                                            ] │
│ Date *           [Mar 10, 2025         ]                        │
│ Type *           [Customer Meeting          ▾]                  │
│ Direction *      [External                  ▾]                  │
│ Accounts *       [ACME Corp ×] [+ Add Account]                  │
│ Importance *     ○ Low  ○ Medium  ● High  ○ Critical            │
│ Impact Type      [✓ Revenue] [✓ Risk Mitigation] [ Relationship]│
│ Exec Visibility  [✓] Include in newsletter candidates          │
│ Description      [                                            ] │
│                  [                                            ] │
│ Contributors     [Jane D. ×] [Tom K. ×] [+ Add]                │
│ Tags             [QBR ×] [renewal ×] [+ Add tag]               │
│ Links            [+ Add URL]                                    │
├─────────────────────────────────────────────────────────────────┤
│                         [Cancel]  [Save Activity]               │
└─────────────────────────────────────────────────────────────────┘
```

#### B4. Newsletter Builder
```
┌─────────────────────────────────────────────────────────────────┐
│ Newsletter Builder — Week of Mar 10, 2025      [Preview] [Export]│
│ Status: Draft                                  [Publish Issue]  │
├─────────────────────────────────────────────────────────────────┤
│ Time Window: [Mar 4–10, 2025]   [Regenerate Draft]              │
├─────────────────────────────────────────────────────────────────┤
│ 🏆 Wins / Progress                              [+ Add Bullet]  │
│  ✓ ACME expansion SOW signed following 3-day workshop           │
│  ✓ BetaCorp renewed at 120% ARR                [✎ Edit] [✕]    │
├─────────────────────────────────────────────────────────────────┤
│ 🤝 Key Customer Moves                           [+ Add Bullet]  │
│  ✓ ACME: Exec sponsor meeting on renewal risk (P1 bug path)     │
├─────────────────────────────────────────────────────────────────┤
│ ⚠ Risks & Blockers                             [+ Add Bullet]  │
│  ✓ GammaTech POC at risk — follow-up overdue (Owner: Tom K.)    │
├─────────────────────────────────────────────────────────────────┤
│ 📋 Next Week Priorities                         [+ Add Bullet]  │
│  ✓ Deliver GammaTech POC results by Friday (Owner: Sarah)       │
├─────────────────────────────────────────────────────────────────┤
│ 🙋 Asks / Help Needed                           [+ Add Bullet]  │
│  ✓ Need VP Engineering escalation path for ACME P1 bug          │
└─────────────────────────────────────────────────────────────────┘
```

---

### C. Sample Newsletter Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CAIP TEAM UPDATE — Week of March 10, 2025
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏆 WINS / PROGRESS
• ACME Corp expansion SOW signed following successful 3-day
  architecture workshop. Q2 revenue impact: +$450K ARR.
• BetaCorp renewed at 120% ARR ahead of contract deadline.

🤝 KEY CUSTOMER MOVES
• ACME: Joint exec briefing with VP Engineering and our CTO to
  align on P1 bug resolution path and renewal timeline.
• GammaTech: Completed Phase 1 of POC; final results
  presentation scheduled for March 14.

⚠ RISKS & BLOCKERS
• ACME renewal at risk pending resolution of P1 production bug.
  Engineering escalation needed by EOW. (Owner: Tom K.)
• GammaTech POC follow-up overdue by 2 days. Sarah to deliver
  results deck by March 14.

📊 METRICS / OUTCOMES
• 3 workshops delivered across 2 accounts this week.
• 2 renewals progressed; 1 SOW signed.

📋 NEXT WEEK PRIORITIES
• Deliver GammaTech POC results and executive summary. (Owner: Sarah, Due: Mar 14)
• Resolve ACME P1 escalation path with Engineering. (Owner: Tom K., Due: Mar 12)
• Kick off DeltaFinancial onboarding — first team intro call. (Owner: Jane D.)

🙋 ASKS / HELP NEEDED
• Need VP Engineering to join ACME escalation call this week.
• Introductions to DeltaFinancial exec sponsor requested from
  partnerships team.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated by CAIP Mission Control · Published Mar 11, 2025
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
