<?php

namespace Modules\Taxido\Database\Seeders;

use App\Models\User;
use App\Models\Module;
use App\Models\Plugin;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Modules\Taxido\Enums\RoleEnum;
use Illuminate\Support\Facades\Hash;
use App\Enums\RoleEnum as BaseRoleEnum;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $modules = [
            'riders' => [
                'actions' => [
                    'index' => 'rider.index',
                    'create'  => 'rider.create',
                    'edit'    => 'rider.edit',
                    'trash' => 'rider.destroy',
                    'restore' => 'rider.restore',
                    'delete' => 'rider.forceDelete'
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create', 'edit', 'trash', 'restore', 'delete'],
                    RoleEnum::RIDER => ['index'],
                ]
            ],
            'drivers' => [
                'actions' => [
                    'index' => 'driver.index',
                    'create' => 'driver.create',
                    'edit' => 'driver.edit',
                    'trash'   => 'driver.destroy',
                    'restore' => 'driver.restore',
                    'delete'  => 'driver.forceDelete'
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create', 'edit','trash', 'restore', 'delete'],
                    RoleEnum::DRIVER => ['index','edit'],
                    RoleEnum::DISPATCHER => ['index', 'edit'],
                    RoleEnum::FLEET_MANAGER => ['index'],
                ]
            ],
            'dispatchers' => [
                'actions' => [
                    'index' => 'dispatcher.index',
                    'create'  => 'dispatcher.create',
                    'edit'    => 'dispatcher.edit',
                    'trash' => 'dispatcher.destroy',
                    'restore' => 'dispatcher.restore',
                    'delete' => 'dispatcher.forceDelete'
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create', 'edit', 'trash', 'restore', 'delete'],
                    RoleEnum::RIDER => ['index'],
                    RoleEnum::DISPATCHER => ['index', 'edit'],
                ]
            ],
            'unverified_drivers' => [
                'actions' => [
                    'index' => 'unverified_driver.index',
                    'create' => 'unverified_driver.create',
                    'edit' => 'unverified_driver.edit',
                    'trash'   => 'unverified_driver.destroy',
                    'restore' => 'unverified_driver.restore',
                    'delete'  => 'unverified_driver.forceDelete'
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create', 'edit', 'trash', 'restore', 'delete'],
                    RoleEnum::DISPATCHER => ['index'],

                ]
            ],
            'banners' => [
                'actions' => [
                    'index'   => 'banner.index',
                    'create'  => 'banner.create',
                    'edit'    => 'banner.edit',
                    'trash'   => 'banner.destroy',
                    'restore' => 'banner.restore',
                    'delete'  => 'banner.forceDelete'
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create', 'edit', 'trash', 'restore', 'delete'],
                    RoleEnum::RIDER => ['index'],
                ]
            ],
            'documents' => [
                'actions' => [
                    'index'   => 'document.index',
                    'create'  => 'document.create',
                    'edit'    => 'document.edit',
                    'trash'   => 'document.destroy',
                    'restore' => 'document.restore',
                    'delete'  => 'document.forceDelete'
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create', 'edit', 'trash', 'restore', 'delete'],
                    RoleEnum::RIDER => ['index'],
                    RoleEnum::DRIVER => ['index'],
                ]
            ],
            'vehicle_types' => [
                'actions' => [
                    'index'   => 'vehicle_type.index',
                    'create'  => 'vehicle_type.create',
                    'edit'    => 'vehicle_type.edit',
                    'trash'   => 'vehicle_type.destroy',
                    'restore' => 'vehicle_type.restore',
                    'delete'  => 'vehicle_type.forceDelete'
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create', 'edit', 'trash', 'restore', 'delete'],
                    RoleEnum::RIDER => ['index'],
                    RoleEnum::DRIVER => ['index'],
                    RoleEnum::DISPATCHER => ['index'],
                    RoleEnum::FLEET_MANAGER => ['index'],
                ]
            ],
            'coupons' => [
                'actions' => [
                    'index'   => 'coupon.index',
                    'create'  => 'coupon.create',
                    'edit'    => 'coupon.edit',
                    'trash'   => 'coupon.destroy',
                    'restore' => 'coupon.restore',
                    'delete'  => 'coupon.forceDelete'
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create', 'edit', 'trash', 'restore', 'delete'],
                    RoleEnum::RIDER => ['index'],
                ]
            ],
            'zones' => [
                'actions' => [
                    'index' => 'zone.index',
                    'create' => 'zone.create',
                    'edit'    => 'zone.edit',
                    'trash'   => 'zone.destroy',
                    'restore' => 'zone.restore',
                    'delete'  => 'zone.forceDelete'
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create', 'edit', 'trash', 'restore', 'delete'],
                    RoleEnum::DISPATCHER => ['index'],
                    RoleEnum::FLEET_MANAGER => ['index'],

                ]
            ],
            'faqs' => [
                'actions' => [
                    'index' => 'faq.index',
                    'create' => 'faq.create',
                    'edit'    => 'faq.edit',
                    'trash'   => 'faq.destroy',
                    'restore' => 'faq.restore',
                    'delete'  => 'faq.forceDelete'
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create', 'edit', 'trash', 'restore', 'delete'],
                ]
            ],
            'heatmaps' => [
                'actions' => [
                    'index' => 'heat_map.index',
                    'create' => 'heat_map.create',
                    'edit'    => 'heat_map.edit',
                    'trash'   => 'heat_map.destroy',
                    'restore' => 'heat_map.restore',
                    'delete'  => 'heat_map.forceDelete'
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index'],
                    RoleEnum::DRIVER => ['index'],
                    RoleEnum::DISPATCHER => ['index'],
                    RoleEnum::FLEET_MANAGER => ['index'],
                ]
            ],
            'soses' => [
                'actions' => [
                    'index' => 'sos.index',
                    'create' => 'sos.create',
                    'edit'    => 'sos.edit',
                    'trash'   => 'sos.destroy',
                    'restore' => 'sos.restore',
                    'delete'  => 'sos.forceDelete'
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create', 'edit', 'trash', 'restore', 'delete'],
                    RoleEnum::RIDER => ['index'],
                    RoleEnum::DRIVER => ['index'],
                ]
            ],
            'driver_documents' => [
                'actions' => [
                    'index'   => 'driver_document.index',
                    'create'  => 'driver_document.create',
                    'edit'    => 'driver_document.edit',
                    'trash'   => 'driver_document.destroy',
                    'restore' => 'driver_document.restore',
                    'delete'  => 'driver_document.forceDelete'
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create', 'edit', 'trash', 'restore', 'delete'],
                    RoleEnum::DRIVER => ['index', 'create'],
                    RoleEnum::FLEET_MANAGER => ['index'],
                ]
            ],
            'driver_rules' => [
                'actions' => [
                    'index'   => 'driver_rule.index',
                    'create'  => 'driver_rule.create',
                    'edit'    => 'driver_rule.edit',
                    'trash'   => 'driver_rule.destroy',
                    'restore' => 'driver_rule.restore',
                    'delete'  => 'driver_rule.forceDelete'
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create', 'edit', 'trash', 'restore', 'delete'],
                    RoleEnum::DRIVER => ['index'],
                    RoleEnum::FLEET_MANAGER => ['index'],
                ]
            ],
            'extra_charges' => [
                'actions' => [
                    'index'   => 'extra_charge.index',
                    'create'  => 'extra_charge.create',
                    'edit'    => 'extra_charge.edit',
                    'trash'   => 'extra_charge.destroy',
                    'restore' => 'extra_charge.restore',
                    'delete'  => 'extra_charge.forceDelete',
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create', 'edit', 'trash', 'restore', 'delete'],
                    RoleEnum::DRIVER => ['index'],
                    RoleEnum::FLEET_MANAGER => ['index'],
                ]
            ],
            'cab_commission_histories' => [
                'actions' => [
                    'index'   => 'cab_commission_history.index',
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index'],
                    RoleEnum::DRIVER => ['index'],
                    RoleEnum::FLEET_MANAGER => ['index'],
                ]
            ],
            'notices' => [
                'actions' => [
                    'index'   => 'notice.index',
                    'create'  => 'notice.create',
                    'edit'    => 'notice.edit',
                    'trash'   => 'notice.destroy',
                    'restore' => 'notice.restore',
                    'delete'  => 'notice.forceDelete'
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create', 'edit', 'trash', 'restore', 'delete'],
                ]
            ],
            'driver_wallets' => [
                'actions' => [
                    'index'   => 'driver_wallet.index',
                    'credit'  => 'driver_wallet.credit',
                    'debit'    => 'driver_wallet.debit',
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create', 'edit'],
                    RoleEnum::DRIVER => ['index'],
                ]
            ],
            'services' => [
                'actions' => [
                    'index'   => 'service.index',
                    'edit'    => 'service.edit',
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index','edit'],
                    RoleEnum::RIDER => ['index'],
                    RoleEnum::DRIVER => ['index'],
                    RoleEnum::DISPATCHER => ['index'],
                    RoleEnum::FLEET_MANAGER => ['index'],
                ]
            ],
            'onboardings' => [
                'actions' => [
                    'index'   => 'onboarding.index',
                    'edit'    => 'onboarding.edit',
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index','edit'],
                ]
            ],
            'service_categories' => [
                'actions' => [
                    'index'   => 'service_category.index',
                    'edit'    => 'service_category.edit',
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'edit'],
                    RoleEnum::RIDER => ['index'],
                    RoleEnum::DRIVER => ['index'],
                    RoleEnum::DISPATCHER => ['index'],
                    RoleEnum::FLEET_MANAGER => ['index'],
                ],
            ],
            'taxido_settings' => [
                'actions' => [
                    'index'   =>  'taxido_setting.index',
                    'edit'    =>  'taxido_setting.edit',
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'edit'],
                ]
            ],
            'ride_request' => [
                'actions' => [
                    'index'   => 'ride_request.index',
                    'create'  => 'ride_request.create',
                    'edit'    => 'ride_request.edit',
                    'trash'   => 'ride_request.destroy',
                    'restore' => 'ride_request.restore',
                    'delete'  => 'ride_request.forceDelete'
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create', 'edit'],
                    RoleEnum::DRIVER => ['index', 'edit'],
                    RoleEnum::RIDER => ['index','create', 'edit', 'trash'],
                    RoleEnum::DISPATCHER => ['index', 'edit', 'trash', 'restore'],
                    RoleEnum::FLEET_MANAGER => ['index'],
                ],
            ],
            'rides' => [
                'actions' => [
                    'index'   => 'ride.index',
                    'create'  => 'ride.create',
                    'edit'    => 'ride.edit',
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create', 'edit'],
                    RoleEnum::DRIVER => ['index', 'edit'],
                    RoleEnum::RIDER => ['index','create','edit'],
                    RoleEnum::DISPATCHER => ['index', 'edit'],
                    RoleEnum::FLEET_MANAGER => ['index'],
                ]
            ],
            'plans' => [
                'actions' => [
                    'index'   => 'plan.index',
                    'create'  => 'plan.create',
                    'edit'    => 'plan.edit',
                    'trash'   => 'plan.destroy',
                    'restore' => 'plan.restore',
                    'delete'  => 'plan.forceDelete'
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create', 'edit', 'trash', 'restore', 'delete'],
                    RoleEnum::DRIVER => ['index'],
                ]
            ],
            'airports' => [
                'actions' => [
                    'index'   => 'airport.index',
                    'create'  => 'airport.create',
                    'edit'    => 'airport.edit',
                    'trash'   => 'airport.destroy',
                    'restore' => 'airport.restore',
                    'delete'  => 'airport.forceDelete'
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create', 'edit', 'trash', 'restore', 'delete'],
                    RoleEnum::DRIVER => ['index'],
                ]
            ],
            'surge_prices' => [
                'actions' => [
                    'index'   => 'surge_price.index',
                    'create'  => 'surge_price.create',
                    'edit'    => 'surge_price.edit',
                    'trash'   => 'surge_price.destroy',
                    'restore' => 'surge_price.restore',
                    'delete'  => 'surge_price.forceDelete'
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create', 'edit', 'trash', 'restore', 'delete'],
                    RoleEnum::DRIVER => ['index'],
                ]
            ],
            'subscriptions' => [
                'actions' => [
                    'index' => 'subscription.index',
                    'create' => 'subscription.create',
                    'edit' => 'subscription.edit',
                    'destroy' => 'subscription.destroy',
                    'purchase' => 'subscription.purchase',
                    'cancel' => 'subscription.cancel',
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create', 'edit', 'destroy'],
                    RoleEnum::DRIVER => ['index', 'purchase', 'cancel'],
                ],
            ],
            'bids' => [
                'actions' => [
                    'index'   => 'bid.index',
                    'create'  => 'bid.create',
                    'edit'    => 'bid.edit',
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create', 'edit'],
                    RoleEnum::DRIVER => ['index','create'],
                    RoleEnum::RIDER => ['index','edit',]
                ]
            ],
            'push_notifications' => [
                'actions' => [
                    'index' => 'push_notification.index',
                    'create' => 'push_notification.create',
                    'trash' => 'push_notification.destroy',
                    'delete'  => 'push_notification.forceDelete'
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index','create','trash','delete'],
                ]
            ],
            'rider_wallets' => [
                'actions' => [
                    'index'   => 'rider_wallet.index',
                    'credit'  => 'rider_wallet.credit',
                    'debit'    => 'rider_wallet.debit',
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create', 'edit'],
                    RoleEnum::RIDER => ['index'],
                ]
            ],
            'withdraw_requests' => [
                'actions' => [
                    'index' => 'withdraw_request.index',
                    'create' => 'withdraw_request.create',
                    'edit' => 'withdraw_request.edit',
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create', 'edit'],
                    RoleEnum::DRIVER => ['index','create'],
                    RoleEnum::FLEET_MANAGER => ['index','create'],
                ]
            ],
            'fleet_withdraw_requests' => [
                'actions' => [
                    'index' => 'fleet_withdraw_request.index',
                    'create' => 'fleet_withdraw_request.create',
                    'edit' => 'fleet_withdraw_request.edit',
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create', 'edit'],
                    RoleEnum::FLEET_MANAGER => ['index','create'],
                ]
            ],
            'reports' => [
                'actions' => [
                    'index' => 'report.index',
                    'create' => 'report.create',
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create'],
                ],
            ],
            'driver_locations' => [
                'actions' => [
                    'index' => 'driver_location.index',
                    'create' => 'driver_location.create',
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create'],
                    RoleEnum::DISPATCHER => ['index'],
                    RoleEnum::FLEET_MANAGER => ['index'],
                ],
            ],
            'cancellation_reasons' => [
                'actions' => [
                    'index' => 'cancellation_reason.index',
                    'create' => 'cancellation_reason.create',
                    'edit'    => 'cancellation_reason.edit',
                    'trash'   => 'cancellation_reason.destroy',
                    'restore' => 'cancellation_reason.restore',
                    'delete'  => 'cancellation_reason.forceDelete'
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create', 'edit', 'trash', 'restore', 'delete'],
                    RoleEnum::RIDER => ['index'],
                    RoleEnum::DISPATCHER => ['index'],
                ]
            ],
            'driver_reviews' => [
                'actions' => [
                    'index' => 'driver_review.index',
                    'create' => 'driver_review.create',
                    'trash' => 'driver_review.destroy',
                    'restore' => 'driver_review.restore',
                    'delete' => 'driver_review.forceDelete'
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index','create', 'trash' , 'restore', 'delete'],
                    RoleEnum::RIDER => ['index', 'create', 'destroy'],
                    RoleEnum::DRIVER => ['index']
                ]
            ],
            'rider_reviews' => [
                'actions' => [
                    'index' => 'rider_review.index',
                    'create' => 'rider_review.create',
                    'trash' => 'rider_review.destroy',
                    'restore' => 'rider_review.restore',
                    'delete' => 'rider_review.forceDelete'
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create', 'trash', 'restore', 'delete'],
                    RoleEnum::RIDER => ['index'],
                    RoleEnum::DRIVER => ['index', 'create', 'destroy'],
                ]
            ],
            'hourly_packages' => [
                'actions' => [
                    'index' => 'hourly_package.index',
                    'create'  => 'hourly_package.create',
                    'edit'    => 'hourly_package.edit',
                    'trash' => 'hourly_package.destroy',
                    'restore' => 'hourly_package.restore',
                    'delete' => 'hourly_package.forceDelete'
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create', 'edit', 'trash', 'restore', 'delete'],
                    RoleEnum::RIDER => ['index'],
                    RoleEnum::DRIVER => ['index'],
                ]
            ],
            'sos_alerts' => [
                'actions' => [
                    'index' => 'sos_alert.index',
                    'create'  => 'sos_alert.create',
                    'edit'    => 'sos_alert.edit',
                    'trash' => 'sos_alert.destroy',
                    'restore' => 'sos_alert.restore',
                    'delete' => 'sos_alert.forceDelete'
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create', 'edit', 'trash', 'restore', 'delete'],
                    RoleEnum::RIDER => ['index'],
                    RoleEnum::DRIVER => ['index'],
                ]
            ],
            'rental_vehicles' => [
                'actions' => [
                    'index' => 'rental_vehicle.index',
                    'create' => 'rental_vehicle.create',
                    'edit' => 'rental_vehicle.edit',
                    'trash' => 'rental_vehicle.destroy',
                    'restore' => 'rental_vehicle.restore',
                    'delete' => 'rental_vehicle.forceDelete'

                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create', 'edit', 'trash', 'restore', 'delete'],
                    RoleEnum::DRIVER => ['index', 'create', 'edit', 'trash', 'restore', 'delete'],
                    RoleEnum::RIDER => ['index'],
                ]
            ],
            'fleet_managers' => [
                'actions' => [
                    'index' => 'fleet_manager.index',
                    'create' => 'fleet_manager.create',
                    'edit' => 'fleet_manager.edit',
                    'trash' => 'fleet_manager.destroy',
                    'restore' => 'fleet_manager.restore',
                    'delete' => 'fleet_manager.forceDelete'

                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create', 'edit', 'trash', 'restore', 'delete'],
                    RoleEnum::FLEET_MANAGER => ['index', 'create', 'edit', 'trash', 'restore', 'delete'],
                    RoleEnum::DRIVER => ['index'],
                ]
            ],
            'fleet_wallets' => [
                'actions' => [
                    'index'   => 'fleet_wallet.index',
                    'credit'  => 'fleet_wallet.credit',
                    'debit'    => 'fleet_wallet.debit',
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create', 'edit'],
                    RoleEnum::FLEET_MANAGER => ['index'],
                ]
            ],
            'chats' => [
                'actions' => [
                    'index'   => 'chat.index',
                    'send'  => 'chat.send',
                    'reply'    => 'chat.replay',
                    'delete'    => 'chat.delete',
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'send', 'reply', 'delete'],
                    RoleEnum::DRIVER => ['index', 'send', 'reply', 'delete'],
                    RoleEnum::RIDER => ['index', 'send', 'reply', 'delete'],
                ]
            ],
            'ambulances' => [
                'actions' => [
                    'index' => 'ambulance.index',
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index'],
                    RoleEnum::DRIVER => ['index'],
                    RoleEnum::FLEET_MANAGER => ['index'],
                    RoleEnum::DISPATCHER => ['index'],
                    RoleEnum::RIDER => ['index'],
                ]
            ],
            'fleet_documents' => [
                'actions' => [
                    'index'   => 'fleet_document.index',
                    'create'  => 'fleet_document.create',
                    'edit'    => 'fleet_document.edit',
                    'trash'   => 'fleet_document.destroy',
                    'restore' => 'fleet_document.restore',
                    'delete'  => 'fleet_document.forceDelete'
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create', 'edit', 'trash', 'restore', 'delete'],
                    RoleEnum::DRIVER => ['index', 'create'],
                    RoleEnum::FLEET_MANAGER => ['index','create', 'edit', 'trash', 'restore', 'delete'],
                ]
            ],
            'fleet_vehicle_documents' => [
                'actions' => [
                    'index'   => 'fleet_vehicle_document.index',
                    'create'  => 'fleet_vehicle_document.create',
                    'edit'    => 'fleet_vehicle_document.edit',
                    'trash'   => 'fleet_vehicle_document.destroy',
                    'restore' => 'fleet_vehicle_document.restore',
                    'delete'  => 'fleet_vehicle_document.forceDelete'
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create', 'edit', 'trash', 'restore', 'delete'],
                    RoleEnum::DRIVER => ['index', 'create'],
                    RoleEnum::FLEET_MANAGER => ['index','create', 'edit', 'trash', 'restore', 'delete'],
                ]
            ],
            'vehicle_info' => [
                'actions' => [
                    'index'   => 'vehicle_info.index',
                    'create'  => 'vehicle_info.create',
                    'edit'    => 'vehicle_info.edit',
                    'trash'   => 'vehicle_info.destroy',
                    'restore' => 'vehicle_info.restore',
                    'delete'  => 'vehicle_info.forceDelete'
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create', 'edit', 'trash', 'restore', 'delete'],
                    RoleEnum::DRIVER => ['index'],
                    RoleEnum::FLEET_MANAGER => ['index','create', 'edit', 'trash', 'restore', 'delete'],
                ]
            ],
            'peak_zones' => [
                'actions' => [
                    'index'   => 'peak_zone.index',
                    'create'  => 'peak_zone.create',
                    'edit'    => 'peak_zone.edit',
                    'trash'   => 'peak_zone.destroy',
                    'restore' => 'peak_zone.restore',
                    'delete'  => 'peak_zone.forceDelete'
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create', 'edit', 'trash', 'restore', 'delete'],
                    RoleEnum::DRIVER => ['index'],
                    RoleEnum::FLEET_MANAGER => ['index'],
                    RoleEnum::DISPATCHER =>['index']
                ]
            ],
            'preferences' => [
                'actions' => [
                    'index'   => 'preference.index',
                    'create'  => 'preference.create',
                    'edit'    => 'preference.edit',
                    'trash'   => 'preference.destroy',
                    'restore' => 'preference.restore',
                    'delete'  => 'preference.forceDelete'
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create', 'edit', 'trash', 'restore', 'delete'],
                    RoleEnum::DRIVER => ['index'],
                    RoleEnum::FLEET_MANAGER => ['index'],
                ]
            ],
            'cab_referrals' => [
                'actions' => [
                    'index'   => 'cab_referral.index',
                    'create'  => 'cab_referral.create',
                    'edit'    => 'cab_referral.edit',
                    'trash'   => 'cab_referral.destroy',
                    'restore' => 'cab_referral.restore',
                    'delete'  => 'cab_referral.forceDelete'
                ],
                'roles' => [
                    BaseRoleEnum::ADMIN => ['index', 'create', 'edit', 'trash', 'restore', 'delete'],
                    RoleEnum::RIDER => ['index'],
                ]
            ],
        ];

        // Reset cached roles and permissions
        $admin = getAdmin();
        $adminRole = Role::where('name', BaseRoleEnum::ADMIN)->first();
        $riderPermissions = [];
        $driverPermissions = [];
        $dispatcherPermissions = [];
        $fleetManagerPermissions = [];

        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        foreach ($modules as $key => $value) {
            Module::updateOrCreate(['name' => $key], ['name' => $key, 'actions' => $value['actions']]);
            foreach ($value['actions'] as $action => $permission) {
                if (!Permission::where('name', $permission)?->first()) {
                    Permission::updateOrCreate(['name' => $permission], ['name' => $permission]);
                }

                foreach ($value['roles'] as $role => $allowed_actions) {
                    if ($role == RoleEnum::DRIVER) {
                        if (in_array($action, $allowed_actions)) {
                            $driverPermissions[] = $permission;
                        }
                    }

                    if ($role == RoleEnum::RIDER) {
                        if (in_array($action, $allowed_actions)) {
                            $riderPermissions[] = $permission;
                        }
                    }

                    if ($role == RoleEnum::DISPATCHER) {
                        if (in_array($action, $allowed_actions)) {
                            $dispatcherPermissions[] = $permission;
                        }
                    }

                    if ($role == RoleEnum::FLEET_MANAGER) {
                        if (in_array($action, $allowed_actions)) {
                            $fleetManagerPermissions[] = $permission;
                        }
                    }
                }
            }
        }

        $module = Plugin::where('name', 'Taxido')?->first();
        if(!$module) {
            $module = Plugin::updateOrCreate(['name' => 'Taxido']);
        }

        $adminRole->givePermissionTo(Permission::all());
        $riderRole = Role::updateOrCreate([
            'name' => RoleEnum::RIDER,
            'system_reserve' => true,
            'module' => $module?->id,
        ]);
        $riderRole->givePermissionTo($riderPermissions);
        $driverRole = Role::updateOrCreate([
            'name' => RoleEnum::DRIVER,
            'system_reserve' => true,
            'module' => $module->id,
        ]);
        $driverRole->givePermissionTo($driverPermissions);

        $dispatcherRole = Role::updateOrCreate([
            'name' => RoleEnum::DISPATCHER,
            'system_reserve' => true,
            'module' => $module->id,
        ]);
        $dispatcherRole->givePermissionTo($dispatcherPermissions);

        $fleetManagerRole = Role::updateOrCreate([
            'name' => RoleEnum::FLEET_MANAGER,
            'system_reserve' => true,
            'module' => $module->id,
        ]);
        $fleetManagerRole->givePermissionTo($fleetManagerPermissions);

        $rider = User::updateOrCreate([
            'name' => "John Due",
            'email' => 'rider@example.com',
            'password' => Hash::make('rider@123'),
            'country_code' => (string) '1',
            'phone' => '0123456789',
            'system_reserve' => true,
            'is_verified' => true,
            'created_by_id' => $admin?->id
        ]);

        $rider->assignRole($riderRole);

        $driver = User::updateOrCreate([
            'name' => "Jack Nicole",
            'email' => 'driver@example.com',
            'password' => Hash::make('driver@123'),
            'country_code' => (string) '1',
            'phone' => '1234567890',
            'system_reserve' => true,
            'is_verified' => true,
            'created_by_id' => $admin?->id
        ]);

        $driver->assignRole($driverRole);

        $dispatcher = User::updateOrCreate([
            'name' => "joe Dispatch",
            'email' => 'dispatcher@example.com',
            'password' => Hash::make('dispatcher@123'),
            'country_code' => (string) '1',
            'phone' => '9876543210',
            'system_reserve' => true,
            'is_verified' => true,
            'created_by_id' => $admin?->id
        ]);

        $dispatcher->assignRole($dispatcherRole);

        $fleetManager = User::updateOrCreate([
            'name' => "Fleet Manager",
            'email' => 'fleet@example.com',
            'password' => Hash::make('fleet@123'),
            'country_code' => (string) '1',
            'phone' => '4321098765',
            'system_reserve' => true,
            'is_verified' => true,
            'created_by_id' => $admin?->id
        ]);

        $fleetManager->assignRole($fleetManagerRole);
    }
}
