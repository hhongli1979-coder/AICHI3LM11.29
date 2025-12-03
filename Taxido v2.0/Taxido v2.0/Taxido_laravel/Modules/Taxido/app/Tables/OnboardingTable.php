<?php

namespace Modules\Taxido\Tables;

use Illuminate\Http\Request;
use Modules\Taxido\Models\Onboarding;

class OnboardingTable
{
    protected $onboarding;
    protected $request;

    public function __construct(Request $request)
    {
        $this->onboarding = new Onboarding();
        $this->request = $request;
    }

    public function getData()
    {
        $onboardings = $this->onboarding;

        if ($this->request->has('filter')) {
            switch ($this->request->filter) {
                case 'active':
                    $onboardings = $onboardings->where('status', true);
                    break;
                case 'deactive':
                    $onboardings = $onboardings->where('status', false);
                    break;
            }
        }

        if ($this->request->has('s')) {
            return $onboardings->withTrashed()->where(function ($query) {
                $query->where('title', 'LIKE', "%" . $this->request->s . "%");
            })->paginate($this->request->paginate);
        }

        if ($this->request->has('orderby') && $this->request->has('order')) {
            return $onboardings->orderBy($this->request->orderby, $this->request->order)->paginate($this->request?->paginate);
        }

        return $onboardings->paginate($this->request?->paginate);
    }

    public function generate()
    {
        $onboardings = $this->getData();
        if ($this->request->has('action') && $this->request->has('ids')) {
            $this->bulkActionHandler();
        }

       $onboardings->each(function ($onboarding) {
            $onboarding->onboarding_image_id = $onboarding->getTranslation('onboarding_image_id', app()->getLocale());
            $onboarding->title = $onboarding->getTranslation('title', app()->getLocale());
            $onboarding->type = ucfirst($onboarding->type);
            $onboarding->date = formatDateBySetting($onboarding->created_at);
        });

        $tableConfig = [
            'columns' => [
                ['title' => 'Title', 'field' => 'title', 'imageField' => 'onboarding_image_id', 'action' => true, 'sortable' => true],
                ['title' => 'Type', 'field' => 'type', 'imageField' => null, 'sortable' => true],
                ['title' => 'Status', 'field' => 'status', 'route' => 'admin.onboarding.status', 'type' => 'status', 'sortable' => true],
            ],
            'data' => $onboardings,
            'actions' => [
                ['title' => 'Edit', 'route' => 'admin.onboarding.edit', 'url' => '', 'class' => 'edit', 'whenFilter' => ['all', 'active', 'deactive'], 'isTranslate' => true, 'permission' => 'onboarding.edit'],
            ],
            'filters' => [
                ['title' => 'All', 'slug' => 'all', 'count' => $this->onboarding->count()],
                ['title' => 'Active', 'slug' => 'active', 'count' => $this->onboarding->where('status', true)->count()],
                ['title' => 'Deactive', 'slug' => 'deactive', 'count' => $this->onboarding->where('status', false)->count()],
            ],
            'bulkactions' => [
                ['title' => 'Active', 'permission' => 'onboarding.edit', 'action' => 'active'],
                ['title' => 'Deactive', 'permission' => 'onboarding.edit', 'action' => 'deactive'],
            ],
            'total' => $this->onboarding->count()
        ];

        return $tableConfig;
    }

    public function bulkActionHandler()
    {
        switch ($this->request->action) {
            case 'active':
                $this->activeHandler();
                break;
            case 'deactive':
                $this->deactiveHandler();
                break;
        }
    }

    public function activeHandler(): void
    {
        $this->onboarding->whereIn('id', $this->request->ids)->update(['status' => true]);
    }

    public function deactiveHandler(): void
    {
        $this->onboarding->whereIn('id', $this->request->ids)->update(['status' => false]);
    }
}
