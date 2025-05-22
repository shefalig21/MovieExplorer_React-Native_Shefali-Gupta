export interface PlanType{
  id: string;
  title: string;
  duration: string;
  price: string;
  features: string[];
}

// export interface SubscriptionStatusType{
//   status: string | null;
// }
export type SubscriptionStatusType = '1-day' | '1-month' | '3-months' | 'free' | 'No Plan' | null;


export interface CreateSubscriptionResultType{
  checkout_url?: string;
}




