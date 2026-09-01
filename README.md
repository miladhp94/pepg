# PEPG 3 Prototype — Current

This is the current browser-based research prototype for **PEPG 3: Beyond Participation — A Leap in the Architecture of Collective Governance**.

## What changed from the previous prototype

The existing PEPG Board experience is preserved as the foundation, while PEPG 3 reusable governance engines are added as explicit classes:

- `BoardEngine`
- `ContextEngine`
- `VotingEngine`
- `RatingEngine`
- `TrustEngine`
- `DelegateEngine`
- `DiscussEngine`
- `VerifyEngine`
- `ReportEngine`

The same engines are designed to be reusable by different governance objects.

## Implemented in this prototype

### Board
Persistent Problem IDs, definitions, definition proposals, context, verification and external links.

### Context
Contextual filtering and semantic search fields.

### Discuss
Discussion rooms, candidate results, closure support and the 80% room-closure rule.

### Vote
Reusable problem and proposal voting.

### Rating
Multi-value evaluation with effectiveness, cost and risk.

### Delegate
Contextual delegated voting weight, revocation, and a visible delegation record.

### Trust
Prototype authorization-validation request attached to delegated participation.

### Verify
Prototype verification requests for governance objects.

### Report
Prototype oversight/report requests.

## Architecture principle

PEPG 3 treats governance functions as reusable modules. A voting engine can be reused for problem confirmation, solution selection, prioritization or oversight. Context can be reused for problem search, solution discovery, discussion classification and contextual delegation.

## Prototype limitation

This remains a browser-only research prototype. New records and user actions are stored only in the current browser session. There is no production database, identity provider, cryptographic authorization system, or real delegated voting infrastructure yet.

## Research

PEPG 3 DOI:

https://doi.org/10.5281/zenodo.22229362

Permanent Arweave publication:

https://arweave.net/A3xCdiVGGbVgaESreDWE8QroCcQaXuM6esoJ3sSBnTQ

Author:

Milad Habibpour

ORCID:

https://orcid.org/0009-0001-4789-0333
