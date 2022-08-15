
export interface CustomerType {
  id?: string
  name?: string;
  status?: number;
  phone?: string;
  email?: string;
  created_at?: any;
}

export interface SalesOpportunityType {
  id?: string
  name?: string;
  status?: number;
  customer_id?: string;
}
