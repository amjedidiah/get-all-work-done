// ! Requirements logic
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require("stripe")("sk_test_yFAUfTbE3jR3yg2hHyhRtAFH00G4XGy8rU");

const accountState = (account) => {
  const reqs = account.requirements;

  if (reqs.disabled_reason && reqs.disabled_reason.indexOf("rejected") > -1) {
    return "rejected";
  }

  if (account.payouts_enabled && account.charges_enabled) {
    if (reqs.pending_verification) {
      return "pending enablement";
    }

    if (!reqs.disabled_reason && !reqs.currently_due) {
      if (!reqs.eventually_due) {
        return "complete";
      } else {
        return "enabled";
      }
    } else {
      return "restricted";
    }
  }

  if (!account.payouts_enabled && account.charges_enabled) {
    return "restricted (payouts disabled)";
  }

  if (!account.charges_enabled && account.payouts_enabled) {
    return "restricted (charges disabled)";
  }

  if (reqs.past_due) {
    return "restricted (past due)";
  }

  if (reqs.pending_verification) {
    return "pending (disabled)";
  }

  return "restricted";
};

const main = async () => {
  const accounts = await stripe.accounts.list({ limit: 10 });

  accounts.data.forEach((account) => {
    console.log(`${account.id} has state: ${accountState(account)}`);
  });
};

main();
