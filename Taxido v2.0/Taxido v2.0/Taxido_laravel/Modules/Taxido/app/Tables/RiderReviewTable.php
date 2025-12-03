<?php

namespace Modules\Taxido\Tables;

use Illuminate\Http\Request;
use Modules\Taxido\Enums\RoleEnum;
use Modules\Taxido\Models\RiderReview;
use Modules\Taxido\Enums\ServiceCategoryEnum;

class RiderReviewTable
{
    protected $riderReview;
    protected $request;

    protected $sortableColumns = [
        'driver.name',
        'rider.name',
        'rating',
        'services.name',
        'message',
        'created_at',
    ];

    public function __construct(Request $request)
    {
        $this->riderReview = RiderReview::query();
        $this->request = $request;
    }

    public function getData()
    {
        $riderReviews = $this->riderReview->with(['driver', 'rider', 'services', 'service_category']);

        if (getCurrentRoleName() == RoleEnum::RIDER) {
            $riderId = getCurrentRider()?->id;
            $riderReviews = $riderReviews->where('rider_reviews.rider_id', $riderId);
        }

        if ($this->request->has('rider_id')) {
            $riderReviews = $riderReviews->where('rider_reviews.rider_id', $this->request->rider_id);
        }

        if ($this->request->has('filter')) {
            switch ($this->request->filter) {
                case ServiceCategoryEnum::INTERCITY:
                    $riderReviews = $riderReviews->whereNull('rider_reviews.deleted_at')
                        ->where('rider_reviews.service_category_id', getServiceCategoryIdBySlug(ServiceCategoryEnum::INTERCITY));
                    break;
                case ServiceCategoryEnum::RIDE:
                    $riderReviews = $riderReviews->whereNull('rider_reviews.deleted_at')
                        ->where('rider_reviews.service_category_id', getServiceCategoryIdBySlug(ServiceCategoryEnum::RIDE));
                    break;
                case ServiceCategoryEnum::RENTAL:
                    $riderReviews = $riderReviews->whereNull('rider_reviews.deleted_at')
                        ->where('rider_reviews.service_category_id', getServiceCategoryIdBySlug(ServiceCategoryEnum::RENTAL));
                    break;
                case ServiceCategoryEnum::SCHEDULE:
                    $riderReviews = $riderReviews->whereNull('rider_reviews.deleted_at')
                        ->where('rider_reviews.service_category_id', getServiceCategoryIdBySlug(ServiceCategoryEnum::SCHEDULE));
                    break;
                case ServiceCategoryEnum::PACKAGE:
                    $riderReviews = $riderReviews->whereNull('rider_reviews.deleted_at')
                        ->where('rider_reviews.service_category_id', getServiceCategoryIdBySlug(ServiceCategoryEnum::PACKAGE));
                    break;
                case 'all':
                    $riderReviews = $riderReviews->whereNull('rider_reviews.deleted_at');
                    break;
                case 'trash':
                    $riderReviews = $riderReviews->onlyTrashed();
                    break;
            }
        } else {
            $riderReviews = $riderReviews->whereNull('rider_reviews.deleted_at');
        }

        if ($this->request->has('s')) {
            $searchTerm = $this->request->s;
            $riderReviews = $riderReviews->leftJoin('rides', function ($join) {
                $join->on('rider_reviews.ride_id', '=', 'rides.id')
                     ->whereNull('rides.deleted_at');
            })->leftJoin('users as driver_users', function ($join) {
                $join->on('rider_reviews.driver_id', '=', 'driver_users.id')
                     ->whereNull('driver_users.deleted_at');
            })->leftJoin('users as rider_users', function ($join) {
                $join->on('rider_reviews.rider_id', '=', 'rider_users.id')
                     ->whereNull('rider_users.deleted_at');
            })->leftJoin('services', function ($join) {
                $join->on('rider_reviews.service_id', '=', 'services.id')
                     ->whereNull('services.deleted_at');
            })->leftJoin('service_categories', function ($join) {
                $join->on('rider_reviews.service_category_id', '=', 'service_categories.id')
                     ->whereNull('service_categories.deleted_at');
            })->select('rider_reviews.*')
              ->where(function ($query) use ($searchTerm) {
                  $query->where('rides.ride_number', 'LIKE', "%$searchTerm%")
                        ->orWhere('rider_reviews.rating', 'LIKE', "%$searchTerm%")
                        ->orWhere('rider_reviews.message', 'LIKE', "%$searchTerm%")
                        ->orWhere('driver_users.name', 'LIKE', "%$searchTerm%")
                        ->orWhere('rider_users.name', 'LIKE', "%$searchTerm%")
                        ->orWhere('services.name', 'LIKE', "%$searchTerm%")
                        ->orWhere('service_categories.name', 'LIKE', "%$searchTerm%");
              });
        }

        $riderReviews = $this->applySorting($riderReviews);

        return $riderReviews->paginate($this->request->paginate ?? 15);
    }

    protected function applySorting($riderReviews)
    {
        $orderby = $this->request->get('orderby', 'created_at');
        $order = strtolower($this->request->get('order', 'desc')) === 'asc' ? 'asc' : 'desc';

        if (!in_array($orderby, $this->sortableColumns)) {
            return $riderReviews->orderBy('rider_reviews.created_at', 'desc');
        }

        if (str_contains($orderby, '.')) {
            [$relation, $column] = explode('.', $orderby);

            switch ($relation) {
                case 'driver':
                    return $riderReviews->leftJoin('users as driver_users', function ($join) {
                        $join->on('rider_reviews.driver_id', '=', 'driver_users.id')
                             ->whereNull('driver_users.deleted_at');
                    })->select('rider_reviews.*')
                      ->orderBy("driver_users.$column", $order);
                case 'rider':
                    return $riderReviews->leftJoin('users as rider_users', function ($join) {
                        $join->on('rider_reviews.rider_id', '=', 'rider_users.id')
                             ->whereNull('rider_users.deleted_at');
                    })->select('rider_reviews.*')
                      ->orderBy("rider_users.$column", $order);
                case 'services':
                    return $riderReviews->leftJoin('services', function ($join) {
                        $join->on('rider_reviews.service_id', '=', 'services.id')
                             ->whereNull('services.deleted_at');
                    })->select('rider_reviews.*')
                      ->orderBy("services.$column", $order);
            }
        }

        return $riderReviews->orderBy("rider_reviews.$orderby", $order);
    }

    public function generateStarsWithRating($rating)
    {
        $fullStars = floor($rating);
        $stars = str_repeat('⭐', $fullStars);
        return $stars . ' (' . number_format($rating, 1) . ')';
    }

    public function generate()
    {
        $riderReviews = $this->getData();

        if ($this->request->has('action') && $this->request->has('ids')) {
            $this->bulkActionHandler();
            $riderReviews = $this->getData();
        }

        $riderReviews->each(function ($item) {
            $item->rating = $item->rating;
            $item->rider_name    = $item?->rider->name ?? null;
            $item->rider_email   = isDemoModeEnabled() ? __('static.demo_mode') : ($item?->rider->email ?? null);
            $item->rider_profile = $item?->rider->profile_image_id ?? null;
            $item->driver_name = $item?->driver->name ?? 'N/A';
            $item->driver_email = isDemoModeEnabled() ? __('taxido::static.demo_mode') : ($item?->driver?->email ?? 'N/A');
            $item->driver_profile = $item?->driver?->profile_image_id ?? null;
            $item->services = $item->services()->pluck('name')->implode(', ') ?: 'N/A';
            $item->stars = $this->generateStarsWithRating($item->rating);
            $item->date = formatDateBySetting($item->created_at);
        });

        $baseQuery = $this->riderReview->newQuery();

        if (getCurrentRoleName() == RoleEnum::RIDER) {
            $riderId = getCurrentRider()?->id;
            $baseQuery = $baseQuery->where('rider_reviews.rider_id', $riderId);
        }

        if ($this->request->has('rider_id')) {
            $baseQuery = $baseQuery->where('rider_reviews.rider_id', $this->request->rider_id);
        }

        $tableConfig = [
            'columns' => [
                ['title' => 'Rider', 'field' => 'rider_name', 'action' => true, 'imageField' => 'rider_profile', 'sortable' => true,'placeholderLetter' => true],
                ['title' => 'Driver', 'field' => 'driver_name', 'email' => 'driver_email', 'profile_image' => 'driver_profile', 'sortable' => true, 'route' => 'admin.driver.show', 'profile_id' => 'driver_id'],
                ['title' => 'Rating', 'field' => 'stars', 'imageField' => null, 'sortable' => true],
                ['title' => 'Services', 'field' => 'services', 'sortable' => true],
                ['title' => 'Message', 'field' => 'message', 'imageField' => null, 'sortable' => true],
                ['title' => 'Created At', 'field' => 'created_at', 'imageField' => null, 'sortable' => true],
            ],
            'data' => $riderReviews,
            'actions' => [
                ['title' => 'Move to trash', 'route' => 'admin.rider-review.destroy', 'class' => 'delete', 'whenFilter' => ['all', ServiceCategoryEnum::INTERCITY, ServiceCategoryEnum::RIDE, ServiceCategoryEnum::RENTAL, ServiceCategoryEnum::SCHEDULE, ServiceCategoryEnum::PACKAGE], 'permission' => 'rider_review.destroy'],
                ['title' => 'Restore', 'route' => 'admin.rider-review.restore', 'class' => 'restore', 'whenFilter' => ['trash'], 'permission' => 'rider_review.restore'],
                ['title' => 'Delete Permanently', 'route' => 'admin.rider-review.forceDelete', 'class' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'rider_review.forceDelete'],
            ],
            'filters' => [
                ['title' => 'All', 'slug' => 'all', 'count' => (clone $baseQuery)->whereNull('rider_reviews.deleted_at')->count()],
                ['title' => ucfirst(ServiceCategoryEnum::INTERCITY), 'slug' => ServiceCategoryEnum::INTERCITY, 'count' => (clone $baseQuery)->whereNull('rider_reviews.deleted_at')->where('rider_reviews.service_category_id', getServiceCategoryIdBySlug(ServiceCategoryEnum::INTERCITY))->count()],
                ['title' => ucfirst(ServiceCategoryEnum::RIDE), 'slug' => ServiceCategoryEnum::RIDE, 'count' => (clone $baseQuery)->whereNull('rider_reviews.deleted_at')->where('rider_reviews.service_category_id', getServiceCategoryIdBySlug(ServiceCategoryEnum::RIDE))->count()],
                ['title' => ucfirst(ServiceCategoryEnum::RENTAL), 'slug' => ServiceCategoryEnum::RENTAL, 'count' => (clone $baseQuery)->whereNull('rider_reviews.deleted_at')->where('rider_reviews.service_category_id', getServiceCategoryIdBySlug(ServiceCategoryEnum::RENTAL))->count()],
                ['title' => ucfirst(ServiceCategoryEnum::SCHEDULE), 'slug' => ServiceCategoryEnum::SCHEDULE, 'count' => (clone $baseQuery)->whereNull('rider_reviews.deleted_at')->where('rider_reviews.service_category_id', getServiceCategoryIdBySlug(ServiceCategoryEnum::SCHEDULE))->count()],
                ['title' => ucfirst(ServiceCategoryEnum::PACKAGE), 'slug' => ServiceCategoryEnum::PACKAGE, 'count' => (clone $baseQuery)->whereNull('rider_reviews.deleted_at')->where('rider_reviews.service_category_id', getServiceCategoryIdBySlug(ServiceCategoryEnum::PACKAGE))->count()],
                ['title' => 'Trash', 'slug' => 'trash', 'count' => (clone $baseQuery)->onlyTrashed()->count()],
            ],
            'bulkactions' => [
                ['title' => 'Move to Trash', 'permission' => 'rider_review.destroy', 'action' => 'trashed', 'whenFilter' => ['all', ServiceCategoryEnum::INTERCITY, ServiceCategoryEnum::RIDE, ServiceCategoryEnum::RENTAL, ServiceCategoryEnum::SCHEDULE, ServiceCategoryEnum::PACKAGE]],
                ['title' => 'Restore', 'permission' => 'rider_review.restore', 'action' => 'restore', 'whenFilter' => ['trash']],
                ['title' => 'Delete Permanently', 'permission' => 'rider_review.forceDelete', 'action' => 'delete', 'whenFilter' => ['trash']],
            ],
            'total' => (clone $baseQuery)->whereNull('rider_reviews.deleted_at')->count(),
        ];

        return $tableConfig;
    }

    public function bulkActionHandler()
    {
        switch ($this->request->action) {
            case 'trashed':
                $this->trashedHandler();
                break;
            case 'restore':
                $this->restoreHandler();
                break;
            case 'delete':
                $this->deleteHandler();
                break;
        }
    }

    public function trashedHandler(): void
    {
        $this->riderReview->whereIn('id', $this->request->ids)->delete();
    }

    public function restoreHandler(): void
    {
        $this->riderReview->whereIn('id', $this->request->ids)->restore();
    }

    public function deleteHandler(): void
    {
        $this->riderReview->whereIn('id', $this->request->ids)->forceDelete();
    }
}