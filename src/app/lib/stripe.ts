import stripePackage from "stripe";

const stripe = new stripePackage(process.env.STRIPE_SECRET_KEY as string);
export default stripe;
