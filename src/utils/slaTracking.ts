const SLA_TIME_MINUTES = 30;

export interface SLATracking {
  timeRemaining: number; // minutes remaining
  timeRemainingSeconds: number; // total seconds remaining
  isUrgent: boolean; // < 5 minutes remaining
  isWarning: boolean; // < 10 minutes remaining
  status: "normal" | "warning" | "urgent" | "expired";
  percentageRemaining: number; // 0-100
}

/**
 * Calculate SLA tracking information based on submission time
 * @param submittedAt ISO string timestamp of when item was submitted
 * @returns SLATracking object with time remaining and status
 */
export function calculateSLA(submittedAt: string): SLATracking {
  const submitted = new Date(submittedAt);
  const now = new Date();
  const elapsed = now.getTime() - submitted.getTime();
  const elapsedMinutes = Math.floor(elapsed / (1000 * 60));
  const elapsedSeconds = Math.floor(elapsed / 1000);
  
  const remainingMinutes = SLA_TIME_MINUTES - elapsedMinutes;
  const remainingSeconds = SLA_TIME_MINUTES * 60 - elapsedSeconds;
  
  const isExpired = remainingMinutes <= 0;
  const isUrgent = !isExpired && remainingMinutes < 5;
  const isWarning = !isExpired && remainingMinutes < 10;
  
  let status: "normal" | "warning" | "urgent" | "expired";
  if (isExpired) {
    status = "expired";
  } else if (isUrgent) {
    status = "urgent";
  } else if (isWarning) {
    status = "warning";
  } else {
    status = "normal";
  }
  
  const percentageRemaining = Math.max(0, Math.min(100, (remainingMinutes / SLA_TIME_MINUTES) * 100));
  
  return {
    timeRemaining: Math.max(0, remainingMinutes),
    timeRemainingSeconds: Math.max(0, remainingSeconds),
    isUrgent,
    isWarning,
    status,
    percentageRemaining,
  };
}

/**
 * Format time remaining as a human-readable string
 * @param timeRemainingMinutes minutes remaining
 * @returns formatted string like "25 min", "2 min", "0 min"
 */
export function formatTimeRemaining(timeRemainingMinutes: number): string {
  if (timeRemainingMinutes <= 0) {
    return "EXPIRED";
  }
  
  if (timeRemainingMinutes < 60) {
    return `${timeRemainingMinutes} min`;
  }
  
  const hours = Math.floor(timeRemainingMinutes / 60);
  const minutes = timeRemainingMinutes % 60;
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}

/**
 * Format time remaining with seconds for detailed display
 * @param timeRemainingSeconds total seconds remaining
 * @returns formatted string like "25:30" (mm:ss)
 */
export function formatTimeRemainingDetailed(timeRemainingSeconds: number): string {
  if (timeRemainingSeconds <= 0) {
    return "00:00";
  }
  
  const minutes = Math.floor(timeRemainingSeconds / 60);
  const seconds = timeRemainingSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Get color class for SLA status
 */
export function getSLAColorClass(status: SLATracking["status"]): string {
  switch (status) {
    case "expired":
      return "text-red-500";
    case "urgent":
      return "text-red-400";
    case "warning":
      return "text-yellow";
    case "normal":
      return "text-green";
    default:
      return "text-gray-400";
  }
}

/**
 * Get background color class for SLA status badge
 */
export function getSLABadgeColorClass(status: SLATracking["status"]): string {
  switch (status) {
    case "expired":
      return "bg-red-500/10 text-red-500 border-red-500";
    case "urgent":
      return "bg-red-500/10 text-red-400 border-red-400";
    case "warning":
      return "bg-yellow/10 text-yellow border-yellow";
    case "normal":
      return "bg-green/10 text-green border-green";
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500";
  }
}

