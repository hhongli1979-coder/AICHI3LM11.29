<?php

namespace App\Tables;

use App\Models\Attachment;
use Illuminate\Http\Request;

class AttachmentTable
{
    protected $attachment;
    protected $request;

    public function __construct(Request $request)
    {
        $this->attachment = new Attachment();
        $this->request    = $request;
    }

    public function getAttachment()
    {
        return $this->attachment
            ->leftJoin('users', 'media.created_by_id', '=', 'users.id')
            ->select('media.*', 'users.name as author')
            ->whereNull('media.deleted_at')->latest();
    }

    public function getData()
    {

        $attachments = $this->getAttachment();
        if ($this->request->has('action') && $this->request->has('ids')) {
            $attachments = $this->bulkActionHandler();
        }

        if (isset($this->request->s)) {
            $search      = $this->request->s;
            $attachments = $attachments->where(function ($query) use ($search) {
                $query->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('file_name', 'LIKE', "%{$search}%");
            });
        }

        if ($this->request->type) {
            $attachments = $attachments->where('mime_type', 'LIKE', "%" . getMediaMimeByType($this->request->type) . "%");
        }

        if ($this->request->has('orderby') && $this->request->has('order')) {
            return $attachments?->orderBy($this->request->orderby, $this->request->order)?->paginate($this->request->paginate);
        }

        return $attachments->paginate($this->request->paginate);
    }

    public function generate()
    {
        $attachments = $this->getData();
        $attachments->each(function ($attachment) {
            $attachment->author = $attachment?->created_by?->name;
        });

        $attachments->each(function ($attachment) {
            $attachment->date = formatDateBySetting($attachment->created_at);
        });

        $totalAttachmentsCount = $attachments->count();
        $tableConfig = [
            'columns' => [
                ['title' => 'File', 'field' => 'name', 'mediaImage' => 'id', 'action' => true, 'sortable' => true],
                ['title' => 'Author', 'field' => 'author', 'sortable' => true],
                ['title' => 'Type', 'field' => 'mime_type', 'sortable' => true],
                ['title' => 'Created At', 'field' => 'date', 'sortable' => true, 'sortField' => 'created_at'],

            ],
            'data' => $attachments,
            'actions' => [
                ['title' => 'Copy URL', 'action' => 'copy', 'field' => 'id', 'class' => 'copy', 'permission' => 'attachment.edit'],
                ['title' => 'Download', 'action' => 'download', 'field' => 'id', 'class' => 'download', 'permission' => 'attachment.create'],
                ['title' => 'Delete Permanently', 'route' => 'admin.media.forceDelete', 'class' => 'delete', 'permission' => 'attachment.destroy'],
            ],
            'bulkactions'        => [
                ['title' => 'Delete Permanently', 'permission' => 'attachment.destroy', 'action' => 'delete'],
            ],
            'actionButtons'      => [],
            'modalActionButtons' => [],
            'total'              => $totalAttachmentsCount,
        ];

        return $tableConfig;
    }

    public function bulkActionHandler()
    {
        switch ($this->request->action) {
            case 'delete':
                return $this->deleteHandler();
        }
    }

    public function deleteHandler()
    {
        $this->attachment->whereIn('id', $this->request->ids ?? [])?->forcedelete();
        return $this->attachment->whereNotIn('id', $this->request->ids ?? [])?->latest();
    }
}
