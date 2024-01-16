# Planning

## Decision Making

Chose Stripe Connect Custom account with **_Connect Onboarding_** using the guide from here: <https://stripe.com/en-gb-us/connect/pricing>, based on these particular client requirements:

- Custom contractor onboarding and client payment forms
- Custom dashboards to manage contractor payouts
- Ability to modify contractor payout schedule
- Ability to modify contractor account details

## Implementation Steps

- [Stripe Connect Account Creation](#stripe-connect-account-creation)
- [Contractor Onboarding](#contractor-onboarding)
- [Client payment flow](#client-payment-flow)
- [Commission Calculation](#commission-calculation)
- [Payout to Contractors](#payout-to-contractors)
- [Configure Webhooks](#configure-webhooks)
- [Fraud mitigation](#fraud-mitigation)
- [Implement Frontend Integration](#implement-frontend-integration)
- [Testing](#testing)
- [Documentation](#documentation)
<!-- - User dashboard
- Reporting functionality
- Communication channels -->

### Stripe Connect Account Creation

- [x] Create Platform Custom accounts: done by Arjun

### Contractor Onboarding

> Stripe recommends using account tokens for account creation and update calls

- [x] Indicate acceptance of platform's service agreement which should include Stripe's service agreement
- [x] Create a contractor account with email, DOB, type(whether individual or business) and company_name for business type
- [x] Collect customer KYC details (without showing Stripe branding) and submit to Stripe
- [ ] Collect customer account details
- [ ] API endpoints to securely receive contractor document uploads and handle the communication with Stripe
- [ ] Provide means for contractors to download and reupload 1099 Tax documentation
- [ ] Provide means for contractors to re-agree to Stripe service agreement on transfer of account or change of Tax Number

#### Things to Note

- Communicate to contractors that their documents are processed securely through the app without explicitly mentioning Stripe, using clear branding and messaging to reinforce trust and confidence in the app.
- For Stripe to lawfully process personal data according to said instructions, you can be legally required to provide additional disclosures or obtain additional consent. Talk to your lawyer about those possible disclosures and consent.
- Additional cost of $2/month for every contractor account that has received at least one payout on the platform.
- The platform is entirely responsible for fraud detection and prevention and will bear these losses.

### Client payment flow

- [ ] Collect and save client credit card details
- [ ] Implement logic to charge cards on the collection of details
- [ ] Implement logic to charge cards on client action

> Communicate to clients that their transactions are processed securely through the app without explicitly mentioning Stripe, using clear branding and messaging to reinforce trust and confidence in the app.

### Commission Calculation

- [ ] Use Stripe application fees to automate commission deductions
- [ ] Allow admin to edit percentage sharing
- [ ] Allow admin to edit contractors' connect account IDs

### Payout to Contractors

- [ ] Implement payouts to fixed contractor numbers using a bank account or debit card
- [ ] Implement payouts to dynamic contractor number
- [ ] Implement weekly payout schedule
- [ ] Implement instant payout schedule on request

### Configure Webhooks

- [ ] Setup [Connect webhooks](https://stripe.com/docs/connect/webhooks) on live mode
- [ ] Listen for `account.updated` webhook events for when Stripe shuts down an account
- [ ] Listen for `account.updated` webhook events to detect changes to capability states based on verification of onboarding details

### Fraud mitigation

#### Steps to Prevent Fraud

- Verify contractors (within a certain amount of time) before they can do business through the app.
- Examine a contractor’s online presence through social or professional profiles like Facebook, Twitter, or LinkedIn.
- Closely review the contractor’s website (should they reasonably have one).
- Collect appropriate licenses if appropriate for their business.
- Confirm their email address if it’s linked to their business domain (for example, send an email to an address at that domain and require a response from it).
- Collect and verify platform-appropriate information such as a physical address, inventory list, or selling history.
- Monitor activity on the platform to get a sense of typical behaviour, which you can use to look for suspicious behaviour.
- Pause payments or payouts when suspicious behaviour is detected.
- Add additional verifications to Connect onboarding and disable payouts or payments until the checks pass, using [Stripe Identity](https://stripe.com/docs/identity)
- [Reject suspicious accounts](https://stripe.com/docs/api/account/reject)

#### Explore Using Radar with Connect

<https://stripe.com/docs/connect/radar>

### Implement Frontend Integration

- [ ] Create API endpoints on the backend to communicate with the Flutter front end.
- [ ] Update the Flutter front end to trigger payment actions and display relevant information to users.

### Testing

- [ ] Test the entire payment flow in the sandbox: verify that payments are correctly processed, commissions are calculated, and payouts are successful.
- [ ] Test the entire payment flow in a live environment: verify that payments are correctly processed, commissions are calculated, and payouts are successful.

### Documentation

- [x] Document the integration process and provide clear instructions for ongoing maintenance.

#### Terms and Privacy Update

- [ ] Include in the app's terms and service, a link to the [Stripe Recipient Agreement](https://stripe.com/connect-account/legal/recipient), clearly stating that accepting current app terms includes accepting the Stripe recipient service agreement. This can be done by updating current terms and service with the following:

```md
GetAllWorkDone uses Stripe to make payouts to contractors. The Stripe Recipient Agreement applies to your receipt of such Payouts. To receive payouts from GetAllWorkDone, you must provide GetAllWorkDone accurate and complete information about you and your business, and you authorize GetAllWorkDone to share it and transaction information related to your payout with Stripe.
```

- [ ] Include Stripe acquirer disclosure in the app's terms and service

```md
Acquirer Disclosure
Payment services are powered by Stripe, Inc. Stripe, Inc. is a Payment Facilitator and/or ISO of:

- Cross River Bank, 2115 Linwood Avenue, Fort Lee, NJ 07024, info@crossriver.com or +1-201-808-7000 (Payment Facilitator and ISO),
- Goldman Sachs Bank USA, 200 West Street, New York, New York 10282, txb-client-service@gs.com or +1-212-902-2000 (Payment Facilitator),
- PNC Bank, N.A., 1600 Market Street, 8th Floor, Pittsburgh, PA 19103, +1-800-PNC-BANK (Payment Facilitator and ISO), and
- Wells Fargo Bank, N.A., P.O. Box 6079, Concord, CA 94524, +1-844-284-6834 (Payment Facilitator and ISO).
```

- [ ] Include in the app's privacy policy, a link to Stripe’s Privacy Policy and the following language:

```md
When you provide personal data in connection with the [Payment Services: term to identify services Stripe provides to contractors], Stripe receives that personal data and processes it following [Stripe’s Privacy Policy](https://stripe.com/privacy).
```

## Extras

## Meeting Discussion

- [x] Will contractors only be US-based? not only US-based, but start with US-based
- [x] Are contractors individuals only, or can they be individuals and businesses? Both
- [ ] Which tax form is best for the platform: the 1099-MISC form or the 1099-K form?
- [x] What database is the application currently using, so I can integrate with it? MySQL | DynamoDB

## Blockers

- [ ] Issues with account creation

## Resources

- [Using Connect with Custom accounts](https://stripe.com/docs/connect/custom-accounts#identity-verification)
- [Account Tokens](https://stripe.com/docs/connect/account-tokens#stripe-connected-account-agreement)
- [Create an account token](https://stripe.com/docs/api/tokens/create_account)
- [Create a person token](https://stripe.com/docs/api/tokens/create_person)
- [Create an account](https://stripe.com/docs/api/accounts/create)
