# Product Requirements Document: FreeSlot

## Executive Summary

**Product:** FreeSlot - Professional Availability Messaging Tool  
**Problem:** Engineers and freelancers spend 5-10 minutes daily typing availability lists. Calendly is too sales-oriented.  
**Solution:** Minimal availability grid with shareable links showing free slots.  
**Build Time:** 6 hours  
**Status:** APPROVED for overnight

---

## Problem

### Pain Points
1. 5-10 minutes daily typing "when am I free" messages
2. Clients find Calendly links pushy for availability sharing
3. No simple alternative exists for just showing free slots
4. Must re-type availability every time it changes

### Target Users
- Freelancers sharing availability with clients
- Engineers coordinating with recruiters
- Consultants providing free slots to prospects

### Evidence
| Source | Quote |
|--------|-------|
| Hacker News | "Spend 5-10 minutes every day typing availability. Calendly feels too pushy." |
| Reddit | "Calendly is great for scheduling but clients find it sales-y." |
| IndieHackers | "Simple availability link that's NOT a booking tool saves hours." |

---

## Features

### Core (P0)

#### 1. Availability Grid
- Weekly grid (Mon-Fri)
- 30-minute time slots
- Working hours preset
- Status toggle: Available / Busy / Tentative

#### 2. Share Link
- Generate unique shareable link
- View-only page for recipients
- Copy-friendly format
- Timezone display

#### 3. Quick Updates
- Status indicators (green/yellow/red)
- Bulk mark busy/free
- Reset button
- Auto-save to browser storage

#### 4. Settings
- Timezone picker
- Working hours config
- Custom notes per slot

---

## Technical Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 |
| Styling | Tailwind CSS |
| Persistence | Browser localStorage |
| Hosting | Vercel static |

---

## Data Model

```typescript
interface AvailabilityData {
  timezone: string;
  workingHours: { start: string; end: string };
  slots: Record<string, Record<string, 'available' | 'busy' | 'tentative'>>;
  notes: Record<string, Record<string, string>>;
  shareId: string;
  createdAt: string;
}
```

---

## Build Estimate

| Feature | Time |
|---------|------|
| Project setup | 30 min |
| Availability grid | 1.5 hours |
| Status toggle | 30 min |
| Share link | 30 min |
| View page | 1 hour |
| Timezone picker | 30 min |
| Browser storage | 20 min |
| Responsive styling | 30 min |
| Testing | 30 min |
| **Total** | **6 hours** |

---

## Architecture Verification

- **Backend:** Static site only (no server)
- **Storage:** Browser localStorage (no external systems)
- **Accounts:** None (anonymous usage)
- **Users:** One person per browser
- **Sync:** None (all local)

---

## Success Criteria

- [ ] Grid renders correctly
- [ ] Status toggles work
- [ ] Share link generates
- [ ] View page displays
- [ ] Timezone works
- [ ] Mobile responsive

---

## Competitive Gap

| Tool | Gap |
|------|-----|
| Calendly | Too sales-y |
| When2meet | Group scheduling, not individual |
| Doodle | Poll-based |
| **FreeSlot** | Simple availability display |

---

**PRD Version:** 1.0  
**Created:** March 11, 2026  
**Status:** READY FOR BUILD  
**Repository:** https://github.com/Porfirio-Piero/freeslot-availability