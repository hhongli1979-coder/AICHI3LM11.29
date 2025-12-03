@foreach ($childs as $child)
<li>
    <div class="form-check">
        <input type="checkbox" id="categories-{{$child->id}}" data-id="{{$child->id}}" data-parent="{{$child->parent_id}}" name="categories[]" class="form-check-input" value="{{ $child->id }}" @checked(isset($blog) ?
        $blog->categories->pluck('id')->contains($child->id): false)>
        <label for="categories-{{$child->id}}">{{ $child->name }}</label>
    </div>
    @if (!$child?->childs?->isEmpty())
        <ul>
            @include('components.category', ['childs' => $child?->childs])
        </ul>
    @endif
</li>
@endforeach
