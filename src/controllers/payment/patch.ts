import { Request, Response } from 'express';
import { handleResponseError, handleValidationErrors } from '../../utils';
import { calculateTax, stripe } from '../../lib/stripe';

const patchPayment = async (request: Request, response: Response) => {
  try {
    // Validate request
    handleValidationErrors(request);

    const { amount, payment_intent_id } = request.body;

    // Recalculate tax
    const calculation = await calculateTax(amount);

    // Update payment intent
    const paymentIntent = await stripe.paymentIntents.update(
      payment_intent_id,
      {
        amount: calculation.amount_total,
        metadata: {
          tax_calculation: calculation.id,
        },
      }
    );

    response.status(200).json({
      data: {
        status: paymentIntent.status,
      },
      message: 'Payment intent updated successfully',
    });
  } catch (error) {
    handleResponseError(response, error);
  }
};

export default patchPayment;
