<?php

namespace Modules\Taxido\Services;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Modules\Taxido\Models\Incentive;
use Modules\Taxido\Models\IncentiveLevel;
use Modules\Taxido\Models\DriverIncentiveProgress;
use Modules\Taxido\Models\Driver;
use Illuminate\Support\Facades\DB;

class IncentiveAnalyticsService
{
    /**
     * Get comprehensive incentive analytics
     */
    public function getAnalytics(Request $request): array
    {
        $startDate = $request->start_date ? Carbon::parse($request->start_date) : Carbon::now()->subDays(30);
        $endDate = $request->end_date ? Carbon::parse($request->end_date) : Carbon::now();

        return [
            'total_payouts' => $this->getTotalPayouts($startDate, $endDate, $request),
            'participation_rate' => $this->getParticipationRate($startDate, $endDate, $request),
            'completion_rate' => $this->getCompletionRate($startDate, $endDate, $request),
            'average_rides_per_driver' => $this->getAverageRidesPerDriver($startDate, $endDate, $request),
            'payouts_by_level' => $this->getPayoutsByLevel($startDate, $endDate, $request),
            'pa_period' => $this->getPayoutsByPeriod($startDate, $endDate, $request),
            'top_performing_drivers' => $this->getTopPerformingDrivers($startDate, $endDate, $request),
            'incentive_effectiveness' => $this->getIncentiveEffectiveness($startDate, $endDate, $request),
        ];
    }

    /**
     * Calculate total payouts by level and period
     */
    public function getTotalPayouts(Carbon $startDate, Carbon $endDate, Request $request): array
    {
        $query = Incentive::achieved()
            ->whereBetween('applicable_date', [$startDate, $endDate]);

        $this->applyFilters($query, $request);

        $totalAmount = $query->sum('bonus_amount');
        $totalCount = $query->count();

        // Get breakdown by currency if multiple currencies exist
        $payoutsByCurrency = $query
            ->join('incentive_levels', 'incentives.incentive_level_id', '=', 'incentive_levels.id')
            ->join('vehicle_type_zones', 'incentive_levels.vehicle_type_zone_id', '=', 'vehicle_type_zones.id')
            ->select(DB::raw('SUM(incentives.bonus_amount) as total_amount'), DB::raw('COUNT(*) as count'))
            ->groupBy('vehicle_type_zones.id')
            ->get();

        return [
            'total_amount' => $totalAmount,
            'total_count' => $totalCount,
            'average_payout' => $totalCount > 0 ? $totalAmount / $totalCount : 0,
            'breakdown' => $payoutsByCurrency,
        ];
    }

    /**
     * Calculate driver participation rate
     */
    public function getParticipationRate(Carbon $startDate, Carbon $endDate, Request $request): array
    {
        // Get total unique drivers who had progress in the period
        $progressQuery = DriverIncentiveProgress::whereBetween('period_date', [$startDate, $endDate]);
        $this->applyProgressFilters($progressQuery, $request);
        $totalDriversWithProgress = $progressQuery->distinct('driver_id')->count();

        // Get drivers who achieved at least one incentive
        $achievementQuery = Incentive::achieved()
            ->whereBetween('applicable_date', [$startDate, $endDate]);
        $this->applyFilters($achievementQuery, $request);
        $driversWithAchievements = $achievementQuery->distinct('driver_id')->count();

        // Get total active drivers in the system for context
        $totalActiveDrivers = Driver::where('status', 'active')->count();

        return [
            'total_drivers' => $totalDriversWithProgress,
            'participating_drivers' => $driversWithAchievements,
            'rate' => $totalDriversWithProgress > 0 ? ($driversWithAchievements / $totalDriversWithProgress) * 100 : 0,
            'total_active_drivers' => $totalActiveDrivers,
            'engagement_rate' => $totalActiveDrivers > 0 ? ($totalDriversWithProgress / $totalActiveDrivers) * 100 : 0,
        ];
    }

    /**
     * Calculate incentive completion rate
     */
    public function getCompletionRate(Carbon $startDate, Carbon $endDate, Request $request): array
    {
        $totalQuery = Incentive::whereBetween('applicable_date', [$startDate, $endDate]);
        $achievedQuery = Incentive::achieved()->whereBetween('applicable_date', [$startDate, $endDate]);

        $this->applyFilters($totalQuery, $request);
        $this->applyFilters($achievedQuery, $request);

        $totalIncentives = $totalQuery->count();
        $achievedIncentives = $achievedQuery->count();

        // Get completion rate by level
        $completionByLevel = Incentive::whereBetween('applicable_date', [$startDate, $endDate])
            ->join('incentive_levels', 'incentives.incentive_level_id', '=', 'incentive_levels.id')
            ->select(
                'incentive_levels.level_number',
                DB::raw('COUNT(*) as total'),
                DB::raw('SUM(CASE WHEN incentives.is_achieved = 1 THEN 1 ELSE 0 END) as achieved'),
                DB::raw('ROUND((SUM(CASE WHEN incentives.is_achieved = 1 THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as completion_rate')
            )
            ->groupBy('incentive_levels.level_number')
            ->orderBy('incentive_levels.level_number')
            ->get();

        return [
            'total_incentives' => $totalIncentives,
            'achieved_incentives' => $achievedIncentives,
            'rate' => $totalIncentives > 0 ? ($achievedIncentives / $totalIncentives) * 100 : 0,
            'completion_by_level' => $completionByLevel,
        ];
    }

    /**
     * Calculate average rides per driver
     */
    public function getAverageRidesPerDriver(Carbon $startDate, Carbon $endDate, Request $request): float
    {
        $query = DriverIncentiveProgress::whereBetween('period_date', [$startDate, $endDate]);
        $this->applyProgressFilters($query, $request);

        $averageRides = $query->avg('current_rides');

        return round($averageRides ?? 0, 2);
    }

    /**
     * Get payouts breakdown by level
     */
    public function getPayoutsByLevel(Carbon $startDate, Carbon $endDate, Request $request): array
    {
        $query = Incentive::achieved()
            ->join('incentive_levels', 'incentives.incentive_level_id', '=', 'incentive_levels.id')
            ->whereBetween('incentives.applicable_date', [$startDate, $endDate])
            ->select(
                'incentive_levels.level_number',
                'incentive_levels.period_type',
                DB::raw('SUM(incentives.bonus_amount) as total_amount'),
                DB::raw('COUNT(*) as total_count'),
                DB::raw('AVG(incentives.bonus_amount) as average_amount')
            )
            ->groupBy('incentive_levels.level_number', 'incentive_levels.period_type')
            ->orderBy('incentive_levels.level_number');

        $this->applyFilters($query, $request);

        return $query->get()->toArray();
    }

    /**
     * Get payouts breakdown by period type
     */
    public function getPayoutsByPeriod(Carbon $startDate, Carbon $endDate, Request $request): array
    {
        $query = Incentive::achieved()
            ->join('incentive_levels', 'incentives.incentive_level_id', '=', 'incentive_levels.id')
            ->whereBetween('incentives.applicable_date', [$startDate, $endDate])
            ->select(
                'incentive_levels.period_type',
                DB::raw('SUM(incentives.bonus_amount) as total_amount'),
                DB::raw('COUNT(*) as total_count'),
                DB::raw('AVG(incentives.bonus_amount) as average_amount')
            )
            ->groupBy('incentive_levels.period_type');

        $this->applyFilters($query, $request);

        return $query->get()->toArray();
    }

    /**
     * Get top performing drivers
     */
    public function getTopPerformingDrivers(Carbon $startDate, Carbon $endDate, Request $request, int $limit = 10): array
    {
        $query = Incentive::achieved()
            ->join('users', 'incentives.driver_id', '=', 'users.id')
            ->whereBetween('incentives.applicable_date', [$startDate, $endDate])
            ->select(
                'users.id',
                'users.name',
                'users.email',
                DB::raw('SUM(incentives.bonus_amount) as total_earned'),
                DB::raw('COUNT(*) as incentives_achieved'),
                DB::raw('COUNT(DISTINCT incentives.incentive_level_id) as levels_completed')
            )
            ->groupBy('users.id', 'users.name', 'users.email')
            ->orderBy('total_earned', 'desc')
            ->limit($limit);

        $this->applyFilters($query, $request);

        return $query->get()->toArray();
    }

    /**
     * Calculate incentive program effectiveness
     */
    public function getIncentiveEffectiveness(Carbon $startDate, Carbon $endDate, Request $request): array
    {
        // Get ride completion data for drivers with incentives vs without
        $driversWithIncentives = Incentive::whereBetween('applicable_date', [$startDate, $endDate])
            ->distinct('driver_id')
            ->pluck('driver_id');

        // Calculate average rides for drivers with incentive programs
        $avgRidesWithIncentives = DriverIncentiveProgress::whereBetween('period_date', [$startDate, $endDate])
            ->whereIn('driver_id', $driversWithIncentives)
            ->avg('current_rides');

        // Calculate average rides for drivers without incentive programs
        $avgRidesWithoutIncentives = DriverIncentiveProgress::whereBetween('period_date', [$startDate, $endDate])
            ->whereNotIn('driver_id', $driversWithIncentives)
            ->avg('current_rides');

        // Calculate ROI (simplified)
        $totalIncentivesPaid = Incentive::achieved()
            ->whereBetween('applicable_date', [$startDate, $endDate])
            ->sum('bonus_amount');

        $totalRidesFromIncentivizedDrivers = DriverIncentiveProgress::whereBetween('period_date', [$startDate, $endDate])
            ->whereIn('driver_id', $driversWithIncentives)
            ->sum('current_rides');

        return [
            'avg_rides_with_incentives' => round($avgRidesWithIncentives ?? 0, 2),
            'avg_rides_without_incentives' => round($avgRidesWithoutIncentives ?? 0, 2),
            'improvement_percentage' => $avgRidesWithoutIncentives > 0
                ? round((($avgRidesWithIncentives - $avgRidesWithoutIncentives) / $avgRidesWithoutIncentives) * 100, 2)
                : 0,
            'total_incentives_paid' => $totalIncentivesPaid,
            'total_rides_generated' => $totalRidesFromIncentivizedDrivers,
            'cost_per_ride' => $totalRidesFromIncentivizedDrivers > 0
                ? round($totalIncentivesPaid / $totalRidesFromIncentivizedDrivers, 2)
                : 0,
        ];
    }

    /**
     * Get time-series data for charts
     */
    public function getTimeSeriesData(Carbon $startDate, Carbon $endDate, Request $request, string $groupBy = 'day'): array
    {
        $dateFormat = match($groupBy) {
            'hour' => '%Y-%m-%d %H:00:00',
            'day' => '%Y-%m-%d',
            'week' => '%Y-%u',
            'month' => '%Y-%m',
            default => '%Y-%m-%d',
        };

        $query = Incentive::achieved()
            ->whereBetween('applicable_date', [$startDate, $endDate])
            ->select(
                DB::raw("DATE_FORMAT(applicable_date, '{$dateFormat}') as period"),
                DB::raw('SUM(bonus_amount) as total_amount'),
                DB::raw('COUNT(*) as total_count')
            )
            ->groupBy('period')
            ->orderBy('period');

        $this->applyFilters($query, $request);

        return $query->get()->toArray();
    }

    /**
     * Export analytics data
     */
    public function exportAnalytics(Request $request, string $format = 'csv'): array
    {
        $analytics = $this->getAnalytics($request);

        // Flatten the data for export
        $exportData = [];

        // Add summary data
        $exportData[] = [
            'Metric' => 'Total Payouts',
            'Value' => $analytics['total_payouts']['total_amount'],
            'Count' => $analytics['total_payouts']['total_count'],
        ];

        $exportData[] = [
            'Metric' => 'Participation Rate',
            'Value' => $analytics['participation_rate']['rate'] . '%',
            'Count' => $analytics['participation_rate']['participating_drivers'] . '/' . $analytics['participation_rate']['total_drivers'],
        ];

        $exportData[] = [
            'Metric' => 'Completion Rate',
            'Value' => $analytics['completion_rate']['rate'] . '%',
            'Count' => $analytics['completion_rate']['achieved_incentives'] . '/' . $analytics['completion_rate']['total_incentives'],
        ];

        $exportData[] = [
            'Metric' => 'Average Rides per Driver',
            'Value' => $analytics['average_rides_per_driver'],
            'Count' => '',
        ];

        return $exportData;
    }

    /**
     * Apply filters to incentive queries
     */
    private function applyFilters($query, Request $request): void
    {
        if ($request->driver && !in_array('all', $request->driver)) {
            $query->whereIn('incentives.driver_id', $request->driver);
        }

        if ($request->vehicle_type && !in_array('all', $request->vehicle_type)) {
            $query->whereHas('incentiveLevel.vehicleTypeZone', function ($q) use ($request) {
                $q->whereIn('vehicle_type_id', $request->vehicle_type);
            });
        }

        if ($request->zone && !in_array('all', $request->zone)) {
            $query->whereHas('incentiveLevel.vehicleTypeZone', function ($q) use ($request) {
                $q->whereIn('zone_id', $request->zone);
            });
        }

        if ($request->period_type && !in_array('all', $request->period_type)) {
            $query->whereHas('incentiveLevel', function ($q) use ($request) {
                $q->whereIn('period_type', $request->period_type);
            });
        }

        if ($request->level && !in_array('all', $request->level)) {
            $query->whereHas('incentiveLevel', function ($q) use ($request) {
                $q->whereIn('level_number', $request->level);
            });
        }
    }

    /**
     * Apply filters to progress queries
     */
    private function applyProgressFilters($query, Request $request): void
    {
        if ($request->driver && !in_array('all', $request->driver)) {
            $query->whereIn('driver_id', $request->driver);
        }

        if ($request->vehicle_type && !in_array('all', $request->vehicle_type)) {
            $query->whereHas('vehicleTypeZone', function ($q) use ($request) {
                $q->whereIn('vehicle_type_id', $request->vehicle_type);
            });
        }

        if ($request->zone && !in_array('all', $request->zone)) {
            $query->whereHas('vehicleTypeZone', function ($q) use ($request) {
                $q->whereIn('zone_id', $request->zone);
            });
        }

        if ($request->period_type && !in_array('all', $request->period_type)) {
            $query->whereIn('period_type', $request->period_type);
        }
    }
}
