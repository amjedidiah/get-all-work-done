# todo

## Meeting Discussion

- [ ] Will contractors only be US-based?
- [ ] Are contractors individuals only, or they can be individuals and businesses?
- [ ] Which tax form is best for platform: 1099-MISC form or 1099-K form?

- [ ] Issue with account creation
- [ ] What database is the application currently using, so I can integrate with it?

## Decision Making

Chose Stripe Connect Custom account with **_Connect Onboarding_** using guide from here: <https://stripe.com/en-gb-us/connect/pricing>, based on these particular client requirements:

- Custom contractor onboarding and client payment forms
- Custom dashboards for contractors to manage their payouts
- Ability to modify contractor payouts schedule
- Ability to modify contractor account details

## Implementation Requirements

- Onboarding flow
- User dashboard
- Reporting functionality
- Communication channels

## Implementation Steps

### Stripe Connect Account Creation

> Stripe recommends to use account tokens

- [ ] Create custom accounts for platform

#### Create custom accounts for contractors

- [ ] Collect customer KYC documents (without showing Stripe branding) and submit to Stripe: SSN, account number
- [ ] API endpoints to securely receive contractor document uploads and handle the communication with Stripe
- [ ] Provide means for contractors to download and reupload 1099 Tax documentation
- [ ] Include in app's terms and service, a link to [Stripe Recipient Agreement](https://stripe.com/connect-account/legal/recipient), clearly stating that accepting current app terms includes accepting the Stripe recipient service agreement. This can be done by updating current terms and service with the following:

```md
[App name] use Stripe to make payouts to contractors. The Stripe Recipient Agreement applies to your receipt of such Payouts. To receive payouts from [App name], you must provide [App name] accurate andcomplete information about you and your business, and you authorize [App name] to share it and transaction information related to your payout with Stripe.
```

- [ ] Indicate acceptance of service agreement to Stripe with upsate account call:

```js
const account = await stripe.accounts.update("{{CONNECTED_ACCOUNT_ID}}", {
  tos_acceptance: {
    date: 1609798905,
    ip: "8.8.8.8",
  },
});
```

- [ ] Provide means for contractors to re-agree to Stripe service agreement on transfer of account or change of Tax Number

- [ ] Include Stripe acquirer disclosure in app's terms and service

```md
Acquirer Disclosure
Payment services are powered by Stripe, Inc. Stripe, Inc. is a Payment Facilitator and/or ISO of:

- Cross River Bank, 2115 Linwood Avenue, Fort Lee, NJ 07024, info@crossriver.com or +1-201-808-7000 (Payment Facilitator and ISO),
- Goldman Sachs Bank USA, 200 West Street, New York, New York 10282, txb-client-service@gs.com or +1-212-902-2000 (Payment Facilitator),
- PNC Bank, N.A., 1600 Market Street, 8th Floor, Pittsburgh, PA 19103, +1-800-PNC-BANK (Payment Facilitator and ISO), and
- Wells Fargo Bank, N.A., P.O. Box 6079, Concord, CA 94524, +1-844-284-6834 (Payment Facilitator and ISO).
```

- [ ] Include in app's privacy policy, a link to Stripe’s Privacy Policy and the following language:

```md
When you provide personal data in connection with the [Payment Services: term to identify services Stripe provides to contractors], Stripe receives that personal data and processes it in accordance with [Stripe’s Privacy Policy](https://stripe.com/privacy).
```

> Communicate to contractors that their documents are processed securely through the app without explicitly mentioning Stripe, using clear branding and messaging to reinforce trust and confidence in the app.
> For Stripe to lawfully process personal data according to your instructions, you can be legally required to provide additional disclosures or obtain additional consents. Talk to your lawyer about those possible disclosures and consents.
> Additional cost of $2/month for every contractor accounts that has received at least one payout on the platform
> Platform is entirely responsible for fraud detection and prevention, and as such will bear the losses from these

### Client payment flow

- [ ] Collect and save client credit card details
- [ ] Implement logic to charge cards on collection of details
- [ ] Implement logic to charge cards on client action

> Communicate to clients that their transactions are processed securely through the app without explicitly mentioning Stripe, using clear branding and messaging to reinforce trust and confidence in the app.

### Commission Calculation

- [ ] Use Stripe application fees to automate commission deductions
- [ ] Allow admin to edit percentage sharing
- [ ] Allow admin to edit contractors connect account IDs

### Payout to Contractors

- [ ] Implement payouts to fixed contractor number using bank account or debit card
- [ ] Implement payouts to dynamic contractor number
- [ ] Implement weekly payout schedule
- [ ] Implement instant payout schedule on request

### Implement Frontend Integration

- [ ] Create API endpoints on the backend to handle communication with the frontend.
- [ ] Update the frontend to trigger payment actions and display relevant information to users.

## Fraud mitigation

### Steps to prevent fraud

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

### Explore Using Radar with Connect

<https://stripe.com/docs/connect/radar>

### Webhooks

- [ ] Setup [Connect webhooks](https://stripe.com/docs/connect/webhooks) on live mode
- [ ] Listen for when stripe shuts down an account using the `account.updated` event

### Testing

- [ ] Test the entire payment flow in sandbox: verify that payments are correctly processed, commissions are calculated, and payouts are successful.
- [ ] Test the entire payment flow in live environment: verify that payments are correctly processed, commissions are calculated, and payouts are successful.

### Documentation

- [ ] Document the integration process and provide clear instructions for ongoing maintenance.
