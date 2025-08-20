import React, { useState, useEffect, useContext } from "react";
import { StatCard } from "../components/charts/StatCard";
import {
  SimpleBarChart,
  SimplePieChart,
} from "../components/charts/SimpleChart";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";

export const BaseOverview = ({ config }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    if (user?.uid || config.role === "admin") {
      fetchData();
    }
  }, [user, config]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const results = await config.dataFetcher(user);

      setStats(results.stats);
      setChartData(results.chartData);
    } catch (error) {
      console.error(`Error fetching ${config.role} stats:`, error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5D5CDE]"></div>
      </div>
    );
  }

  // Filter charts that have data
  const validCharts = config.charts.filter((chartConfig) => {
    const data = chartData[chartConfig.dataKey];
    return data && data.length > 0;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {config.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">{config.description}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {config.statCards.map((statConfig, index) => (
          <StatCard
            key={index}
            title={statConfig.title}
            value={statConfig.getValue(stats)}
            icon={statConfig.icon}
            color={statConfig.color}
            subtext={statConfig.subtext}
          />
        ))}
      </div>

      {/* Charts - Dynamic Layout */}
      {validCharts.length > 0 && (
        <div
          className={`grid gap-6 ${
            validCharts.length === 1
              ? "grid-cols-1"
              : "grid-cols-1 lg:grid-cols-2"
          }`}
        >
          {validCharts.map((chartConfig, index) => {
            const data = chartData[chartConfig.dataKey];

            return chartConfig.type === "bar" ? (
              <SimpleBarChart
                key={index}
                data={data}
                dataKey={chartConfig.chartDataKey}
                xAxisKey={chartConfig.xAxisKey}
                title={chartConfig.title}
              />
            ) : (
              <SimplePieChart
                key={index}
                data={data}
                title={chartConfig.title}
                colors={chartConfig.colors}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
