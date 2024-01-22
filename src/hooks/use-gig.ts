import { gigs } from "@/constants";

export default function useGig(gigId: string | null) {
  if (!gigId) return;
  return gigs.find((gig) => gig.id === gigId);
}
