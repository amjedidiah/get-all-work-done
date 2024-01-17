# account creation

- Get initial account details from individual with form that user gets to accept agreement
- [x] API call to create token(s) with publishable key
 <!-- Only account token for individual, person + account token for business -->

```js

// For individual
const token = await stripe.tokens.create({
  account: {
    business_type: "individual",
    individual: {
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane.doe@gmail.com',
        dob: {
            day: 20,
            month: 1,
            year: 2000
        },
    },
    tos_shown_and_accepted: true,
  },
});

// For business
const token = await stripe.tokens.create({
  account: {
    business_type: "company", // or government_entity, or non_profit
    company: {
      name: document.querySelector('.inp-company-name').value,
    //   address: {
    //     line1: document.querySelector('.inp-company-street-address1').value,
    //     city: document.querySelector('.inp-company-city').value,
    //     state: document.querySelector('.inp-company-state').value,
    //     postal_code: document.querySelector('.inp-company-zip').value,
    //   },
    },
    tos_shown_and_accepted: true,
  },
});
const token = await stripe.tokens.create({
  person: {
    first_name: 'Jane',
    last_name: 'Doe',
    email: 'jane.doe@gmail.com',
    dob: {
        day: 20,
        month: 1,
        year: 2000
    },
    relationship: {
      owner: true,
    },
  },
});

```

- [x] Receive account token and use to create account

```js
const account = await stripe.accounts.create({
  country: 'US',
  type: 'custom',
  capabilities: {
    card_payments: {
      requested: true,
    },
    transfers: {
      requested: true,
    },
  },
  account_token: '{{ACCOUNT_TOKEN_ID}}',
});
```

- [x] For business only, receive person token and use to create person

```js
const person = await stripe.accounts.createPerson(
  '{{CONNECTED_ACCOUNT_ID}}',
  {
    first_name: 'Jane',
    last_name: 'Doe',
    email: 'jane.doe@gmail.com',
    dob: {
        date: 20,
        month: 1,
        year: 2000
    },
    person_token: '{{PERSON_ID}}',
  }
);
```