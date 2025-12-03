<?php

namespace Modules\Taxido\Tables;

use Illuminate\Http\Request;
use Modules\Taxido\Enums\RoleEnum;
use Modules\Taxido\Models\DriverReview;
use Modules\Taxido\Enums\ServiceCategoryEnum;

class DriverReviewTable
{
    protected $request;
    protected $driverReview;

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
        $this->driverReview = DriverReview::query();
        $this->request = $request;
    }

    public function getData()
    {
        $driverReviews = $this->driverReview->with(['driver', 'rider', 'services', 'service_category']);

        if (getCurrentRoleName() == RoleEnum::DRIVER) {
            $driverId = getCurrentDriver()?->id;
            $driverReviews = $driverReviews->where('driver_reviews.driver_id', $driverId);
        }

        if ($this->request->has('driver_id')) {
            $driverReviews = $driverReviews->where('driver_reviews.driver_id', $this->request->driver_id);
        }

        if ($this->request->has('filter')) {
            switch ($this->request->filter) {
                case ServiceCategoryEnum::INTERCITY:
                    $driverReviews = $driverReviews->whereNull('driver_reviews.deleted_at')
                        ->where('driver_reviews.service_category_id', getServiceCategoryIdBySlug(ServiceCategoryEnum::INTERCITY));
                    break;
                case ServiceCategoryEnum::RIDE:
                    $driverReviews = $driverReviews->whereNull('driver_reviews.deleted_at')
                        ->where('driver_reviews.service_category_id', getServiceCategoryIdBySlug(ServiceCategoryEnum::RIDE));
                    break;
                case ServiceCategoryEnum::RENTAL:
                    $driverReviews = $driverReviews->whereNull('driver_reviews.deleted_at')
                        ->where('driver_reviews.service_category_id', getServiceCategoryIdBySlug(ServiceCategoryEnum::RENTAL));
                    break;
                case ServiceCategoryEnum::SCHEDULE:
                    $driverReviews = $driverReviews->whereNull('driver_reviews.deleted_at')
                        ->where('driver_reviews.service_category_id', getServiceCategoryIdBySlug(ServiceCategoryEnum::SCHEDULE));
                    break;
                case ServiceCategoryEnum::PACKAGE:
                    $driverReviews = $driverReviews->whereNull('driver_reviews.deleted_at')
                        ->where('driver_reviews.service_category_id', getServiceCategoryIdBySlug(ServiceCategoryEnum::PACKAGE));
                    break;
                case 'all':
                    $driverReviews = $driverReviews->whereNull('driver_reviews.deleted_at');
                    break;
                case 'trash':
                    $driverReviews = $driverReviews->onlyTrashed();
                    break;
            }
        } else {
            $driverReviews = $driverReviews->whereNull('driver_reviews.deleted_at');
        }

        if ($this->request->has('s')) {
            $searchTerm = $this->request->s;
            $driverReviews = $driverReviews->leftJoin('rides', function ($join) {
                $join->on('driver_reviews.ride_id', '=', 'rides.id')
                     ->whereNull('rides.deleted_at');
            })->leftJoin('users as driver_users', function ($join) {
                $join->on('driver_reviews.driver_id', '=', 'driver_users.id')
                     ->whereNull('driver_users.deleted_at');
            })->leftJoin('users as rider_users', function ($join) {
                $join->on('driver_reviews.rider_id', '=', 'rider_users.id')
                     ->whereNull('rider_users.deleted_at');
            })->leftJoin('services', function ($join) {
                $join->on('driver_reviews.service_id', '=', 'services.id')
                     ->whereNull('services.deleted_at');
            })->leftJoin('service_categories', function ($join) {
                $join->on('driver_reviews.service_category_id', '=', 'service_categories.id')
                     ->whereNull('service_categories.deleted_at');
            })->select('driver_reviews.*')
              ->where(function ($query) use ($searchTerm) {
                  $query->where('rides.ride_number', 'LIKE', "%$searchTerm%")
                        ->orWhere('driver_reviews.rating', 'LIKE', "%$searchTerm%")
                        ->orWhere('driver_reviews.message', 'LIKE', "%$searchTerm%")
                        ->orWhere('driver_users.name', 'LIKE', "%$searchTerm%")
                        ->orWhere('rider_users.name', 'LIKE', "%$searchTerm%")
                        ->orWhere('services.name', 'LIKE', "%$searchTerm%")
                        ->orWhere('service_categories.name', 'LIKE', "%$searchTerm%");
              });
        }

        $driverReviews = $this->applySorting($driverReviews);

        return $driverReviews->paginate($this->request->paginate ?? 15);
    }

    protected function applySorting($driverReviews)
    {
        $orderby = $this->request->get('orderby', 'created_at');
        $order = strtolower($this->request->get('order', 'desc')) === 'asc' ? 'asc' : 'desc';

        if (!in_array($orderby, $this->sortableColumns)) {
            return $driverReviews->orderBy('driver_reviews.created_at', 'desc');
        }

        if (str_contains($orderby, '.')) {
            [$relation, $column] = explode('.', $orderby);

            switch ($relation) {
                case 'driver':
                    return $driverReviews->leftJoin('users as driver_users', function ($join) {
                        $join->on('driver_reviews.driver_id', '=', 'driver_users.id')
                             ->whereNull('driver_users.deleted_at');
                    })->select('driver_reviews.*')
                      ->orderBy("driver_users.$column", $order);
                case 'rider':
                    return $driverReviews->leftJoin('users as rider_users', function ($join) {
                        $join->on('driver_reviews.rider_id', '=', 'rider_users.id')
                             ->whereNull('rider_users.deleted_at');
                    })->select('driver_reviews.*')
                      ->orderBy("rider_users.$column", $order);
                case 'services':
                    return $driverReviews->leftJoin('services', function ($join) {
                        $join->on('driver_reviews.service_id', '=', 'services.id')
                             ->whereNull('services.deleted_at');
                    })->select('driver_reviews.*')
                      ->orderBy("services.$column", $order);
            }
        }

        return $driverReviews->orderBy("driver_reviews.$orderby", $order);
    }

    public function generateStarsWithRating($rating)
    {
        $fullStars = floor($rating);
        $stars = str_repeat('⭐', $fullStars);
        return $stars . ' (' . number_format($rating, 1) . ')';
    }

    public function generate()
    {
        $driverReviews = $this->getData();

        if ($this->request->has('action') && $this->request->has('ids')) {
            $this->bulkActionHandler();
            $driverReviews = $this->getData();
        }

        $driverReviews?->each(function ($item) {
            $item->date = formatDateBySetting($item->created_at);
            $item->rating = $item->rating;
            $item->rider_name = $item?->rider->name ?? 'N/A';
            $item->rider_email = isDemoModeEnabled() ? __('taxido::static.demo_mode') : ($item?->rider->email ?? 'N/A');
            $item->rider_profile = $item?->rider->profile_image_id ?? null;
            $item->driver_name = $item?->driver->name ?? 'N/A';
            $item->driver_email = isDemoModeEnabled() ? __('taxido::static.demo_mode') : ($item?->driver?->email ?? 'N/A');
            $item->driver_profile = $item?->driver?->profile_image_id ?? null;
            $item->services = $item->services()->pluck('name')->implode(', ') ?? 'N/A';
            $item->stars = $this->generateStarsWithRating($item->rating);
        });

        $baseQuery = $this->driverReview->newQuery();

        if (getCurrentRoleName() == RoleEnum::DRIVER) {
            $driverId = getCurrentDriver()?->id;
            $baseQuery = $baseQuery->where('driver_reviews.driver_id', $driverId);
        }

        if ($this->request->has('driver_id')) {
            $baseQuery = $baseQuery->where('driver_reviews.driver_id', $this->request->driver_id);
        }

        $tableConfig = [
            'columns' => [
                ['title' => 'Driver', 'field' => 'driver_name', 'imageField' => 'driver_profile', 'sortable' => true, 'sortField' => 'driver.name', 'route' => 'admin.driver.show', 'profile_id' => 'driver_id'],
                ['title' => 'Rider', 'field' => 'rider_name', 'email' => 'rider_email', 'profile_image' => 'rider_profile', 'sortable' => true, 'sortField' => 'rider.name', 'route' => 'admin.rider.show', 'profile_id' => 'rider_id'],
                ['title' => 'Rating', 'field' => 'stars', 'sortable' => true, 'sortField' => 'rating'],
                ['title' => 'Services', 'field' => 'services', 'sortable' => true, 'sortField' => 'services.name'],
                ['title' => 'Message', 'field' => 'message', 'sortable' => true, 'sortField' => 'message'],
                ['title' => 'Created At', 'field' => 'date', 'sortable' => true, 'sortField' => 'created_at'],
            ],
            'data' => $driverReviews,
            'actions' => [
                ['title' => 'Move to trash', 'route' => 'admin.driver-review.destroy', 'class' => 'delete', 'whenFilter' => ['all', ServiceCategoryEnum::INTERCITY, ServiceCategoryEnum::RIDE, ServiceCategoryEnum::RENTAL, ServiceCategoryEnum::SCHEDULE, ServiceCategoryEnum::PACKAGE], 'permission' => 'driver_review.destroy'],
                ['title' => 'Restore', 'route' => 'admin.driver-review.restore', 'class' => 'restore', 'whenFilter' => ['trash'], 'permission' => 'driver_review.restore'],
                ['title' => 'Delete Permanently', 'route' => 'admin.driver-review.forceDelete', 'class' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'driver_review.forceDelete'],
            ],
            'filters' => [
                ['title' => 'All', 'slug' => 'all', 'count' => (clone $baseQuery)->whereNull('driver_reviews.deleted_at')->count()],
                ['title' => ucfirst(ServiceCategoryEnum::INTERCITY), 'slug' => ServiceCategoryEnum::INTERCITY, 'count' => (clone $baseQuery)->whereNull('driver_reviews.deleted_at')->where('driver_reviews.service_category_id', getServiceCategoryIdBySlug(ServiceCategoryEnum::INTERCITY))->count()],
                ['title' => ucfirst(ServiceCategoryEnum::RIDE), 'slug' => ServiceCategoryEnum::RIDE, 'count' => (clone $baseQuery)->whereNull('driver_reviews.deleted_at')->where('driver_reviews.service_category_id', getServiceCategoryIdBySlug(ServiceCategoryEnum::RIDE))->count()],
                ['title' => ucfirst(ServiceCategoryEnum::RENTAL), 'slug' => ServiceCategoryEnum::RENTAL, 'count' => (clone $baseQuery)->whereNull('driver_reviews.deleted_at')->where('driver_reviews.service_category_id', getServiceCategoryIdBySlug(ServiceCategoryEnum::RENTAL))->count()],
                ['title' => ucfirst(ServiceCategoryEnum::SCHEDULE), 'slug' => ServiceCategoryEnum::SCHEDULE, 'count' => (clone $baseQuery)->whereNull('driver_reviews.deleted_at')->where('driver_reviews.service_category_id', getServiceCategoryIdBySlug(ServiceCategoryEnum::SCHEDULE))->count()],
                ['title' => ucfirst(ServiceCategoryEnum::PACKAGE), 'slug' => ServiceCategoryEnum::PACKAGE, 'count' => (clone $baseQuery)->whereNull('driver_reviews.deleted_at')->where('driver_reviews.service_category_id', getServiceCategoryIdBySlug(ServiceCategoryEnum::PACKAGE))->count()],
                ['title' => 'Trash', 'slug' => 'trash', 'count' => (clone $baseQuery)->onlyTrashed()->count()],
            ],
            'bulkactions' => [
                ['title' => 'Move to Trash', 'action' => 'trashed', 'permission' => 'driver_review.destroy', 'whenFilter' => ['all', ServiceCategoryEnum::INTERCITY, ServiceCategoryEnum::RIDE, ServiceCategoryEnum::RENTAL, ServiceCategoryEnum::SCHEDULE, ServiceCategoryEnum::PACKAGE]],
                ['title' => 'Restore', 'action' => 'restore', 'whenFilter' => ['trash'], 'permission' => 'driver_review.restore'],
                ['title' => 'Delete Permanently', 'action' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'driver_review.forceDelete'],
            ],
            'total' => (clone $baseQuery)->whereNull('driver_reviews.deleted_at')->count(),
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
        $this->driverReview->whereIn('id', $this->request->ids)->delete();
    }

    public function restoreHandler(): void
    {
        $this->driverReview->whereIn('id', $this->request->ids)->restore();
    }

    public function deleteHandler(): void
    {
        $this->driverReview->whereIn('id', $this->request->ids)->forceDelete();
    }
}