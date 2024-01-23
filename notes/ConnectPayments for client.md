ConnectPayments for client

Account Details

> Create tokens for both bank and card before storing in stripe

- Bank account: <https://stripe.com/docs/api/tokens/create_bank_account>
Routing number: 9 characters
Account number: 0000000000

- Debit card: <https://stripe.com/docs/api/tokens/create_card> | <https://stripe.com/docs/api/external_account_cards/create>
default_for_currency: boolean (whether to make default payout method)

external_account.exp_month
integer
Required
Two-digit number representing the card’s expiration month.

external_account.exp_year
integer
Required
Two- or -four-digit number representing the card’s expiration year.

external_account.number
string
Required
The card number, as a string without any separators.

external_account.object
string
Required
The type of payment source. It should be `card`.

> Use tok_visa_debit for `external_account` in test case
> Limits for debit card payments: Must be a non-prepaid Visa, Mastercard, or Discover card issued by a bank in the United States | Limited to 9,999 USD per payout.
