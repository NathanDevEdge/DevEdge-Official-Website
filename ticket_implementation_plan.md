# Ticket System — Implementation Plan

## Overview
A complete overhaul of the ticketing system to support multi-organisation hierarchies, a structured status pipeline, and role-based permission levels.

---

## 1. Organisation Hierarchy

### Concept
Replace the flat userbase with a two-level hierarchy:

```
Organisation (e.g. "WoodEvo")
├── User: Owen
├── User: Remy
└── User: Kim
```

### Database Changes

**New `organisations` table**
```sql
CREATE TABLE organisations (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Updated `users` table**
- Add `organisation_id` (FK → organisations)
- Remove standalone client/admin distinction from a single flat table — role is now scoped within an organisation context

```sql
ALTER TABLE users
  ADD COLUMN organisation_id INTEGER REFERENCES organisations(id);
```

**Updated `tickets` table**
- Add `organisation_id` so tickets are scoped to an org (not just a user)

```sql
ALTER TABLE tickets
  ADD COLUMN organisation_id INTEGER REFERENCES organisations(id);
```

### API Changes
- `GET /api/admin` — returns organisations with nested users, not a flat client list
- `POST /api/admin` — provision a new org OR add a user to an existing org
- JWT token payload includes `organisation_id` so every request is org-scoped

### UI Changes — Admin Dashboard
- Replace flat "Client Directory" list with an **Organisation Tree**:
  - Each org is a collapsible panel showing its member users
  - "Add Organisation" button creates a new org
  - "Add User" button within an org panel provisions a user into that org

---

## 2. Status Pipeline

### New Status Flow
```
Open → Confirmed → In Progress → In Review → Closed
```

| Status | Meaning | Set By |
|---|---|---|
| `open` | Ticket submitted by client, awaiting acknowledgement | System (on creation) |
| `confirmed` | DevEdge has reviewed and confirmed — no extra info needed | Admin |
| `in_progress` | DevEdge is actively working on the issue | Admin |
| `in_review` | Changes made — client reviews and verifies fix | Admin (triggers client action) |
| `closed` | Ticket resolved and agreed upon | Admin |

### Database Changes
```sql
ALTER TABLE tickets
  DROP CONSTRAINT tickets_status_check;

ALTER TABLE tickets
  ADD CONSTRAINT tickets_status_check
  CHECK (status IN ('open', 'confirmed', 'in_progress', 'in_review', 'closed'));
```

### UI Changes
**Status chips** — update colour coding across all views:
- `open` — Amber (unchanged)
- `confirmed` — Blue `bg-blue-500/10 text-blue-700 border-blue-500/20`
- `in_progress` — Ember/primary (unchanged)
- `in_review` — Purple `bg-purple-500/10 text-purple-700 border-purple-500/20`
- `closed` — Green (replaces "resolved")

**Admin status dropdown** — updated to show all 5 options in pipeline order

**Client portal** — status chips are read-only; show a subtle pipeline indicator so the client can visualise where their ticket sits

---

## 3. Permission Levels

### Roles
| Role | Scope | Ticket Visibility | Ticket Editing |
|---|---|---|---|
| `admin` | Full org access | All tickets in their org | Can edit any ticket (status changes, etc.) |
| `user` | Org member | All tickets in their org | Can only edit tickets they submitted |

### Rules
- Both roles see the **full org ticket list** — no hidden tickets
- A `user` attempting to change the status of someone else's ticket → `403 Forbidden`
- A `user` can still **create** new tickets
- An `admin` can move any ticket through the full pipeline

### API Enforcement (backend)
**`PATCH /api/tickets`** — update status logic:
```
if user.role === 'user' AND ticket.client_id !== user.id → 403
```

**`GET /api/tickets`** — scoped by `organisation_id`:
```
WHERE organisation_id = user.organisation_id
```
Both admins and users get the same org-scoped list — filtering is identical, editing permissions differ.

### UI Enforcement (frontend)
- **Admin view** — status dropdown is always enabled on every ticket
- **User view** — status dropdown shown only on tickets where `ticket.client_id === user.id`; all other tickets show a read-only status chip

---

## 4. Items Still To Define

*(To be added in future sessions)*

- [ ] Comments / reply thread on tickets
- [ ] File attachments on tickets
- [ ] Email notification triggers per status change
- [ ] Client-facing "In Review" action (approve/reject a resolution)
- [ ] Ticket priority levels (low / medium / high / critical)
- [ ] Ticket categories / tags

---

## Implementation Order

1. **Database migrations** — organisations table, alter users + tickets tables, update status constraint
2. **Backend API** — org-scoped queries, permission enforcement on PATCH, updated admin endpoints
3. **Admin Dashboard** — org tree UI, updated status dropdown (5 options)
4. **Client Portal** — org-scoped ticket list, permission-aware edit controls, pipeline indicator
5. **Auth** — include `organisation_id` in JWT payload
6. **Setup script** — update `api/setup.ts` to seed an initial org and admin user
