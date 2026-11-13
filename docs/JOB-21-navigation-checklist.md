# JOB-21: App shell navigation acceptance checks

Requirement: Set up React Router, the main Layout and the navigation menu.
Acceptance criterion: Every page opens from the menu.

## Test status

Not run. This checklist is a manual test plan, not evidence of passing tests.
Use a working frontend and API with a test account. Record the tested commit, browser, date and results before marking the ticket done.

## Menu pages (signed in)

For each item, select its sidebar link and confirm the URL, heading and page content match, the shared layout remains visible, and no uncaught error occurs.

- [ ] Dashboard: `/`, heading `Dashboard`.
- [ ] Applications: `/applications`, heading `Applications`.
- [ ] Board: `/board`, heading `Board`.
- [ ] Interviews: `/interviews`, heading `Interviews`.
- [ ] Profile: `/profile`, heading `Profile`.

## Navigation regression checks

- [ ] Only the selected menu item is marked active.
- [ ] Browser Back and Forward restore the expected page.
- [ ] Refresh each menu URL and confirm the page still opens when signed in.
- [ ] Reach each menu link using Tab and activate it with Enter.
- [ ] The navigation landmark has the accessible name `Main navigation`.
- [ ] Signed-out access to `/applications` redirects to `/signin`.
- [ ] Sign-in and sign-up screens remain accessible when signed out; these are authentication screens, not sidebar pages.
- [ ] An unknown route redirects to `/` (then `/signin` if signed out).

## Results

- Tested commit:
- Browser:
- Date:
- Tester:
- Failures or follow-up issues:
