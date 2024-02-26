// Hard-coding gigs, make-shift for DB data
export const gigs = [
  {
    id: 'gig_khwe32',
    title: 'Lumber cutting',
    price: 2000,
    platformFeePercentage: 0.1,
    contractors: [{ id: 'acct_1OafF3IKQoAn7HFi', isSettled: true }],
    status: 'settled',
  },
  {
    id: 'gig_u2dn1f',
    title: 'Snow packing',
    price: 5000,
    platformFeePercentage: 0.2,
    contractors: [
      { id: 'acct_1OZhPTI89diiTOrD', isSettled: true },
      { id: 'acct_1OZHXtIZ3hc5uLXA', isSettled: true },
    ],
    status: 'settled',
  },
  {
    id: 'gig_k2dq1f',
    title: 'Marble sweeping',
    price: 5000,
    platformFeePercentage: 0.1,
    contractors: [
      { id: 'acct_1OZhPTI89diiTOrD', percentageShare: 0.5, isSettled: true },
      { id: 'acct_1OZhkwIGWz9N1AyF', percentageShare: 0.2, isSettled: true },
      { id: 'acct_1OafF3IKQoAn7HFi', percentageShare: 0.3, isSettled: true },
    ],
    status: 'settled',
  },
  {
    id: 'gig_k3yweh',
    title: 'Concrete sweeping',
    price: 3000,
    platformFeePercentage: 0.2,
    contractors: [
      { id: 'acct_1OZhPTI89diiTOrD', percentageShare: 0.5, isSettled: true },
      { id: 'acct_1OZhkwIGWz9N1AyF', percentageShare: 0.2, isSettled: true },
      { id: 'acct_1OafF3IKQoAn7HFi', isSettled: true },
      { id: 'acct_1OZHXtIZ3hc5uLXA', isSettled: true },
    ],
    status: 'settled',
  },
  {
    id: 'gig_r24n1a',
    title: 'Wood making',
    price: 4000,
    platformFeePercentage: 0.3,
    contractors: [
      { id: 'acct_1OZhPTI89diiTOrD', isSettled: false },
      { id: 'acct_1OZhkwIGWz9N1AyF', isSettled: false },
      { id: 'acct_1OafF3IKQoAn7HFi', isSettled: false },
    ],
    status: 'in progress',
  },
  {
    id: 'gig_922jd9',
    title: 'Road repairs',
    price: 10000,
    platformFeePercentage: 0.15,
    contractors: [
      { id: 'acct_1OZhkwIGWz9N1AyF', isSettled: true },
      { id: 'acct_1OZF0aRH70YkBmCp', isSettled: true },
      { id: 'acct_1OZhPTI89diiTOrD', isSettled: true },
    ],
    status: 'settled',
  },
  {
    id: 'gig_93bj79',
    title: 'Lawn mowing',
    price: 10000,
    platformFeePercentage: 0.05,
    contractors: [
      { id: 'acct_1OaemaRP8u8di6rL', isSettled: true },
      { id: 'acct_1OZF0aRH70YkBmCp', isSettled: true },
      { id: 'acct_1OZHXtIZ3hc5uLXA', isSettled: true },
      { id: 'acct_1OZhkwIGWz9N1AyF', isSettled: true },
    ],
    status: 'settled',
  },
];

export const isDev = process.env.NODE_ENV === 'development';