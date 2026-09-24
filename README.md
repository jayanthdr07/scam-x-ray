# SCAMTRACE

### AI-Powered Job Offer Investigation and Protection Platform

> Don't just detect the scam. Trace it.

SCAMTRACE is an AI-powered cybersecurity platform designed to help students, job seekers, interns, and professionals investigate suspicious job offers, recruiter messages, URLs, PDFs, and screenshots before they pay money, click suspicious links, or disclose sensitive information.

Unlike conventional scam detectors that simply produce a percentage such as "87% scam," SCAMTRACE follows an evidence-driven investigation workflow.

It analyzes the submitted content, extracts suspicious signals, calculates a transparent threat score, explains the evidence behind every warning, reconstructs the potential scam progression, independently verifies important claims using public information, challenges its own assessment, and provides actionable safety guidance.

---

## Table of Contents

- [Problem](#problem)
- [Our Solution](#our-solution)
- [Why SCAMTRACE](#why-scamtrace)
- [Core Philosophy](#core-philosophy)
- [Key Features](#key-features)
- [Investigation Workflow](#investigation-workflow)
- [Threat Intelligence Engine](#threat-intelligence-engine)
- [AI Architecture](#ai-architecture)
- [Prompt Engineering](#prompt-engineering)
- [Structured AI Output](#structured-ai-output)
- [Security and Privacy](#security-and-privacy)
- [Responsible AI](#responsible-ai)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Testing](#testing)
- [Deployment](#deployment)
- [Demo](#demo)
- [Example Investigation](#example-investigation)
- [What Makes SCAMTRACE Different](#what-makes-scamtrace-different)
- [Unique Innovation](#unique-innovation)
- [Impact](#impact)
- [Design Philosophy](#design-philosophy)
- [Responsible Use](#responsible-use)
- [Limitations](#limitations)
- [Future Roadmap](#future-roadmap)
- [Project Goals](#project-goals)
- [Core Value Proposition](#core-value-proposition)
- [Product Philosophy](#product-philosophy)
- [Competition Demo Statement](#competition-demo-statement)
- [Conclusion](#conclusion)

---

## Problem

Online employment fraud is becoming increasingly sophisticated.

Job seekers may encounter fraudulent:

- Job offers
- Internship offers
- Recruiter messages
- Interview invitations
- Recruitment websites
- Offer letters
- Equipment purchase requests
- Background verification requests
- Identity verification requests
- Payment requests
- Fake HR communications

These scams often combine multiple psychological and technical techniques.

A typical fraudulent recruitment flow may look like:

```text
Trust Building
      |
      v
Fake Selection
      |
      v
Urgency
      |
      v
Payment Request
      |
      v
Sensitive Data Collection
      |
      v
Financial or Identity Loss
```

Traditional detection tools often stop at:

```
Risk: 87%
```

The user is then left asking:

- Why is it risky?
- Which part of the message is suspicious?
- Is the company actually real?
- Is the job real?
- Is the recruiter genuine?
- What information should I verify?
- What should I do next?
- Could the AI itself be wrong?

SCAMTRACE is designed to answer those questions.

---

## Our Solution

SCAMTRACE transforms scam detection into an investigation.

Instead of only producing a classification, SCAMTRACE follows:

```
DETECT → VERIFY → TRACE → EXPLAIN → CHALLENGE → PROTECT
```

The platform combines:

- Generative AI
- Multimodal analysis
- Evidence extraction
- Deterministic risk scoring
- Public-source verification
- Behavioral pattern analysis
- Explainable risk assessment
- Adversarial AI review
- Actionable safety guidance

The result is an investigation experience rather than a simple AI prediction.

---

## Why SCAMTRACE

SCAMTRACE is built around a simple principle:

> A risk score without evidence is difficult to trust.

The system therefore separates:

```
AI Understanding
      ↓
Evidence Extraction
      ↓
Deterministic Risk Engine
      ↓
Threat Assessment
      ↓
Independent Verification
      ↓
Adversarial Review
      ↓
Protection Guidance
```

This architecture provides a clearer distinction between what was observed, what was inferred, what was independently verified, and what remains unknown.

---

## Core Philosophy

SCAMTRACE follows four important principles.

### 1. Evidence Before Conclusions

The system should identify the evidence first and make the reasoning visible.

### 2. AI for Understanding, Rules for Scoring

Gemini is used to understand unstructured content and extract signals.

The final primary risk score is calculated using a deterministic scoring engine.

This prevents the score from becoming an unexplained AI-generated number.

### 3. Verification Over Assumption

Failure to verify a company or recruiter does not automatically mean the entity is fraudulent.

SCAMTRACE distinguishes between:

- Verified
- Partially verified
- Unverified
- Conflicting information
- Unknown

### 4. Low Risk Does Not Mean Safe

SCAMTRACE does not claim that an offer is legitimate merely because no major red flags were detected.

The platform communicates uncertainty explicitly.

---

## Key Features

### 1. AI Offer Analysis

SCAMTRACE analyzes job-related content using Gemini.

It detects potential indicators including:

- Payment requests
- Advance fees
- Security deposits
- Equipment charges
- Training fees
- Background-check fees
- Application fees
- Bank information requests
- Identity document requests
- OTP requests
- Password requests
- Urgency
- Threats
- Pressure tactics
- Unrealistic compensation
- Suspicious recruitment processes
- Missing interview processes
- Impersonation indicators
- Suspicious URLs
- Domain inconsistencies
- Unusual communication channels
- Sensitive data collection
- Other social-engineering indicators

The AI does not simply return a single classification. It produces structured evidence that can be independently displayed and evaluated by the application.

### 2. Multi-Modal Investigation

SCAMTRACE supports multiple types of input.

**Text** — Users can paste:
- Job offers
- Emails
- Recruiter messages
- WhatsApp messages
- Interview instructions
- Recruitment communications

**URLs** — Users can submit suspicious recruitment URLs for analysis.

**PDFs** — Users can upload:
- Offer letters
- Recruitment documents
- Interview documents
- Employment agreements

**Screenshots** — Users can upload:
- WhatsApp screenshots
- Email screenshots
- Job advertisements
- Offer letter screenshots
- Recruiter conversations

This makes SCAMTRACE useful for the way employment scams actually reach users.

### 3. Dynamic Threat Index

SCAMTRACE generates a transparent risk score from 0 to 100.

Example:

```
86 / 100
HIGH RISK
```

The score is calculated using detected risk signals rather than allowing the language model to arbitrarily select the final percentage.

Example:

```
Payment Request          +25
Sensitive Information    +20
Urgency                  +15
Impersonation            +15
Suspicious Domain        +10
----------------------------
Total                     85
```

The system prevents the score from exceeding 100.

**Risk Levels**

| Range | Level |
|---|---|
| 0–24 | LOW DETECTED RISK |
| 25–49 | MODERATE RISK |
| 50–74 | HIGH RISK |
| 75–100 | CRITICAL RISK |

These labels represent detected risk indicators, not definitive proof of criminal activity.

A low score does not mean that an offer is guaranteed to be legitimate.

### 4. Evidence Lens

The Evidence Lens is one of the core SCAMTRACE features.

Instead of saying:

```
Payment Request Detected
```

SCAMTRACE shows the actual evidence.

**Observed evidence**

> "Pay ₹12,500 as a refundable security deposit."

**Why it matters**

> A request for payment before employment can be an indicator of advance-fee recruitment fraud.

**Risk contribution**

```
+25
```

The Evidence Lens separates:

- **OBSERVED** — What the document actually says.
- **INFERENCE** — What the detected signal may indicate.
- **VERIFIED** — What independent sources confirm.
- **UNKNOWN** — What could not be verified.

This makes the system more explainable and reduces unsupported conclusions.

### 5. Top Red Flags

SCAMTRACE summarizes the strongest detected signals.

Example:

| Signal | Evidence | Contribution |
|---|---|---|
| Payment Request | ₹12,500 refundable deposit | +25 |
| Urgency | Offer expires within two hours | +15 |
| Sensitive Information | Aadhaar and bank information requested | +20 |

Each signal can be expanded to view the supporting evidence.

### 6. Scam Attack Chain

SCAMTRACE does not only identify individual red flags. It attempts to reconstruct the potential progression of the interaction.

```
TRUST → URGENCY → MONEY → DATA
```

A detailed investigation might show:

**Stage 1: Trust**
- Evidence: "Congratulations, you have been selected."
- Purpose: Establishes credibility and creates an expectation of employment.

**Stage 2: Urgency**
- Evidence: "Complete this process within two hours."
- Purpose: Creates pressure and discourages independent verification.

**Stage 3: Money**
- Evidence: "Pay a refundable security deposit."
- Purpose: Introduces a financial request.

**Stage 4: Data**
- Evidence: "Submit your Aadhaar and bank details."
- Purpose: Requests sensitive information.

The attack chain turns disconnected red flags into an understandable sequence.

### 6.1. Interactive Scam Timeline

SCAMTRACE enhances the attack chain with an interactive **Scam Timeline** that chronologically plots detected events against realistic social-engineering playbooks:

- **Chronological Milestones**: Maps the offer progression across relative timeframes:
  - `T+0h`: Initial Outreach & Social Hook
  - `T+2h`: Accelerated Fake Selection (No interview)
  - `T+24h`: Manufactured Velocity & Deadline Pressure
  - `T+48h`: Primary Advance Fee Extraction (Security Deposit / Hardware)
  - `T+72h`: Premature PII & Identity Exfiltration
  - `T+5d`: Secondary Demands & Compounding Extortion
  - `T+14d+`: Communication Cutoff & Darknet Identity Resale
- **Observed vs. Projected States**: Distinguishes between concrete artifacts extracted from the user's submission and predictive adversarial escalation.
- **You Are Here Indicator**: Identifies the victim's current exposure milestone along the timeline.
- **Auto-Simulate Playback**: Step-by-step playback with pause, step, and speed controls (`1x` / `2x`).
- **Tactical What-If Branching**: Simulates consequences if the victim complies versus intervening with protective countermeasures.
- **Kill-Chain Break Window**: Clear operational guidance on how to break the attack chain at each specific point before irreversible losses occur.

### 7. Google-Powered Verification

SCAMTRACE can use Google-supported search and verification capabilities to independently investigate claims made in an offer.

Potential verification targets include:

- Company existence
- Official company website
- Official careers page
- Claimed job position
- Recruiter information
- Company-domain relationship
- Public information related to the claim

The system clearly separates **user-provided information** from **independently verified information**.

Possible verification statuses include:

- VERIFIED
- PARTIALLY VERIFIED
- UNVERIFIED
- CONFLICTING INFORMATION
- UNKNOWN

SCAMTRACE does not automatically classify a company as fraudulent simply because a job or recruiter cannot be found. Instead:

> Could not independently verify.

This prevents unsupported conclusions.

### 8. Domain Intelligence

SCAMTRACE can analyze the relationship between:

- Claimed company
- Recruiter email/domain
- Submitted URL
- Domain naming
- Suspicious URL structures
- Potential company/domain mismatch

Examples of signals include:

```
Claimed Company:   Example Technologies
Submitted Domain:  example-careers-support.com
Potential Concern: Domain does not clearly correspond to the claimed company.
```

Domain intelligence is treated as supporting evidence rather than definitive proof.

If domain age cannot be reliably verified using an allowed source, SCAMTRACE reports:

```
Domain age: Unable to verify
```

It does not fabricate domain-registration information.

### 9. Scam DNA

SCAMTRACE builds a behavioral profile of detected scam characteristics.

Example:

| Trait | Score |
|---|---|
| Financial Pressure | 90 |
| Urgency | 82 |
| Data Harvesting | 87 |
| Impersonation | 70 |
| Fake Recruitment | 80 |
| Credential Harvesting | 45 |

This creates a visual fingerprint of the detected behavior.

The system can identify broader patterns such as:

```
Employment Fraud + Advance Fee + Data Harvesting
```

Scam DNA is intended to represent detected behavioral patterns, not a definitive classification of criminal intent.

### 10. Scam Pattern Library

SCAMTRACE contains a structured library of common recruitment scam patterns.

Examples include:

- Advance Fee Fraud
- Counterfeit Equipment Scam
- Off-Platform Ghost Recruiter
- Executive Impersonation
- Lookalike Domain Trap
- Pre-Employment Credit Check Trap
- Identity Harvesting
- Credential Theft
- Package Mule Recruitment
- Fake Background Verification
- Fake Training Fee
- Fake Recruitment Agency

Each pattern can contain:

- Pattern name
- Risk level
- Description
- Common indicators
- Typical progression
- Example evidence
- Recommended defensive actions

Users can search and filter patterns. The library also allows users to test patterns using the scanner.

### 11. Pattern Matching

After analyzing an offer, SCAMTRACE can identify patterns that resemble known recruitment fraud techniques.

Example:

```
PRIMARY PATTERN: Advance Fee Fraud

Detected indicators:
- Payment request
- Refund promise
- Urgency
- Pre-employment requirement
```

The system can also show related patterns. This connects the live investigation with the Pattern Library.

### 12. AI Red Team

SCAMTRACE does not blindly trust its first AI assessment.

The user can select:

```
Challenge the Verdict
```

A second AI evaluation acts as a skeptical reviewer. It examines:

- Evidence supporting the initial assessment
- Evidence suggesting legitimacy
- Missing information
- Potential false positives
- Unsupported assumptions
- Whether the detected signals justify the assessment

Example:

```
INITIAL ASSESSMENT
82 / 100

RED TEAM REVIEW
Supporting Evidence:      Payment request and urgency detected.
Counter-Evidence:         No explicit credential request detected.
Missing Information:      Recruiter identity could not be independently verified.
Potential False Positive: High salary alone is not sufficient evidence of fraud.

REVIEWED ASSESSMENT
68 / 100
```

This introduces an adversarial review process rather than allowing the first model response to become the final answer.

### 13. Risk Simulator

SCAMTRACE allows users to understand what is driving the risk score.

Example:

```
Payment Request     ON   +25
Urgency              ON   +15
Sensitive Data        ON   +20
Impersonation          ON   +15
```

The user can disable individual signals. The deterministic scoring engine immediately recalculates the score.

Example:

```
Current Score:            85
Remove Payment Request:   60
```

This provides transparent score explainability. Users can understand which signals have the greatest influence on the assessment.

### 14. HR Verification Finder

When a company is identified, SCAMTRACE can help users locate independently sourced official information.

Possible results:

- Official Company Website
- Official Careers Page
- Public Company Information

The core safety principle is:

> Never use contact information contained only inside the suspicious message to verify that same message.

Users are encouraged to independently locate official company information.

### 15. Protection Plan

SCAMTRACE does not stop after detection. It provides actionable next steps.

Depending on the detected signals, recommendations may include:

1. Do not make the requested payment.
2. Do not share OTPs or passwords.
3. Do not provide unnecessary banking credentials.
4. Verify the employer independently.
5. Visit the company's official website directly.
6. Contact HR using independently sourced official information.
7. Preserve the original message and evidence.
8. Report suspicious activity through appropriate channels when applicable.

The recommendations are proportional to the detected risk.

### 16. Demo Mode

SCAMTRACE includes a fictional demonstration scenario.

The demo can contain a fabricated job offer involving:

- Selection confirmation
- Urgency
- Refundable deposit
- Identity verification
- Bank information request

The demo is clearly labelled as fictional. The application still runs the real analysis pipeline rather than displaying a pre-generated final score.

---

## Investigation Workflow

The complete SCAMTRACE workflow is:

```
                     USER INPUT
                         |
          +--------------+--------------+
          |              |              |
        TEXT            URL           FILE
                                         |
                                 +-------+-------+
                                 |               |
                               PDF          SCREENSHOT
                                 |               |
                                 +-------+-------+
                                         |
                                         v
                                GEMINI ANALYSIS
                                         |
                                         v
                              STRUCTURED EVIDENCE
                                         |
                    +--------------------+--------------------+
                    |                    |                    |
                    v                    v                    v
              RED FLAGS           ATTACK CHAIN            SCAM DNA
                    |                    |                    |
                    +--------------------+--------------------+
                                         |
                                         v
                             DETERMINISTIC ENGINE
                                         |
                                         v
                                 THREAT INDEX
                                         |
                                         v
                            GOOGLE VERIFICATION
                                         |
                                         v
                                  AI RED TEAM
                                         |
                                         v
                                PROTECTION PLAN
```

This creates a complete investigation rather than a single prediction.

---

## Threat Intelligence Engine

The primary threat score is calculated using deterministic rules.

Example risk contributions:

| Signal | Contribution |
|---|---|
| Payment request | +25 |
| Financial information request | +20 |
| Identity document request | +15 |
| Urgency or pressure | +15 |
| Credential or OTP request | +25 |
| Impersonation | +15 |
| Unrealistic compensation | +10 |
| Missing meaningful interview | +10 |
| Suspicious domain | +10 |
| Unusual recruitment process | +10 |
| Suspicious URL | +10 |
| Company/job mismatch | +15 |

The system prevents duplicate evidence from being counted repeatedly.

The final score is normalized between **0 and 100**.

Gemini is responsible for extracting and classifying evidence. The deterministic engine is responsible for calculating the primary threat score. This separation improves transparency.

---

## AI Architecture

SCAMTRACE uses Gemini for tasks that require language and multimodal understanding.

Gemini can assist with:

- Document understanding
- Screenshot analysis
- Offer analysis
- Evidence extraction
- Risk signal detection
- Behavioral pattern analysis
- Attack-chain construction
- Public-claim investigation
- Red-team review
- Protection recommendations

The application then transforms the AI output into structured data.

The overall architecture is:

```
Input
  ↓
Gemini
  ↓
Structured JSON
  ↓
Schema Validation
  ↓
Deterministic Risk Engine
  ↓
UI Investigation Dashboard
```

This prevents the user interface from directly trusting arbitrary model output.

---

## Prompt Engineering

Prompt engineering is a core component of SCAMTRACE.

Instead of using one generic AI prompt, the platform uses specialized prompt workflows.

**Analyzer Prompt** — Responsible for:
- Detecting scam indicators
- Extracting evidence
- Identifying entities
- Identifying recruitment anomalies
- Constructing attack-chain stages
- Creating behavioral signals

**Verification Prompt** — Responsible for:
- Identifying claims requiring verification
- Interpreting public-source evidence
- Distinguishing verified information from missing information
- Avoiding unsupported conclusions

**Red Team Prompt** — Responsible for:
- Challenging the original assessment
- Identifying counter-evidence
- Identifying missing information
- Detecting potential false positives
- Testing whether the original reasoning is justified

**Protection Prompt** — Responsible for:
- Translating detected risks into practical safety actions
- Prioritizing actions according to detected threats
- Avoiding unsupported legal or security claims

The prompts use:

- Role specification
- Explicit instructions
- Evidence constraints
- Structured outputs
- Schema validation
- Anti-hallucination requirements
- Confidence fields
- Evidence attribution
- Missing-information handling

### Structured AI Output

SCAMTRACE uses structured AI responses rather than relying on free-form text.

A simplified response structure looks like:

```json
{
  "summary": "Multiple employment scam indicators were detected.",
  "claimedCompany": "Example Technologies",
  "claimedRole": "Software Engineer",
  "riskSignals": [
    {
      "id": "payment_request",
      "category": "financial",
      "title": "Payment Request",
      "evidence": "Pay ₹12,500 as a refundable deposit.",
      "severity": "high",
      "confidence": 0.96
    }
  ],
  "attackChain": [
    {
      "stage": "trust",
      "title": "Trust Building",
      "evidence": "Congratulations, you have been selected."
    },
    {
      "stage": "urgency",
      "title": "Urgency",
      "evidence": "Complete within two hours."
    }
  ]
}
```

The response is validated before being used by the frontend.

---

## Security and Privacy

SCAMTRACE is designed with security and privacy in mind.

### API Key Protection

API credentials are never exposed in client-side code.

Secrets are stored using secure server-side environment variables or Google Cloud secret-management mechanisms.

Never commit:

- `.env`
- `.env.local`
- API keys
- access tokens
- passwords
- private credentials

to GitHub.

### Sensitive Information

Users may upload documents containing sensitive information.

SCAMTRACE follows a data-minimization approach. Users should avoid uploading unnecessary personal information.

The application should avoid logging:

- Bank account numbers
- Aadhaar numbers
- PAN numbers
- Passwords
- OTPs
- Private credentials
- Full personal documents

### Privacy Notice

SCAMTRACE is an AI-powered risk assessment tool.

Results are advisory and should be independently verified.

---

## Responsible AI

SCAMTRACE is designed to assist users, not make definitive legal or criminal determinations.

The platform avoids statements such as:

> This person is a scammer.
>
> This company is definitely fraudulent.

Instead, it uses evidence-based language such as:

- High-risk indicators detected.
- Potential employment scam.
- Could not independently verify.
- Potential impersonation.
- Insufficient evidence.
- Conflicting information detected.

This distinction is important because:

- AI can make mistakes.
- Public information can be incomplete.
- Legitimate companies may have limited online information.
- A suspicious-looking message may require additional context.

SCAMTRACE therefore communicates uncertainty explicitly.

---

## Technology Stack

**Frontend**
- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide Icons

**AI**
- Google Gemini
- Google AI Studio
- Gemini multimodal capabilities
- Structured AI outputs
- Google Search grounding where supported
- URL Context where supported

**Backend**
- Next.js server-side API routes
- Server-side Gemini integration
- Deterministic risk engine
- Input validation
- Structured response validation

**Validation**
- Zod
- TypeScript type safety

**Deployment**
- Google Cloud / Firebase infrastructure

---

## System Architecture

### Project Structure

A recommended project structure is:

```
scamtrace/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── api/
│   │   ├── analyze/
│   │   ├── verify/
│   │   └── red-team/
│   ├── investigate/
│   └── patterns/
│
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Tabs.tsx
│   │   └── Accordion.tsx
│   │
│   └── scamtrace/
│       ├── Scanner.tsx
│       ├── ThreatIndex.tsx
│       ├── ThreatSummary.tsx
│       ├── EvidenceLens.tsx
│       ├── AttackChain.tsx
│       ├── ScamDNA.tsx
│       ├── VerificationPanel.tsx
│       ├── RedTeam.tsx
│       ├── RiskSimulator.tsx
│       ├── ProtectionPlan.tsx
│       └── PatternLibrary.tsx
│
├── lib/
│   ├── ai/
│   │   ├── gemini.ts
│   │   ├── prompts.ts
│   │   └── schemas.ts
│   │
│   ├── scoring/
│   │   ├── risk-engine.ts
│   │   └── risk-rules.ts
│   │
│   ├── verification/
│   │   ├── search.ts
│   │   └── url.ts
│   │
│   └── security/
│       └── redaction.ts
│
├── types/
│   └── analysis.ts
│
├── tests/
├── public/
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## Installation

Clone the repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Navigate into the project:

```bash
cd scamtrace
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env.example .env.local
```

Add the required credentials.

---

## Environment Variables

Create `.env.local`.

Example:

```
GEMINI_API_KEY=your_gemini_api_key
```

Never expose this value through a client-side environment variable.

Never commit `.env.local`.

Your `.gitignore` should include:

```
.env
.env.local
.env.*.local
node_modules
.next
coverage
```

---

## Running Locally

Start the development server:

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

### Production Build

Create a production build:

```bash
npm run build
```

Run the production server:

```bash
npm start
```

---

## Testing

Run unit tests:

```bash
npm test
```

Run linting:

```bash
npm run lint
```

Run TypeScript validation:

```bash
npx tsc --noEmit
```

A complete validation should include:

- TypeScript
- Lint
- Unit Tests
- Production Build

### Test Scenarios

SCAMTRACE should be tested against multiple scenarios.

**Test 1: Advance Fee Scam**

Input:

```
Congratulations. You have been selected for the position.
To activate your employment account, please pay a refundable
security deposit of ₹12,500 within two hours.
```

Expected signals: Payment Request, Urgency, Employment Fraud, Advance Fee Pattern

**Test 2: Sensitive Information Request**

Input:

```
Please send your Aadhaar number, bank account information
and OTP to complete your employment verification.
```

Expected signals: Identity Data Request, Financial Data Request, Credential/OTP Request

**Test 3: Suspicious Recruiter**

Input contains: Unverified recruiter, unusual communication platform, no formal interview, immediate offer.

Expected: Recruitment Anomaly, Potential Impersonation, Verification Required

**Test 4: High Salary Only**

Input contains a very high salary but no other suspicious evidence.

Expected: Potential Concern, Insufficient Evidence

The system should not automatically classify the offer as fraudulent.

**Test 5: Legitimate-Looking Offer**

Input contains: normal interview process, no payment request, no credential request, professional communication, official-domain claim.

Expected: Low Detected Risk

The system should still state: *Low detected risk does not prove legitimacy.*

**Test 6: Screenshot**

Upload a screenshot containing a suspicious recruiter message.

Expected: Multimodal Analysis, Evidence Extraction, Threat Assessment

**Test 7: PDF**

Upload a fictional offer letter.

Expected: Document Analysis, Evidence Extraction, Risk Assessment

**Test 8: Invalid URL**

Expected: Graceful Error. The application must not crash.

---

## Deployment

SCAMTRACE is designed to be deployed using Google Cloud and Firebase infrastructure.

A production deployment should verify:

- Application Build
- Environment Variables
- Server-Side Secrets
- API Connectivity
- Production Routes
- File Handling
- Error Handling
- Responsive UI

Do not claim a deployment is successful unless the production application has actually been tested.

---

## Demo

The recommended demonstration flow is:

1. Upload a suspicious fictional job offer.
2. SCAMTRACE analyzes the content.
3. Show the score:
   ```
   86 / 100
   HIGH RISK
   ```
4. Open **Evidence Lens** — show the exact suspicious statements.
5. Open **Scam Attack Chain** — show:
   ```
   TRUST → URGENCY → MONEY → DATA
   ```
6. Open **Verification** — show independently sourced company information.
7. Open **Challenge the Verdict** — show counter-evidence and missing information.
8. Finish with: *What should you do now?*

This demonstrates the complete SCAMTRACE philosophy: Detect, Explain, Trace, Verify, Challenge, Protect.

---

## Example Investigation

Consider this fictional message:

```
Congratulations!

You have been selected for the Software Engineer position.

To activate your employee account, please pay a refundable
security deposit of ₹15,000.

You must complete the payment within two hours.

Please send your Aadhaar number, bank account details and
OTP to complete verification.
```

SCAMTRACE may extract:

| Signal | Contribution |
|---|---|
| Payment Request | +25 |
| Sensitive Financial Information | +20 |
| Identity Information Request | +15 |
| Urgency | +15 |
| OTP Request | +25 |

The score is then normalized according to the deterministic rules.

The Evidence Lens identifies the exact statements.

The Attack Chain may become:

```
TRUST      → "Congratulations, you have been selected."
URGENCY    → "Complete within two hours."
MONEY      → "Pay ₹15,000."
DATA       → "Submit Aadhaar and bank information."
CREDENTIAL → "Provide OTP."
```

The Protection Plan then prioritizes preventing payment and disclosure of credentials.

---

## What Makes SCAMTRACE Different

Most basic AI scam detectors follow:

```
Input → AI → Scam Percentage
```

SCAMTRACE follows:

```
Input
  ↓
Understand
  ↓
Extract Evidence
  ↓
Calculate Transparent Risk
  ↓
Explain
  ↓
Reconstruct Attack Pattern
  ↓
Verify External Claims
  ↓
Challenge the Assessment
  ↓
Recommend Safe Actions
```

The distinction is important. SCAMTRACE does not ask the user to blindly trust an AI score. It gives the user evidence and context.

---

## Unique Innovation

### 1. Evidence-First Detection

Every significant risk signal should be connected to observable evidence.

```
Claim → Evidence → Reason → Risk Contribution
```

### 2. Deterministic Risk Engine

Gemini extracts the signals. A deterministic rules engine calculates the score. This creates a transparent relationship between evidence and risk.

### 3. Scam Attack Chain

Instead of treating every red flag independently, SCAMTRACE attempts to reconstruct the progression:

```
Trust → Urgency → Money → Data → Credentials
```

This helps users understand how manipulation may unfold.

### 4. Independent Verification

SCAMTRACE attempts to verify important claims using public information rather than relying exclusively on the submitted message.

### 5. AI Red Team

SCAMTRACE challenges its own initial assessment. This helps expose:

- Missing evidence
- Counter-evidence
- Potential false positives
- Unsupported assumptions

### 6. Risk Simulator

Users can interactively see how individual signals affect the score. This makes the threat engine understandable rather than mysterious.

### 7. Scam DNA

SCAMTRACE creates a behavioral profile rather than simply assigning a label.

### 8. Pattern Library

The system connects individual investigations with a reusable knowledge base of recruitment scam patterns.

### 9. Action-Oriented Protection

The system answers the most important question after detection: *What should I do now?*

---

## Impact

SCAMTRACE is designed to have practical impact in an area where users often make decisions under pressure.

Potential beneficiaries include:

- Students
- Fresh graduates
- Internship seekers
- Job seekers
- Remote workers
- Freelancers
- Early-career professionals

The platform aims to reduce the gap between receiving a suspicious offer and understanding whether the offer deserves further verification.

The product focuses on education and prevention rather than simply classification.

---

## Design Philosophy

SCAMTRACE is designed around:

- **Clarity** — Users should understand the result immediately.
- **Explainability** — Every important risk should have supporting evidence.
- **Transparency** — The scoring mechanism should be understandable.
- **Verification** — Important claims should be independently checked where possible.
- **Uncertainty** — Unknown information should remain unknown instead of being invented.
- **Safety** — The platform should provide practical next steps.

---

## Responsible Use

SCAMTRACE is a decision-support and awareness tool.

It should not be treated as:

- A legal determination
- A criminal investigation
- A guaranteed fraud detector
- A replacement for independent verification
- A replacement for official company communication

Users should independently verify important employment decisions.

---

## Limitations

SCAMTRACE has several important limitations.

**AI Limitations** — Generative AI can make mistakes. The system therefore uses structured outputs, evidence requirements, and deterministic scoring where possible.

**Public Information Limitations** — A company or recruiter may have limited online information. Failure to find information does not automatically prove fraud.

**URL Limitations** — Some websites may block automated access or require authentication.

**Document Limitations** — Poor-quality scans or images may reduce analysis accuracy.

**Domain Limitations** — Domain-registration information may not always be available through allowed sources.

**Verification Limitations** — Public web information can be outdated or incomplete.

Therefore, SCAMTRACE uses language such as *"Could not independently verify"* instead of automatically concluding *"Fraudulent."*

---

## Future Roadmap

Future versions of SCAMTRACE can include:

**Email Header Analysis** — Analyze From, Reply-To, Return-Path, Received headers, SPF, DKIM, DMARC.

**Advanced Document Metadata** — Analyze PDF creation metadata, modification timestamps, author fields, producer information, document inconsistencies. Metadata would be treated as supporting evidence rather than proof of fraud.

**Corporate Template Analysis** — Compare document structure and branding against publicly available corporate material where appropriate.

**Job Verification** — Compare claimed positions with publicly available company career listings.

**Community Intelligence** — Create an anonymized community database of reported recruitment scam patterns. Potential signals: scam recruiter identifiers, suspicious domains, repeated scam messages, reported payment patterns.

**Continuous Scam Pattern Learning** — Expand the Pattern Library as new recruitment scam techniques emerge.

**Enterprise Protection** — Potential future users: universities, career centers, recruitment agencies, HR departments, placement cells, employment platforms.

### Future Vision

SCAMTRACE can evolve from a job-offer analyzer into a broader employment-fraud intelligence platform.

The long-term architecture could become:

```
Individual User
      ↓
SCAMTRACE Investigation
      ↓
Pattern Intelligence
      ↓
Community Intelligence
      ↓
Institutional Protection
      ↓
Employment Fraud Prevention Network
```

---

## Project Goals

SCAMTRACE aims to demonstrate that generative AI can be used not only to produce answers, but to create structured, explainable and actionable security workflows.

The goal is not:

> Make AI say "SCAM".

The goal is:

```
Understand → Evidence → Verify → Explain → Challenge → Protect
```

---

## Core Value Proposition

SCAMTRACE transforms:

> "Is this job offer a scam?"

into:

- "What evidence is suspicious?"
- "How risky is it?"
- "Why is it risky?"
- "How might the manipulation work?"
- "Can the important claims be independently verified?"
- "Could the initial assessment be wrong?"
- "What should I do next?"

That is the central value of SCAMTRACE.

---

## Product Philosophy

Traditional detection:

```
DETECT
```

SCAMTRACE:

```
DETECT → EXPLAIN → TRACE → VERIFY → CHALLENGE → PROTECT
```

The product does not simply attempt to tell users what to think. It gives them structured evidence so they can make better-informed decisions.

---

## Competition Demo Statement

A concise description of SCAMTRACE:

> SCAMTRACE is an AI-powered employment fraud investigation platform that goes beyond scam detection. It analyzes job offers, recruiter messages, URLs, PDFs and screenshots, extracts evidence, calculates a transparent threat score, reconstructs the potential scam attack chain, verifies important claims using public information, challenges its own assessment, and provides actionable safety guidance.

**One-Line Description**

> SCAMTRACE turns suspicious job offers into explainable investigations.

**Tagline**

> Don't just detect the scam. Trace it.

---

## Conclusion

Employment scams do not always look like obvious scams.

They often look like:

- Congratulations.
- You have been selected.
- Complete this quickly.
- Pay this small amount.
- Send these documents.
- Verify your identity.

SCAMTRACE is designed to slow that process down.

Instead of asking users to blindly trust an AI-generated percentage, SCAMTRACE exposes the evidence, reconstructs the potential manipulation pattern, verifies important claims, challenges its own reasoning, and provides practical next steps.

The core idea is simple:

```
DETECT → VERIFY → TRACE → EXPLAIN → CHALLENGE → PROTECT
```

SCAMTRACE does not just detect the scam.

**It traces it.**
