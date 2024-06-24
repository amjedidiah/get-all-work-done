import { Request, Response } from 'express';
import { handleResponseError, handleValidationErrors } from '../../utils';
import { calculateTax, stripe } from '../../lib/stripe';

const postPayment = async (request: Request, response: Response) => {
  try {
    // Validate request
    handleValidationErrors(request);

    const { amount, transfer_group } = request.body;

    // * TODO: Verify transfer_group is a valid gig id with the right amount

    // Calculate tax
    const calculation = await calculateTax(amount);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculation.amount_total,
      currency: 'usd',
      transfer_group,
      metadata: {
        gigId: transfer_group,
        tax_calculation: calculation.id,
      },
    });

    response.status(201).json({
      data: {
        payment_intent: paymentIntent,
      },
      message: 'Payment intent created successfully',
    });
  } catch (error) {
    handleResponseError(response, error);
  }
};

export default postPayment;
