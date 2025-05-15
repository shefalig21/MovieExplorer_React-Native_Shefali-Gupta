export interface PlanType{
  id: string;
  title: string;
  duration: string;
  price: string;
  features: string[];
}

export interface SubscriptionStatusType{
  status: string | null;
}


export interface CreateSubscriptionResultType{
  checkout_url?: string;
}
