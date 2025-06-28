export interface OneTimeEvent {
  date: string;
  amount: number;
  name: string;
  type: 'revenue' | 'expense';
}

export interface RecurringItem {
  name?: string;
  source?: string;
  amount: number;
  transaction_type: string;
  recurring_type?: "standard" | "subscription";
  subscription_users?: number;
  subscription_price_per_user?: number;
  subscription_growth_factor?: number;
  date_info: {
    start_date?: string;
    end_date?: string;
    frequency?: string;
  };
}

export interface ProcessedFinancialData {
  oneTimeEvents: OneTimeEvent[];
  recurringRevenues: RecurringItem[];
  recurringExpenses: RecurringItem[];
}

export interface ApiRevenue {
  name?: string;
  source?: string;
  amount: number;
  transaction_type: "one-time" | "recurring";
  recurring_type?: "standard" | "subscription";
  subscription_users?: number;
  subscription_price_per_user?: number;
  subscription_growth_factor?: number;
  date_info?: {
    date?: string;
    start_date?: string;
    end_date?: string;
    frequency?: string;
  };
}

export interface ApiExpense {
  name?: string;
  source?: string;
  amount: number;
  transaction_type: "one-time" | "onetime" | "recurring";
  recurring_type?: "standard" | "subscription";
  subscription_users?: number;
  subscription_price_per_user?: number;
  subscription_growth_factor?: number;
  date_info?: {
    date?: string;
    start_date?: string;
    end_date?: string;
    frequency?: string;
  };
}

export interface ApiHypothetical {
  name: string;
  amount: number;
  type: "revenue" | "expense";
  transaction_type: "one-time" | "recurring";
  recurring_type?: "standard" | "subscription";
  subscription_users?: number;
  subscription_price_per_user?: number;
  subscription_growth_factor?: number;
  enabled: boolean;
  date_info?: {
    date?: string;
    start_date?: string;
    end_date?: string;
    frequency?: string;
  };
}

/**
 * Service for processing financial data from API responses
 */
export class FinancialDataService {
  /**
   * Process raw API data into structured format for components
   */
  static processFinancialData(
    revenues: ApiRevenue[],
    expenses: ApiExpense[],
    hypotheticals: ApiHypothetical[]
  ): ProcessedFinancialData {
    const events: OneTimeEvent[] = [];
    const recRevenues: RecurringItem[] = [];
    const recExpenses: RecurringItem[] = [];

    // Process revenues
    revenues.forEach((item) => {
      if (item.transaction_type === "one-time" && item.date_info?.date) {
        events.push({
          date: item.date_info.date,
          amount: item.amount,
          name: item.source || "One-time revenue",
          type: "revenue"
        });
      } else if (item.transaction_type === "recurring") {
        recRevenues.push({
          name: item.name,
          source: item.source,
          amount: item.amount,
          transaction_type: item.transaction_type,
          recurring_type: item.recurring_type,
          subscription_users: item.subscription_users,
          subscription_price_per_user: item.subscription_price_per_user,
          subscription_growth_factor: item.subscription_growth_factor,
          date_info: item.date_info || {}
        });
      }
    });

    // Process expenses
    expenses.forEach((item) => {
      if ((item.transaction_type === "one-time" || item.transaction_type === "onetime") && item.date_info?.date) {
        events.push({
          date: item.date_info.date,
          amount: item.amount,
          name: item.source || item.name || "One-time expense",
          type: "expense"
        });
      } else if (item.transaction_type === "recurring") {
        recExpenses.push({
          name: item.name,
          source: item.source,
          amount: item.amount,
          transaction_type: item.transaction_type,
          recurring_type: item.recurring_type,
          subscription_users: item.subscription_users,
          subscription_price_per_user: item.subscription_price_per_user,
          subscription_growth_factor: item.subscription_growth_factor,
          date_info: item.date_info || {}
        });
      }
    });

    // Process hypotheticals
    hypotheticals.forEach((item) => {
      if (item.enabled) {
        if (item.transaction_type === "one-time" && item.date_info?.date) {
          events.push({
            date: item.date_info.date,
            amount: item.amount,
            name: item.name,
            type: item.type
          });
        } else if (item.transaction_type === "recurring") {
          const recurringItem: RecurringItem = {
            name: item.name,
            amount: item.amount,
            transaction_type: item.transaction_type,
            recurring_type: item.recurring_type,
            subscription_users: item.subscription_users,
            subscription_price_per_user: item.subscription_price_per_user,
            subscription_growth_factor: item.subscription_growth_factor,
            date_info: item.date_info || {}
          };
          
          if (item.type === "revenue") {
            recRevenues.push(recurringItem);
          } else {
            recExpenses.push(recurringItem);
          }
        }
      }
    });

    return {
      oneTimeEvents: events,
      recurringRevenues: recRevenues,
      recurringExpenses: recExpenses
    };
  }

  /**
   * Fetch all financial data from API endpoints
   */
  static async fetchAllFinancialData(): Promise<ProcessedFinancialData> {
    try {
      const [revenuesResponse, expensesResponse, hypotheticalsResponse] = await Promise.all([
        fetch("/api/investors/revenues"),
        fetch("/api/investors/expenses"),
        fetch("/api/investors/hypotheticals")
      ]);

      const revenues = await revenuesResponse.json() as ApiRevenue[];
      const expenses = await expensesResponse.json() as ApiExpense[];
      const hypotheticals = await hypotheticalsResponse.json() as ApiHypothetical[];

      return this.processFinancialData(revenues, expenses, hypotheticals);
    } catch (error) {
      console.error('Failed to fetch financial data:', error);
      return {
        oneTimeEvents: [],
        recurringRevenues: [],
        recurringExpenses: []
      };
    }
  }
}