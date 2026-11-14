export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getOffsetDateString(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatEditorialDate(dateString?: string): string {
  const date = dateString ? new Date(dateString + 'T00:00:00') : new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
}

export function formatShortDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatDueText(dueDate: string, dueTime?: string): { text: string; isOverdue: boolean; isToday: boolean } {
  if (!dueDate) return { text: '', isOverdue: false, isToday: false };

  const todayStr = getTodayString();
  const tomorrowStr = getOffsetDateString(1);
  const yesterdayStr = getOffsetDateString(-1);

  const isToday = dueDate === todayStr;
  const isTomorrow = dueDate === tomorrowStr;
  const isYesterday = dueDate === yesterdayStr;
  const isOverdue = dueDate < todayStr;

  let text = '';
  if (isToday) {
    text = dueTime ? `Today at ${formatTime(dueTime)}` : 'Today';
  } else if (isTomorrow) {
    text = dueTime ? `Tomorrow at ${formatTime(dueTime)}` : 'Tomorrow';
  } else if (isYesterday) {
    text = 'Yesterday';
  } else {
    text = formatShortDate(dueDate);
    if (dueTime) {
      text += ` at ${formatTime(dueTime)}`;
    }
  }

  return { text, isOverdue, isToday };
}

export function formatTime(time24: string): string {
  if (!time24) return '';
  const parts = time24.split(':');
  if (parts.length < 2) return time24;
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours}:${minutes} ${ampm}`;
}

export function getGreeting(): { greeting: string; subtitle: string } {
  const hour = new Date().getHours();
  let greeting = 'Good morning.';
  if (hour >= 12 && hour < 17) {
    greeting = 'Good afternoon.';
  } else if (hour >= 17) {
    greeting = 'Good evening.';
  }
  return {
    greeting,
    subtitle: "Here's what your day looks like.",
  };
}
