// Utility functions for processing click data for charts

export function aggregateClicksByTime(clickHistory, granularity = 'daily') {
  if (!clickHistory || clickHistory.length === 0) {
    return [];
  }

  // Sort clicks by timestamp
  const sortedClicks = [...clickHistory].sort((a, b) => 
    new Date(a.timestamp) - new Date(b.timestamp)
  );

  const aggregated = {};
  
  sortedClicks.forEach(click => {
    const date = new Date(click.timestamp);
    let key;
    
    switch (granularity) {
      case 'hourly':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:00`;
        break;
      case 'weekly':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
        break;
      case 'monthly':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      default: // daily
        key = date.toISOString().split('T')[0];
        break;
    }
    
    aggregated[key] = (aggregated[key] || 0) + 1;
  });

  // Convert to array and fill gaps for consistent visualization
  const result = Object.entries(aggregated).map(([date, count]) => ({
    date,
    count,
    timestamp: new Date(date)
  }));

  return fillTimeGaps(result, granularity);
}

function fillTimeGaps(data, granularity) {
  if (data.length === 0) return data;

  const sorted = data.sort((a, b) => a.timestamp - b.timestamp);
  const filled = [];
  
  const start = new Date(sorted[0].timestamp);
  const end = new Date(sorted[sorted.length - 1].timestamp);
  
  let current = new Date(start);
  
  while (current <= end) {
    const existing = sorted.find(item => {
      const itemDate = new Date(item.timestamp);
      switch (granularity) {
        case 'hourly':
          return itemDate.getTime() === current.getTime();
        case 'weekly':
          return Math.abs(itemDate - current) < 7 * 24 * 60 * 60 * 1000;
        case 'monthly':
          return itemDate.getFullYear() === current.getFullYear() && 
                 itemDate.getMonth() === current.getMonth();
        default: // daily
          return itemDate.toDateString() === current.toDateString();
      }
    });
    
    filled.push({
      date: formatDateForGranularity(current, granularity),
      count: existing ? existing.count : 0,
      timestamp: new Date(current)
    });
    
    // Increment current date based on granularity
    switch (granularity) {
      case 'hourly':
        current.setHours(current.getHours() + 1);
        break;
      case 'weekly':
        current.setDate(current.getDate() + 7);
        break;
      case 'monthly':
        current.setMonth(current.getMonth() + 1);
        break;
      default: // daily
        current.setDate(current.getDate() + 1);
        break;
    }
  }
  
  return filled;
}

function formatDateForGranularity(date, granularity) {
  switch (granularity) {
    case 'hourly':
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:00`;
    case 'weekly':
      return date.toISOString().split('T')[0];
    case 'monthly':
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    default: // daily
      return date.toISOString().split('T')[0];
  }
}

export function aggregateMultipleLinksData(linksData, granularity = 'daily') {
  const combinedData = {};
  const linkColors = ['#7C3AED', '#22C55E', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#10B981', '#F97316'];
  
  linksData.forEach((linkData, index) => {
    const { id, title, clickHistory } = linkData;
    const aggregated = aggregateClicksByTime(clickHistory, granularity);
    
    aggregated.forEach(({ date, count }) => {
      if (!combinedData[date]) {
        combinedData[date] = { date };
      }
      combinedData[date][`${title || id}`] = count;
    });
  });
  
  const result = Object.values(combinedData).sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );
  
  return {
    data: result,
    colors: linkColors.slice(0, linksData.length)
  };
}

export function formatChartDate(dateString, granularity) {
  const date = new Date(dateString);
  
  switch (granularity) {
    case 'hourly':
      return date.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: 'numeric',
        hour12: true 
      });
    case 'weekly':
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    case 'monthly':
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
    default: // daily
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
  }
}

export function getTimeRangeLabel(granularity) {
  switch (granularity) {
    case 'hourly':
      return 'Clicks per Hour';
    case 'weekly':
      return 'Clicks per Week';
    case 'monthly':
      return 'Clicks per Month';
    default:
      return 'Clicks per Day';
  }
}