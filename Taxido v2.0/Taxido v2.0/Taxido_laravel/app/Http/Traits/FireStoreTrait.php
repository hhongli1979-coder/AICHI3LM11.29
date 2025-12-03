<?php

namespace App\Http\Traits;

use App\Exceptions\ExceptionHandler;
use Google\Cloud\Firestore\FieldValue;
use Illuminate\Support\Facades\Cache;
use Kreait\Laravel\Firebase\Facades\Firebase;
use Google\Cloud\Firestore\FirestoreClient;
use Google\Cloud\Firestore\DocumentSnapshot;
use Google\Cloud\Firestore\WriteBatch;

trait FireStoreTrait
{
  protected FirestoreClient $firestore;
  protected WriteBatch $batch;

  protected function initializeFireStore(): void
  {
    if (!isset($this->firestore)) {
      $this->firestore = Firebase::firestore()->database();
      $this->batch = $this->firestore->batch();
    }
  }

  // ──────────────────────────────────────────────────────────────
  // 1. GET DOCUMENT
  // ──────────────────────────────────────────────────────────────
  public function fireStoreGetDocument(string $collection, string $documentId, ?array $defaultData = null): array
  {
    $this->initializeFireStore();
    $docRef = $this->firestore->collection($collection)->document($documentId);
    $snapshot = $docRef->snapshot();

    if ($snapshot->exists()) {
      return $snapshot->data() + ['id' => $documentId];
    }

    if ($defaultData !== null) {
      return $this->fireStoreAddDocument($collection, $defaultData, $documentId);
    }

    return [];
  }

  // ──────────────────────────────────────────────────────────────
  // 2. ADD DOCUMENT
  // ──────────────────────────────────────────────────────────────
  public function fireStoreAddDocument(string $collection, array $data, ?string $documentId = null, array $subCollections = []): array
  {
    $this->initializeFireStore();
    $docRef = $documentId
      ? $this->firestore->collection($collection)->document($documentId)
      : $this->firestore->collection($collection)->newDocument();

    $this->batch->set($docRef, $data, ['merge' => false]);
    $this->commitBatch();

    $result = $data;
    $result['id'] = $docRef->id();

    // Subcollections
    foreach ($subCollections as $sub) {
      $subName = $sub['name'] ?? null;
      $docs = $sub['documents'] ?? [];
      if (!$subName || !is_array($docs))
        continue;

      foreach ($docs as $subDoc) {
        $subId = $subDoc['id'] ?? null;
        $subData = $subDoc['data'] ?? [];
        if (!$subId)
          continue;

        $subRef = $docRef->collection($subName)->document($subId);
        $this->batch->set($subRef, $subData);
      }
    }

    if (!empty($subCollections)) {
      $this->commitBatch();
    }

    return $result;
  }

  // ──────────────────────────────────────────────────────────────
  // 3. UPDATE DOCUMENT
  // ──────────────────────────────────────────────────────────────
  public function fireStoreUpdateDocument(
    string $collection,
    string $documentId,
    array $data,
    bool $merge = true,
    bool $formatted = false,
    string $arrayOperation = 'push',
    array $subCollections = []
  ): array {
    $this->initializeFireStore();
    $docRef = $this->firestore->collection($collection)->document($documentId);

    $this->batch->set($docRef, $data, ['merge' => $merge]);
    $this->commitBatch();

    $result = $data;
    $result['id'] = $documentId;

    // Subcollections (same as add)
    foreach ($subCollections as $sub) {
      $subName = $sub['name'] ?? null;
      $docs = $sub['documents'] ?? [];
      if (!$subName || !is_array($docs))
        continue;

      foreach ($docs as $subDoc) {
        $subId = $subDoc['id'] ?? null;
        $subData = $subDoc['data'] ?? [];
        if (!$subId)
          continue;

        $subRef = $docRef->collection($subName)->document($subId);
        $this->batch->set($subRef, $subData);
      }
    }

    if (!empty($subCollections)) {
      $this->commitBatch();
    }

    return $result;
  }

  // ──────────────────────────────────────────────────────────────
  // 4. DELETE DOCUMENT
  // ──────────────────────────────────────────────────────────────
  public function fireStoreDeleteDocument(string $collection, string $documentId): void
  {
    $this->initializeFireStore();
    $docRef = $this->firestore->collection($collection)->document($documentId);
    $this->batch->delete($docRef);
    $this->commitBatch();
  }

  // ──────────────────────────────────────────────────────────────
  // 5. BATCH WRITE (used internally)
  // ──────────────────────────────────────────────────────────────
  public function fireStoreBatchWrite(array $operations): void
  {
    if (empty($operations))
      return;

    $this->initializeFireStore();

    foreach ($operations as $op) {
      $docRef = $this->firestore->collection($op['collection'])->document($op['documentId']);
      $data = $op['data'] ?? [];

      // Handle arrayUnion
      foreach ($data as $field => $value) {
        if ($value instanceof FieldValue) {
          $data[$field] = $value;
        }
      }

      $this->batch->set($docRef, $data, ['merge' => true]);
    }

    $this->commitBatch();
  }

  // ──────────────────────────────────────────────────────────────
  // 6. LIST SUBCOLLECTIONS
  // ──────────────────────────────────────────────────────────────
  public function fireStoreListSubCollections(string $collection, string $documentId, int $pageSize = 100, ?string $pageToken = null): array
  {
    $this->initializeFireStore();
    $docRef = $this->firestore->collection($collection)->document($documentId);
    $collections = $docRef->collections();

    $names = [];
    foreach ($collections as $col) {
      $names[] = $col->name();
    }
    return $names;
  }

  // ──────────────────────────────────────────────────────────────
  // 7. QUERY COLLECTION
  // ──────────────────────────────────────────────────────────────
  public function fireStoreQueryCollection(string $collection, array $filters = [], array $options = []): array
  {
    $this->initializeFireStore();
    $colRef = $this->firestore->collection($collection);

    foreach ($filters as $filter) {
      [$field, $op, $value] = $filter;
      $colRef = $colRef->where($field, $op, $value);
    }

    // Apply orderBy
    if (!empty($options['orderBy'])) {
        [$field, $direction] = $options['orderBy'];
        $direction = strtoupper($direction) === 'DESC' ? 'desc' : 'asc';
        $colRef = $colRef->orderBy($field, $direction);
    }

    // Apply limit
    if (!empty($options['limit'])) {
        $colRef = $colRef->limit((int) $options['limit']);
    }

    $docs = $colRef->documents();
    $result = [];
    foreach ($docs as $doc) {
      if ($doc->exists()) {
        $result[] = $doc->data() + ['id' => $doc->id()];
      }
    }
    return $result;
  }

  // ──────────────────────────────────────────────────────────────
  // 8. LIST COLLECTIONS (root)
  // ──────────────────────────────────────────────────────────────
  public function fireStoreListCollections(): array
  {
    $this->initializeFireStore();
    $collections = $this->firestore->collections();
    $names = [];
    foreach ($collections as $col) {
      $names[] = $col->name();
    }
    return $names;
  }

  // ──────────────────────────────────────────────────────────────
  // 9. DELETE COLLECTION (Single Function Call)
  // ──────────────────────────────────────────────────────────────
  public function fireStoreDeleteCollection(string $collection, int $batchSize = 500): void
  {
    $this->initializeFireStore();

    try {
      $collectionRef = $this->firestore->collection($collection);
      $documents = $collectionRef->limit($batchSize)->documents();

      // If no documents exist, nothing to delete
      if ($documents->isEmpty()) {
        return;
      }

      // Add all documents to batch for deletion
      foreach ($documents as $doc) {
        if ($doc->exists()) {
          $this->batch->delete($doc->reference());
        }
      }

      // Commit the batch
      $this->commitBatch();

      // Recursively continue if more documents exist
      // (Firestore limits batches to 500 operations)
      if ($documents->size() >= $batchSize) {
        $this->fireStoreDeleteCollection($collection, $batchSize);
      }
    } catch (\Throwable $e) {
      throw new ExceptionHandler('Error deleting Firestore collection: ' . $e->getMessage());
    }
  }


  // ──────────────────────────────────────────────────────────────
  // INTERNAL: Commit batch
  // ──────────────────────────────────────────────────────────────
  protected function commitBatch(): void
  {
    try {
      $this->batch->commit();
    } finally {
      $this->batch = $this->firestore->batch(); // reset
    }
  }
}
