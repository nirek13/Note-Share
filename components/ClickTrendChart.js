"use client";

import { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { 
  aggregateClicksByTime, 
  aggregateMultipleLinksData, 
  formatChartDate, 
  getTimeRangeLabel 
} from '@/lib/chartUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ClickTrendChart({ 
  clickHistory, 
  linksData = null, // For group view
  title = "Click Trends",
  height = 300 
}) {
  const [granularity, setGranularity] = useState('daily');
  const [chartType, setChartType] = useState('line');
  const [timeRange, setTimeRange] = useState('all');

  // Filter data based on time range
  const filteredData = useMemo(() => {
    if (!clickHistory && !linksData) return null;
    
    const now = new Date();
    let cutoffDate = null;
    
    switch (timeRange) {
      case '7d':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        cutoffDate = null;
    }
    
    if (linksData) {
      // Group view - multiple links
      const filtered = cutoffDate 
        ? linksData.map(link => ({
            ...link,
            clickHistory: (link.clickHistory || []).filter(click => 
              new Date(click.timestamp) >= cutoffDate
            )
          }))
        : linksData;
      return filtered;
    } else {
      // Single link view
      return cutoffDate 
        ? (clickHistory || []).filter(click => new Date(click.timestamp) >= cutoffDate)
        : clickHistory;
    }
  }, [clickHistory, linksData, timeRange]);

  const chartData = useMemo(() => {
    if (!filteredData) return null;

    if (linksData) {
      // Multiple links (group view)
      const { data, colors } = aggregateMultipleLinksData(filteredData, granularity);
      
      if (data.length === 0) return null;
      
      const linkNames = Object.keys(data[0]).filter(key => key !== 'date');
      
      const datasets = linkNames.map((linkName, index) => ({
        label: linkName,
        data: data.map(item => item[linkName] || 0),
        borderColor: colors[index],
        backgroundColor: chartType === 'area' ? `${colors[index]}20` : colors[index],
        fill: chartType === 'area',
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
        borderWidth: 2
      }));

      return {
        labels: data.map(item => formatChartDate(item.date, granularity)),
        datasets
      };
    } else {
      // Single link view
      const aggregated = aggregateClicksByTime(filteredData, granularity);
      
      if (aggregated.length === 0) return null;
      
      return {
        labels: aggregated.map(item => formatChartDate(item.date, granularity)),
        datasets: [{
          label: 'Clicks',
          data: aggregated.map(item => item.count),
          borderColor: '#7C3AED',
          backgroundColor: chartType === 'area' ? '#7C3AED20' : '#7C3AED',
          fill: chartType === 'area',
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 7,
          borderWidth: 3
        }]
      };
    }
  }, [filteredData, granularity, chartType, linksData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        display: linksData ? true : false,
        labels: {
          color: '#374151',
          font: {
            size: 12
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: '#111827',
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: (context) => {
            return context[0].label;
          },
          label: (context) => {
            const label = context.dataset.label || '';
            return `${label}: ${context.parsed.y} clicks`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: '#F3F4F6',
          borderColor: '#E5E7EB'
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11
          },
          maxRotation: 45
        },
        title: {
          display: true,
          text: 'Time',
          color: '#374151',
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#F3F4F6',
          borderColor: '#E5E7EB'
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11
          },
          precision: 0
        },
        title: {
          display: true,
          text: getTimeRangeLabel(granularity),
          color: '#374151',
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  if (!chartData || chartData.datasets[0].data.every(val => val === 0)) {
    return (
      <div style={{ 
        height: height, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#F9FAFB',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        color: '#6B7280'
      }}>
        No click data available for the selected time period
      </div>
    );
  }

  return (
    <div>
      {/* Chart Controls */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1rem',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div>
          <label style={{ fontSize: '0.75rem', color: '#6B7280', marginRight: '0.5rem' }}>
            Time Range:
          </label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            style={{
              padding: '0.25rem 0.5rem',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              fontSize: '0.75rem',
              background: '#FFFFFF'
            }}
          >
            <option value="all">All Time</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.75rem', color: '#6B7280', marginRight: '0.5rem' }}>
            Granularity:
          </label>
          <select
            value={granularity}
            onChange={(e) => setGranularity(e.target.value)}
            style={{
              padding: '0.25rem 0.5rem',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              fontSize: '0.75rem',
              background: '#FFFFFF'
            }}
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.75rem', color: '#6B7280', marginRight: '0.5rem' }}>
            Chart Type:
          </label>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            style={{
              padding: '0.25rem 0.5rem',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              fontSize: '0.75rem',
              background: '#FFFFFF'
            }}
          >
            <option value="line">Line</option>
            <option value="area">Area</option>
          </select>
        </div>
      </div>

      {/* Chart */}
      <div style={{
        height: height,
        background: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        padding: '1rem'
      }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}