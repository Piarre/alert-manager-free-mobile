export interface Payload {
  alerts: Alert[];
  status: string;
  groupLabels: Record<string, string>;
}

export interface Alert {
  status: string;
  labels: {
    alertname?: string;
    instance?: string;
    severity?: string;
  };
  annotations: {
    summary?: string;
    description?: string;
  };
}
