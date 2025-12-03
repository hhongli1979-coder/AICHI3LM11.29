<?php

namespace Modules\Taxido\Tables;

use Illuminate\Http\Request;
use Modules\Taxido\Models\ReferralBonus;
use Modules\Taxido\Enums\RoleEnum;

class ReferralTable
{
  protected $referral;
  protected $request;

  protected $sortableColumns = [
    'referrer.name',
    'referred.name',
    'referrer_type',
    'referred_type',
    'bonus_amount',
    'referred_bonus_amount',
    'ride_amount',
    'referrer_percentage',
    'referred_percentage',
    'status',
    'credited_at',
    'created_at',
  ];

  public function __construct(Request $request)
  {
    $this->referral = ReferralBonus::query();
    $this->request = $request;
  }

  public function getReferrals($applyRoleFilter = true)
  {
    $referrals = $this->referral->newQuery();
    $roleName = getCurrentRoleName();
    $currentUserId = getCurrentUserId();

    if ($applyRoleFilter && $roleName === RoleEnum::RIDER) {
      $referrals->where('referrer_id', $currentUserId);
    }

    return $referrals;
  }

  public function getData()
  {
    $referrals = $this->getReferrals();

    $referrals->whereNull('deleted_at')
      ->with(['referrer', 'referred']);

    if ($this->request->has('status')) {
      $referrals->where('status', $this->request->status);
    }

    // Add user type filtering
    if ($this->request->has('user_type') && $this->request->user_type !== 'all') {
      $userType = $this->request->user_type;
      $referrals->where(function($query) use ($userType) {
        $query->where('referrer_type', $userType)
              ->orWhere('referred_type', $userType);
      });
    }

    if ($this->request->has('filter')) {
      switch ($this->request->filter) {
        case 'pending':
          $referrals->where('status', 'pending');
          break;
        case 'credited':
          $referrals->where('status', 'credited');
          break;
        case 'trash':
          return $referrals->withTrashed()
            ->whereNotNull('deleted_at')
            ->paginate($this->request->paginate ?? 15);
      }
    }

    if ($this->request->has('s')) {
      $search = $this->request->s;
      $referrals->withTrashed()
        ->leftJoin('users as referrer_users', 'referral_bonuses.referrer_id', '=', 'referrer_users.id')
        ->leftJoin('users as referred_users', 'referral_bonuses.referred_id', '=', 'referred_users.id')
        ->select('referral_bonuses.*')
        ->where(function ($q) use ($search) {
          $q->where('referrer_users.name', 'LIKE', "%{$search}%")
            ->orWhere('referrer_users.email', 'LIKE', "%{$search}%")
            ->orWhere('referred_users.name', 'LIKE', "%{$search}%")
            ->orWhere('referred_users.email', 'LIKE', "%{$search}%")
            ->orWhere('referral_bonuses.bonus_amount', 'LIKE', "%{$search}%")
            ->orWhere('referral_bonuses.referred_bonus_amount', 'LIKE', "%{$search}%");
        });
    }

    $referrals = $this->sorting($referrals);
    return $referrals->latest()->paginate($this->request->paginate ?? 15);
  }

  public function getReferralCountByStatus($status)
  {
    return $this->getReferrals()
      ->where('status', $status)
      ->count();
  }

  public function getReferralCountByUserType($userType)
  {
    return $this->getReferrals()
      ->where(function($query) use ($userType) {
        $query->where('referrer_type', $userType)
              ->orWhere('referred_type', $userType);
      })
      ->count();
  }

  public function generate()
  {
    $referrals = $this->getData();
    $currencySymbol = getDefaultCurrencySymbol();
    $referrals->each(function ($referral) use ($currencySymbol) {
      $referral->referrer_name = $referral?->referrer?->name ? $referral?->referrer?->name." ({$referral?->referrer_type})" : 'N/A';
      $referral->referrer_email = isDemoModeEnabled() ? __('taxido::static.demo_mode') : ($referral->referrer->email ?? 'N/A');
      $referral->referrer_profile = $referral->referrer->profile_image_id ?? null;
      $referral->referred_name =  $referral?->referred?->name ? $referral?->referred?->name." ({$referral?->referred_type})" : 'N/A';
      $referral->referred_email = isDemoModeEnabled() ? __('taxido::static.demo_mode') : ($referral->referred->email ?? 'N/A');
      $referral->referred_profile = $referral->referred->profile_image_id ?? null;
      $referral->referral_code = $referral->referrer->referral_code ?? 'N/A';

      // Simplified bonus display for two core bonus types only
      $referral->formatted_referrer_bonus_amount = $currencySymbol . number_format($referral->bonus_amount, 2);
      $referral->formatted_referred_bonus_amount = $referral->referred_bonus_amount ?
        $currencySymbol . number_format($referral->referred_bonus_amount, 2) : 'N/A';
      $referral->formatted_ride_amount = $referral->ride_amount ?
        $currencySymbol . number_format($referral->ride_amount, 2) : 'N/A';

      // Percentage display
      $referral->referrer_percentage_display = $referral->referrer_percentage ?
        number_format($referral->referrer_percentage, 1) . '%' : 'N/A';
      $referral->referred_percentage_display = $referral->referred_percentage ?
        number_format($referral->referred_percentage, 1) . '%' : 'N/A';

      $referral->status = ucfirst($referral->status);
      $referral->created_date = formatDateBySetting($referral->created_at);
      $referral->credited_date = $referral->credited_at ? formatDateBySetting($referral->credited_at) : 'N/A';
    });

    $baseQuery = $this->getReferrals()->whereNull('deleted_at');

    $tableConfig = [
      'columns' => [
        ['title' => 'Referrer', 'field' => 'referrer_name', 'route' => 'admin.rider.show', 'email' => 'referrer_email', 'profile_image' => 'referrer_profile', 'sortable' => true, 'profile_id' => 'referrer_id', 'sortField' => 'referrer.name'],
        ['title' => 'Referred User', 'field' => 'referred_name', 'route' => 'admin.rider.show', 'email' => 'referred_email', 'profile_image' => 'referred_profile', 'sortable' => true, 'profile_id' => 'referred_id', 'sortField' => 'referred.name'],
        ['title' => 'Ride Amount', 'field' => 'formatted_ride_amount', 'sortable' => true, 'sortField' => 'ride_amount'],
        ['title' => 'Referrer Bonus', 'field' => 'formatted_referrer_bonus_amount', 'sortable' => true, 'sortField' => 'bonus_amount'],
        ['title' => 'Referred Bonus', 'field' => 'formatted_referred_bonus_amount', 'sortable' => true, 'sortField' => 'referred_bonus_amount'],
        ['title' => 'Status', 'field' => 'status', 'sortable' => true, 'type' => 'badge', 'colorClasses' => getRideStatusColorClasses()],
        ['title' => 'Credited At', 'field' => 'credited_date', 'sortable' => true, 'sortField' => 'credited_at'],
        ['title' => 'Created At', 'field' => 'created_date', 'sortable' => true, 'sortField' => 'created_at'],
      ],
      'data' => $referrals,
      'actions' => [],
      'filters' => [
        ['title' => 'All', 'slug' => 'all', 'count' => (clone $baseQuery)->count()],
        ['title' => 'Pending', 'slug' => 'pending', 'count' => $this->getReferralCountByStatus('pending')],
        ['title' => 'Credited', 'slug' => 'credited', 'count' => $this->getReferralCountByStatus('credited')],
        ['title' => 'Trash', 'slug' => 'trash', 'count' => $this->getReferrals()->withTrashed()->whereNotNull('deleted_at')->count()],
      ],
      'bulkactions' => [],
      'actionButtons' => [],
      'total' => $referrals->total(),
    ];

    return $tableConfig;
  }

  protected function sorting($referrals)
  {
    if (!$this->request->has('orderby') || !$this->request->has('order')) {
      return $referrals->orderBy('created_at', 'desc');
    }

    $orderby = $this->request->get('orderby');
    $order = strtolower($this->request->get('order')) === 'asc' ? 'asc' : 'desc';

    if (!in_array($orderby, $this->sortableColumns)) {
      return $referrals->orderBy('created_at', 'desc');
    }

    if (str_contains($orderby, '.')) {
      [$relation, $column] = explode('.', $orderby);
      switch ($relation) {
        case 'referrer':
          return $referrals->leftJoin('users as referrer_users', 'referral_bonuses.referrer_id', '=', 'referrer_users.id')
            ->select('referral_bonuses.*')
            ->orderBy("referrer_users.$column", $order);
        case 'referred':
          return $referrals->leftJoin('users as referred_users', 'referral_bonuses.referred_id', '=', 'referred_users.id')
            ->select('referral_bonuses.*')
            ->orderBy("referred_users.$column", $order);
      }
    }

    return $referrals->orderBy($orderby, $order);
  }
}
