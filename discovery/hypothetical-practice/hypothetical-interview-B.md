> **HYPOTHETICAL PRACTICE: not a real interview.** Written by Claude as a practice example. It is not evidence and is not cited in `discovery/requirements.md`.

Interview 2: J.T., Regional Sales Representative

Background: J.T. is on the road 2–3 weeks a month visiting clients. They spend about $1,500 a month on the corporate card (hotels, meals, rental cars) and pay out of pocket for mileage, parking, and tolls.

Problem statement

Interviewer: From your side, what goes wrong with expense reports?

Honestly, I'm one of the people who's late. It's not that I don't care. I'm in airports and client meetings, and by the time I'm back at a laptop I've got a stack of receipts in my bag and half of them are crumpled or gone. The reminder emails land in an inbox with 200 other emails. Then finance messages me, and I feel bad. This happens to me pretty much every month. Last quarter I lost about $180 in parking and mileage because I missed the window and just gave up. It also takes me 1 to 2 hours every time I finally sit down and rebuild everything.

Job to be done
When I'm traveling and paying for something work-related, I want to capture the receipt and details right then in a few seconds, so I can get reimbursed quickly and not have finance chasing me at the end of the month.

Users and stakeholders
Role	Who (initials or title)	What they need from the system
Primary user Regional Sales Rep (and other frequent travelers)	Snap a receipt on the phone when buying something, and get reminders that aren't buried in email
Stakeholder (affected)	Finance / Compliance (D.M.)	Complete reports on time so they don't have to chase anyone
Stakeholder (approves)	Sales Manager	Fast, simple approval from a phone
Stakeholder (pays)	Company (reimbursement budget)	Accurate expenses that follow policy

Not for: "People who expense something once or twice a year. They don't need a whole new workflow. It's for people like me who travel and spend all the time."

Persona

Someone like me. Jordan, 28, Regional Sales Representative. Covers four states and spends more time in a rental car than at a desk. His goal is to get reimbursed fast and never think about expense reports. His frustrations are lost paper receipts, a desktop-only expense site that's painful on a phone, reminder emails buried under client mail, and feeling nagged. His current tools are a phone, a corporate card, a manila envelope of receipts, and the expense website on his laptop on Sunday nights.

Current process (as-is)

This is what actually happens:

Jordan pays for a hotel, meal, or rental car with the corporate card, or pays out of pocket for parking and mileage.
He shoves the paper receipt in a bag or envelope, or forgets to ask for one.
He writes mileage in the notes app on his phone, when he remembers to.
The automated reminder email arrives around day 20. He doesn't see it, or he snoozes it.
Around day 30, the overdue email arrives, then a personal email or Teams message from finance.
On a weekend, he sits down at his laptop, logs into the expense site, and matches each card charge to a receipt.
He emails hotels or restaurants to ask for copies of missing receipts, or fills out a "missing receipt" form.
He gives up on small out-of-pocket items like $8 parking, so he loses that money.
He submits, his manager approves, and reimbursement arrives about a week later.

Functional requirements
ID	The system shall...	Priority (Must / Should / Could / Won't)	Source
FR-1	Let the employee photograph a receipt on a phone and attach it to the matching card charge	Must	Interview 2
FR-2	Send a push or text notification right after a card charge posts, asking for the receipt	Must	Interview 2
FR-3	Show each employee a simple list of open items and how many days are left on each	Must	Interview 2
FR-4	Pre-fill the merchant, amount, and date from the card transaction so the employee only adds the business purpose	Should	Interview 2
FR-5	Track mileage automatically from GPS trips	Could	Interview 2
FR-6	Let managers approve reports from a mobile notification	Should	Interview 2
FR-7	Replace the company's corporate card provider	Won't (out of scope)	Interview 2
Non-functional requirements
ID	Category (usability, security, performance, privacy, cost)	Requirement	Source
NFR-1	Usability	Capturing a receipt takes no more than 3 taps and under 30 seconds	Interview 2
NFR-2	Privacy	Location data is used only for mileage the employee turns on, and is never shared with managers	Interview 2
NFR-3	Performance	The notification arrives within 1 hour of the card charge posting	Interview 2
NFR-4	Usability	No more than one reminder a day, so it doesn't feel like nagging and get muted	Interview 2
Riskiest assumption

J.T.: "The whole idea depends on people like me actually snapping the receipt when we're handed it if the app makes it one tap. If we still put it off until the weekend, a phone app doesn't solve anything. Test: Give 10 traveling reps a basic version, or even just a text that says 'reply with a photo of your receipt,' for two weeks. Track what percentage of receipts come in within 24 hours of the charge. If it's under 60 percent, the assumption is wrong."

MVP scope

In: FR-1 (receipt photo on a phone), FR-2 (notification when a charge posts), FR-3 (open items list with days left).
Out: FR-4 (auto-fill is great but the basic flow comes first), FR-5 (GPS mileage raises privacy issues and takes extra work), FR-6 (manager mobile approval comes after submissions are fixed), FR-7 (changing card providers isn't our call).
