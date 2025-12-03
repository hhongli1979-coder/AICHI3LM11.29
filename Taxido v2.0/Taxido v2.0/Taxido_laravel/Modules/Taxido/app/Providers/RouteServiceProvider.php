<?php

namespace Modules\Taxido\Providers;

use Exception;
use App\Services\BadgeResolver;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Modules\Taxido\Enums\RideStatusEnum;
use Modules\Taxido\Http\Middleware\TaxidoAuthMiddleware;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    protected $namespace = 'Modules\\Taxido\\Http\\Controllers';
    protected $apiNamespace = 'Modules\\Taxido\\Http\\Controllers\\Api';
    protected $webNamespace = 'Modules\\Taxido\\Http\\Controllers';

    /**
     * Called before routes are registered.
     *
     * Register any model bindings or pattern based filters.
     */
    public function boot(): void
    {
        parent::boot();
        $router = $this->app['router'];
        $router->aliasMiddleware('taxido.auth', TaxidoAuthMiddleware::class);
    }

    /**
     * Define the routes for the application.
     */
    public function map(): void
    {
        $this->mapApiRoutes();
        $this->mapWebRoutes();
        if ($this->shouldRegisterAdminUi()) {
            $this->registerMenus();
            $this->registerBadgeHandlers();
        }
    }

    /**
     * Define the "web" routes for the application.
     *
     * These routes all receive session state, CSRF protection, etc.
     */
    protected function mapWebRoutes(): void
    {
        Route::middleware('web')->prefix('cab')->namespace($this->webNamespace)->group(module_path('Taxido', '/routes/web.php'));
        Route::middleware('web')->prefix('admin')->namespace($this->namespace)->group(module_path('Taxido', '/routes/admin.php'));
    }

    /**
     * Define the "api" routes for the application.
     *
     * These routes are typically stateless.
     */
    protected function mapApiRoutes(): void
    {
        Route::middleware('api')->namespace($this->apiNamespace)->prefix('api')->group(module_path('Taxido', '/routes/api/api.php'));
        Route::middleware('api')->namespace($this->apiNamespace)->prefix('api')->group(module_path('Taxido', '/routes/api/admin.php'));
    }

    protected function registerMenus()
    {
        try {

            add_menu(label: 'taxido::static.riders.riders', module_slug: 'taxido', slug: 'tx_riders', icon: 'ri-group-line', position: 3, section: 'static.user_management', permission: 'rider.index');
            add_menu(label: 'taxido::static.riders.all', route: 'admin.rider.index', parent_slug: 'tx_riders', module_slug: 'taxido', slug: 'tx_all_riders', icon: 'ri-team-line', section: 'static.user_management', permission: 'rider.index');
            add_menu(label: 'taxido::static.riders.add', route: 'admin.rider.create', parent_slug: 'tx_riders', module_slug: 'taxido', slug: 'tx_rider_create', icon: 'ri-user-add-line', section: 'static.user_management', permission: 'rider.create');
            add_menu(label: 'taxido::static.wallets.wallet', route: 'admin.rider-wallet.index', parent_slug: 'tx_riders', module_slug: 'taxido', slug: 'tx_rider_wallet', icon: 'ri-wallet-line', section: 'static.user_management', permission: 'rider_wallet.index');

            add_menu(label: 'taxido::static.drivers.drivers', module_slug: 'taxido', slug: 'tx_drivers', icon: 'ri-user-2-line', position: 4, section: 'static.user_management', permission: 'driver.index');
            add_menu(label: 'taxido::static.drivers.verified_drivers', route: 'admin.driver.index', parent_slug: 'tx_drivers', module_slug: 'taxido', slug: 'tx_all_drivers', icon: 'ri-check-line', section: 'static.user_management', permission: 'driver.index');
            add_menu(label: 'taxido::static.drivers.unverified_driver', route: 'admin.driver.unverified-drivers', parent_slug: 'tx_drivers', module_slug: 'taxido', slug: 'tx_unverified_drivers', icon: 'ri-alert-line', section: 'static.user_management', permission: 'unverified_driver.index', badge: 0, badgeable: true);
            add_menu(label: 'taxido::static.drivers.add', route: 'admin.driver.create', parent_slug: 'tx_drivers', module_slug: 'taxido', slug: 'tx_driver_add', icon: 'ri-add-line', section: 'static.user_management', permission: 'driver.create');
            add_menu(label: 'taxido::static.driver_documents.driver_documents', route: 'admin.driver-document.index', parent_slug: 'tx_drivers', module_slug: 'taxido', slug: 'tx_driverDocument', icon: 'ri-document-line', section: 'static.user_management', permission: 'driver_document.index', badge: 0, badgeable: true);
            add_menu(label: 'taxido::static.driver_rules.driver_rules', route: 'admin.driver-rule.index', parent_slug: 'tx_drivers', module_slug: 'taxido', slug: 'tx_driverRule', icon: 'ri-gavel-line', section: 'static.user_management', permission: 'driver_rule.index');
            add_menu(label: 'taxido::static.locations.driver_location', route: 'admin.driver-location.index', parent_slug: 'tx_drivers', module_slug: 'taxido', slug: 'tx_locations', icon: 'ri-road-map-line', section: 'static.user_management', permission: 'driver_location.index');
            add_menu(label: 'taxido::static.notices.notice', route: 'admin.notice.index', parent_slug: 'tx_drivers', module_slug: 'taxido', icon: 'ri-notice-line', section: 'static.user_management', permission: 'notice.index');
            add_menu(label: 'taxido::static.wallets.wallet', route: 'admin.driver-wallet.index', parent_slug: 'tx_drivers', module_slug: 'taxido', icon: 'ri-wallet-line', section: 'static.user_management', permission: 'driver_wallet.index');
            add_menu(label: 'taxido::static.withdraw_requests.withdraw_request', route: 'admin.withdraw-request.index', parent_slug: 'tx_drivers', module_slug: 'taxido', slug: 'tx_withdrawRequest', icon: 'ri-money-dollar-circle-line', section: 'static.user_management', permission: 'withdraw_request.index', badge: 0, badgeable: true);
            add_menu(label: 'taxido::static.commission_histories.commission_histories', route: 'admin.cab-commission-history.index', parent_slug: 'tx_drivers', module_slug: 'taxido', slug: 'tx_commissionHistory', icon: 'ri-money-dollar-circle-line', section: 'static.user_management', permission: 'cab_commission_history.index');

            add_menu(label: 'taxido::static.dispatchers.dispatchers', module_slug: 'taxido', slug: 'tx_dispatcher', icon: 'ri-group-line', section: 'static.user_management',  position: 5, permission: 'rider.index');
            add_menu(label: 'taxido::static.dispatchers.all', route: 'admin.dispatcher.index', parent_slug: 'tx_dispatcher', module_slug: 'taxido', slug: 'tx_all_dispatchers', icon: 'ri-team-line', section: 'static.user_management', permission: 'dispatcher.index');
            add_menu(label: 'taxido::static.dispatchers.add', route: 'admin.dispatcher.create', parent_slug: 'tx_dispatcher', module_slug: 'taxido', slug: 'tx_dispatcher_create', icon: 'ri-user-add-line', section: 'static.user_management', permission: 'dispatcher.create');

            add_menu(label: 'taxido::static.fleet_managers.fleet_managers', module_slug: 'taxido', slug: 'tx_fleet_manager', icon: 'ri-truck-line', section: 'static.user_management', position: 6, permission: 'fleet_manager.index');
            add_menu(label: 'taxido::static.fleet_managers.all', route: 'admin.fleet-manager.index', parent_slug: 'tx_fleet_manager', module_slug: 'taxido', slug: 'tx_all_fleet_managers', icon: 'ri-team-line', section: 'static.user_management', permission: 'fleet_manager.index');
            add_menu(label: 'taxido::static.fleet_managers.add', route: 'admin.fleet-manager.create', parent_slug: 'tx_fleet_manager', module_slug: 'taxido', slug: 'tx_fleet_manager_create', icon: 'ri-user-add-line', section: 'static.user_management', permission: 'fleet_manager.create');
            add_menu(label: 'taxido::static.fleet_documents.fleet_documents', route: 'admin.fleet-document.index', parent_slug: 'tx_fleet_manager', module_slug: 'taxido', slug: 'tx_fleetDocument', icon: 'ri-document-line', section: 'static.user_management', permission: 'fleet_document.index', badge: 0, badgeable: true);

            add_menu(label: 'taxido::static.fleet_vehicles.fleet_vehicles', module_slug: 'taxido', slug: 'tx_fleet_vehicles', icon: 'ri-car-line', section: 'static.user_management',  position: 7, permission: 'vehicle_info.index');
            add_menu(label: 'taxido::static.fleet_vehicles.verified', route: 'admin.vehicle-info.verified', parent_slug: 'tx_fleet_vehicles', module_slug: 'taxido', slug: 'tx_verified_fleet_vehicles', icon: 'ri-check-line', section: 'static.user_management', permission: 'vehicle_info.index');
            add_menu(label: 'taxido::static.fleet_vehicles.unverified', route: 'admin.vehicle-info.unverified', parent_slug: 'tx_fleet_vehicles', module_slug: 'taxido', slug: 'tx_unverified_fleet_vehicles', icon: 'ri-alert-line', section: 'static.user_management', permission: 'vehicle_info.index');

            add_menu(label: 'taxido::static.fleet_vehicle_documents.fleet_vehicle_documents', route: 'admin.vehicleInfoDoc.index', parent_slug: 'tx_fleet_manager', position: 8,  module_slug: 'taxido', slug: 'tx_vehicleInfoDoc', icon: 'ri-document-line', section: 'static.user_management', permission: 'fleet_vehicle_document.index', badge: 0, badgeable: true);
            add_menu(label: 'taxido::static.wallets.wallet', route: 'admin.fleet-wallet.index', parent_slug: 'tx_fleet_manager', module_slug: 'taxido', slug: 'tx_fleet_manager_wallet',icon: 'ri-wallet-line', section: 'static.user_management', permission: 'fleet_wallet.index');
            add_menu(label: 'taxido::static.fleet_withdraw_requests.withdraw_request', route: 'admin.fleet-withdraw-request.index', parent_slug: 'tx_fleet_manager', module_slug: 'taxido', slug: 'tx_fleet_withdrawRequest', icon: 'ri-money-dollar-circle-line', section: 'static.user_management', permission: 'fleet_withdraw_request.index', badge: 0, badgeable: true);

            add_menu(label: 'taxido::static.referrals.referrals', route: 'admin.referral.index', module_slug: 'taxido', slug: 'tx_referral_bonus', icon: 'ri-user-shared-line', position: 9, section: 'static.user_management', permission: 'cab_referral.index');

            add_menu(label: 'taxido::static.zones.zones', module_slug: 'taxido', slug: 'zones', icon: 'ri-route-line', position: 6, section: 'taxido::static.cab_management', permission: 'zone.index');
            add_menu(label: 'taxido::static.zones.zones', route: 'admin.zone.index', parent_slug: 'zones', module_slug: 'taxido', slug: 'tx_zones', icon: 'ri-map-2-line', section: 'taxido::static.cab_management', permission: 'zone.index');
            add_menu(label: 'taxido::static.zones.add', route: 'admin.zone.create', parent_slug: 'zones', module_slug: 'taxido', slug: 'tx_zones_create', icon: 'ri-map-2-line', section: 'taxido::static.cab_management', permission: 'zone.create');

            add_menu(label: 'taxido::static.peakZones.peakZones', module_slug: 'taxido', slug: 'tx_peakZones', icon: 'ri-shape-line', position: 7, section: 'taxido::static.cab_management', permission: 'peak_zone.index');
            add_menu(label: 'taxido::static.peakZones.peakZones', route: 'admin.peakZone.index', module_slug: 'taxido',  parent_slug: 'tx_peakZones',slug: 'tx_peakZones_list',position: 8, icon: 'ri-fire-line', section: 'taxido::static.cab_management', permission: 'peak_zone.index');
            add_menu(label: 'taxido::static.peakZones.map_view', route: 'admin.peakZoneMap.index', module_slug: 'taxido', parent_slug: 'tx_peakZones', slug: 'tx_peakzone_map', position: 9, icon: 'ri-map-pin-line', section: 'taxido::static.cab_management', permission: 'peak_zone.index');

            add_menu(label: 'taxido::static.services.services', route: 'admin.service.index', module_slug: 'taxido', slug: 'tx_service', icon: 'ri-pin-distance-line', position: 7, section: 'taxido::static.cab_management', permission: 'service.index');
            add_menu(label: 'taxido::static.services.cab', module_slug: 'taxido', slug: 'tx_service_cab', icon: 'ri-roadster-line', position: 8, section: 'static.home', permission: 'service.index');
            add_menu(label: 'taxido::static.service_categories.serviceCategory', route: 'admin.service-category.cab.index', module_slug: 'taxido',  parent_slug: 'tx_service_cab', slug: 'tx_service_categories_cab', icon: 'ri-taxi-line', position: 8, section: 'static.home', permission: 'service.index');
            add_menu(label: 'taxido::static.service_categories.vehicles', route: 'admin.vehicle-type.cab.index', module_slug: 'taxido',  parent_slug: 'tx_service_cab', slug: 'tx_service_categories_vehicle_cab', icon: 'ri-taxi-line', position: 8, section: 'static.home', permission: 'service.index');

            add_menu(label: 'taxido::static.services.freight', module_slug: 'taxido', slug: 'tx_service_freight', icon: 'ri-truck-line', position: 9, section: 'static.home', permission: 'service.index');
            add_menu(label: 'taxido::static.service_categories.serviceCategory', route: 'admin.service-category.freight.index', module_slug: 'taxido',  parent_slug: 'tx_service_freight', slug: 'tx_service_categories_freight', icon: 'ri-taxi-line', position: 8, section: 'static.home', permission: 'service.index');
            add_menu(label: 'taxido::static.service_categories.vehicles', route: 'admin.vehicle-type.freight.index', module_slug: 'taxido',  parent_slug: 'tx_service_freight', slug: 'tx_service_categories_vehicle_freight', icon: 'ri-taxi-line', position: 8, section: 'static.home', permission: 'service.index');

            add_menu(label: 'taxido::static.services.parcel', module_slug: 'taxido', slug: 'tx_service_parcel', icon: 'ri-archive-2-line', position: 9, section: 'static.home', permission: 'service.index');
            add_menu(label: 'taxido::static.service_categories.serviceCategory', route: 'admin.service-category.parcel.index', module_slug: 'taxido',  parent_slug: 'tx_service_parcel', slug: 'tx_service_categories_parcel', icon: 'ri-taxi-line', position: 8, section: 'static.home', permission: 'service.index');
            add_menu(label: 'taxido::static.service_categories.vehicles', route: 'admin.vehicle-type.parcel.index',  module_slug: 'taxido',  parent_slug: 'tx_service_parcel', slug: 'tx_service_categories_vehicle_parcel', icon: 'ri-taxi-line', position: 8, section: 'static.home', permission: 'service.index');

            add_menu(label: 'taxido::static.heatmaps.heat_map', route: 'admin.heat-map', module_slug: 'taxido', slug: 'tx_heatmap', position: 9, icon: 'ri-fire-line', section: 'taxido::static.cab_management', permission: 'heat_map.index');
            add_menu(label: 'taxido::static.preferences.preferences', route: 'admin.preference.index', module_slug: 'taxido', slug: 'tx_preference_index', position: 9, icon: 'ri-equalizer-2-line', section: 'taxido::static.cab_management', permission: 'preference.index');

            add_menu(label: 'taxido::static.vehicles', module_slug: 'taxido', slug: 'taxido', icon: 'ri-taxi-line', position: 10, section: 'taxido::static.cab_management', permission:'rental_vehicle.index');
            add_menu(label: 'taxido::static.rental_vehicle.rental_vehicles', route: 'admin.rental-vehicle.index', parent_slug: 'taxido', module_slug: 'taxido', slug: 'tx_rental_vehicle', icon: 'ri-clock-line', section: 'taxido::static.cab_management', permission: 'rental_vehicle.index');
            add_menu(label: 'taxido::static.ambulances.ambulances', route: 'admin.ambulance.index', parent_slug: 'taxido', module_slug: 'taxido', slug: 'tx_ambulance', icon: 'ri-ambulance-fill', section: 'taxido::static.cab_management', permission: 'ambulance.index');

            add_menu(label: 'taxido::static.hourly_package.hourly_packages', route: 'admin.hourly-package.index', parent_slug: 'taxido', module_slug: 'taxido', slug: 'tx_hourlyPackage', icon: 'ri-clock-line', section: 'taxido::static.cab_management', permission: 'hourly_package.index');
            add_menu(label: 'taxido::static.documents.documents', route:'admin.document.index', parent_slug: 'taxido',module_slug: 'taxido', slug:'tx_documents', icon:'ri-file-line', section:'taxido::static.cab_management', permission:'document.index');
            add_menu(label: 'taxido::static.cancellation-reasons.cancellation-reasons', route:'admin.cancellation-reason.index', parent_slug: 'taxido', module_slug: 'taxido', slug:'tx_cancellationReason', icon: 'ri-error-warning-line', section:'taxido::static.cab_management', permission:'cancellation_reason.index');

            add_menu(label: 'taxido::static.soses.soses', module_slug: 'taxido', slug: 'tx_sos', icon: 'ri-alarm-warning-line', position: 11, section: 'taxido::static.cab_management', permission: 'sos.index');
            add_menu(label: 'taxido::static.soses.soses', route: 'admin.sos.index', parent_slug: 'tx_sos', module_slug: 'taxido', slug: 'tx_soses', icon: 'ri-alert-line', section: 'taxido::static.cab_management', permission: 'sos.index');
            add_menu(label: 'taxido::static.soses.sos_alerts', route: 'admin.sos-alerts.index', parent_slug: 'tx_sos', module_slug: 'taxido', slug: 'tx_sos_alerts', icon: 'ri-list-check', section: 'taxido::static.cab_management', permission: 'sos_alert.index');

            add_menu(label: 'taxido::static.subscriptions.subscriptions', module_slug: 'taxido', slug: 'tx_subscription', icon: 'ri-vip-crown-line', position: 12, section: 'taxido::static.price_management', permission: 'plan.index');
            add_menu(label: 'taxido::static.subscriptions.driver_subscription', route: 'admin.driver-subscription.index', parent_slug: 'tx_subscription', module_slug: 'taxido', slug: 'tx_driverSubscription', icon: 'ri-file-blank-line', section: 'taxido::static.price_management', permission: 'subscription.index');
            add_menu(label: 'taxido::static.plans.plans', route: 'admin.plan.index', parent_slug: 'tx_subscription', module_slug: 'taxido', slug: 'tx_plans', icon: 'ri-gavel-line', section: 'taxido::static.price_management', permission: 'plan.index');

            add_menu(label: 'taxido::static.coupons.coupons', route: 'admin.coupon.index', module_slug: 'taxido', slug: 'tx_coupons', icon: 'ri-coupon-2-line', position: 13, section: 'taxido::static.price_management', permission: 'coupon.index');
            add_menu(label: 'taxido::static.extra_charges.extra_charges', route: 'admin.extra-charge.index', module_slug: 'taxido', slug: 'tx_extraCharges', icon: 'ri-money-dollar-circle-line', position: 13, section: 'taxido::static.price_management', permission: 'extra_charge-2.index');
            add_menu(label: 'taxido::static.surge_prices.surge_prices',route: 'admin.surge-price.index', module_slug: 'taxido',slug: 'tx_surge_price',icon: 'ri-price-tag-3-line',position: 14,section: 'taxido::static.price_management', permission: 'surge_price.index');
            add_menu(label: 'taxido::static.airports.airports',route: 'admin.airport.index',module_slug: 'taxido',slug: 'tx_airport',icon: 'ri-plane-line',section: 'taxido::static.cab_management',position: 15,permission: 'airport.index');

            add_menu(label: 'taxido::static.reports.reports',module_slug: 'taxido', slug:'tx_reports', icon: 'ri-folder-chart-line', section:'taxido::static.cab_management', position:16,permission:'report.index');
            add_menu(label: 'taxido::static.reports.transaction_reports', route:'admin.transaction-report.index', parent_slug: 'tx_reports', module_slug: 'taxido', slug:'tx_transaction_reports', icon: 'ri-road-line', section:'taxido::static.cab_management',permission:'report.index');
            add_menu(label: 'taxido::static.reports.ride_reports', route:'admin.ride-report.index', parent_slug: 'tx_reports', module_slug: 'taxido', slug:'tx_ride_reports', icon: 'ri-traffic-line', section:'taxido::static.cab_management',permission:'report.index');
            add_menu(label: 'taxido::static.reports.driver_reports', route:'admin.driver-report.index', parent_slug: 'tx_reports', module_slug: 'taxido', slug:'tx_driver_reports', icon: 'ri-user-line', section:'taxido::static.cab_management',permission:'report.index');
            add_menu(label: 'taxido::static.reports.coupon_reports', route:'admin.coupon-report.index', parent_slug: 'tx_reports', module_slug: 'taxido', slug:'tx_coupon_reports', icon: 'ri-road-line', section:'taxido::static.cab_management',permission:'report.index');
            add_menu(label: 'taxido::static.reports.zone_reports', route:'admin.zone-report.index', parent_slug: 'tx_reports', module_slug: 'taxido', slug:'tx_zone_reports', icon: 'ri-bar-chart-2-line', section:'taxido::static.cab_management',permission:'report.index');
            add_menu(label: 'taxido::static.reports.incentive', route:'admin.incentive-report.index', parent_slug: 'tx_reports', module_slug: 'taxido', slug:'tx_incentive_reports', icon: 'ri-bar-chart-2-line', section:'taxido::static.cab_management',permission:'report.index');



            add_menu(label: 'taxido::static.reviews.reviews', module_slug: 'taxido', slug:'tx_reviews', icon:'ri-user-star-line', section:'taxido::static.cab_management', position:17, permission:'driver_review.index');
            add_menu(label: 'taxido::static.reviews.rider_reviews', route: 'admin.rider-review.index', parent_slug: 'tx_reviews', module_slug: 'taxido', slug: 'tx_rider_review', icon: 'ri-star-line', section: 'taxido::static.cab_management', permission: 'rider.create');
            add_menu(label: 'taxido::static.reviews.driver_reviews', route: 'admin.driver-review.index', parent_slug: 'tx_reviews', module_slug: 'taxido', icon: 'ri-star-line', section: 'taxido::static.cab_management', permission: 'driver_review.index');
            add_menu(label: 'taxido::static.settings.app_settings', route:'admin.taxido-setting.index', parent_slug: '', module_slug: 'taxido', slug:'tx_setting', icon: 'ri-settings-4-line',position: 18, section:'taxido::static.cab_management', permission:'taxido_setting.index');

            add_menu(label: 'taxido::static.rides.rides', module_slug: 'taxido', slug:'tx_ride', icon:'ri-map-2-line', section:'static.home', position:10, permission:'ride.index');
            add_menu(label: 'taxido::static.rides.ride_requests', route:'admin.ride-request.index', parent_slug: 'tx_ride', module_slug: 'taxido', slug:'tx_all_ride_requests', icon: 'ri-traffic-light-line', section:'static.home', permission:'ride_request.index');
            add_menu(label: 'taxido::static.rides.all', route:'admin.ride.index', parent_slug: 'tx_ride', module_slug: 'taxido', slug:'tx_all_rides', icon: 'ri-traffic-light-line', section:'static.home', permission:'ride.index');
            add_menu(label: 'taxido::static.rides.scheduled', route:'admin.ride.status.filter', params:['status' => RideStatusEnum::SCHEDULED], parent_slug: 'tx_ride', module_slug: 'taxido', slug:'tx_scheduled_rides', icon: 'ri-traffic-light-line', section:'static.home', permission:'ride.index', badge: 0, badgeable: true); // getTotalRidesByStatus(RideStatusEnum::SCHEDULED)
            add_menu(label: 'taxido::static.rides.accepted', route:'admin.ride.status.filter', params:['status' => RideStatusEnum::ACCEPTED], parent_slug: 'tx_ride', module_slug: 'taxido', slug:'tx_accepted_rides', icon: 'ri-traffic-light-line', section:'static.home', permission:'ride.index', badge: 0, badgeable: true); // getTotalRidesByStatus(RideStatusEnum::ACCEPTED)
            add_menu(label: 'taxido::static.rides.arrived', route: 'admin.ride.status.filter',  params:['status' => RideStatusEnum::ARRIVED], parent_slug: 'tx_ride', module_slug: 'taxido', slug: 'tx_arrived_rides', icon: 'ri-traffic-light-line', section: 'static.home', permission: 'ride.index', badge: 0, badgeable: true); // getTotalRidesByStatus(RideStatusEnum::ARRIVED)
            add_menu(label: 'taxido::static.rides.started', route:'admin.ride.status.filter',  params:['status' => RideStatusEnum::STARTED],parent_slug: 'tx_ride', module_slug: 'taxido', slug:'tx_started_rides', icon: 'ri-traffic-light-line', section:'static.home', permission:'ride.index', badge: 0, badgeable: true); // getTotalRidesByStatus(RideStatusEnum::STARTED)
            add_menu(label: 'taxido::static.rides.cancelled', route:'admin.ride.status.filter',  params:['status' => RideStatusEnum::CANCELLED],parent_slug: 'tx_ride', module_slug: 'taxido', slug:'tx_cancelled_rides', icon: 'ri-traffic-light-line', section:'static.home', permission:'ride.index', badge: 0, badgeable: true); // getTotalRidesByStatus(RideStatusEnum::CANCELLED)
            add_menu(label: 'taxido::static.rides.completed', route:'admin.ride.status.filter', params:['status' => RideStatusEnum::COMPLETED],  parent_slug: 'tx_ride', module_slug: 'taxido', slug:'tx_completed_rides', icon: 'ri-traffic-light-line', section:'static.home', permission:'ride.index', badge: 0, badgeable: true);

            add_menu(label: 'taxido::static.banners.banners', route: 'admin.banner.index', module_slug: 'taxido', slug: 'tx_banners', icon: 'ri-todo-line', section: 'static.promotion_management', permission: 'banner.index');
            add_menu(label: 'taxido::static.onboardings.onboardings', route: 'admin.onboarding.index', module_slug: 'taxido', slug: 'tx_onboardings', icon: 'ri-guide-line', section: 'static.promotion_management', permission: 'onboarding.index');
            add_menu(label: 'taxido::static.push_notification.push_notification',   module_slug: 'taxido', slug: 'tx_pushNotification', icon: 'ri-send-plane-line', section: 'static.promotion_management', position: 19, permission: 'push_notification.index');
            add_menu(label: 'taxido::static.push_notification.all', route: 'admin.push-notification.index', parent_slug: 'tx_pushNotification', module_slug: 'taxido', slug: 'tx_all_pushNotification', icon: 'ri-notification-2-line', section: 'static.promotion_management', permission: 'push_notification.index');
            add_menu(label: 'taxido::static.push_notification.send', route: 'admin.push-notification.create', parent_slug: 'tx_pushNotification', module_slug: 'taxido', slug: 'tx_send_pushNotification', icon: 'ri-send-plane-line', section: 'static.promotion_management', permission: 'push_notification.create');

            add_menu(label: 'taxido::static.chats.chats', route: 'admin.chat.index', module_slug: 'taxido', position: 4, slug: 'tx_chat', icon: 'ri-chat-1-line', section: 'static.home', permission: 'chat.index');

        } catch (Exception $e) {

           Log::error("Cab service provider:", $e->getMessage());
        }
    }

    protected function registerBadgeHandlers()
    {
        $resolver = app(BadgeResolver::class);

        $statusMap = [
            'tx_scheduled_rides' => RideStatusEnum::SCHEDULED,
            'tx_accepted_rides' => RideStatusEnum::ACCEPTED,
            'tx_arrived_rides' => RideStatusEnum::ARRIVED,
            'tx_started_rides' => RideStatusEnum::STARTED,
            'tx_cancelled_rides' => RideStatusEnum::CANCELLED,
            'tx_completed_rides' => RideStatusEnum::COMPLETED,
        ];

        foreach ($statusMap as $slug => $status) {
            $resolver->register($slug, function ($user) use ($status) {
                return getTotalRidesByStatus($status);
            });
        }

        $resolver->register('tx_withdrawRequest', function ($user) {
            return getPendingWithdrawRequests();
        });

        $resolver->register('tx_fleet_withdrawRequest', function ($user) {
            return getPendingFleetWithdrawRequests();
        });

        $resolver->register('tx_driverDocument', function ($user) {
            return getAllDriverDocumentsCount();
        });

        $resolver->register('tx_unverified_drivers',function ($user) {
            return getUnverifiedDriver();
        });

    }

    protected function shouldRegisterAdminUi(): bool
    {
        if ($this->app->runningInConsole()) {
            return false;
        }

        $request = request();
        if ($request->expectsJson() || $request->isJson() || $request->wantsJson()) {
            return false;
        }

        return true;
    }
}
