@can($viewGate)
    <a class="btn btn-xs btn-primary" href="{{ route('admin.' . $crudRoutePart . '.show', $row->id) }}">
        {{ trans('global.view') }}
    </a>
@endcan
@can($editGate)
    <a class="btn btn-xs btn-info" href="{{ route('admin.' . $crudRoutePart . '.edit', $row->id) }}">
        {{ trans('global.edit') }}
    </a>
@endcan
@can($deleteGate)
    <form action="{{ route('admin.' . $crudRoutePart . '.destroy', $row->id) }}" method="POST" name="formdelete{{$row->id}}">
        <input type="hidden" name="_method" value="DELETE">
        <input type="hidden" name="_token" value="{{ csrf_token() }}">
        <button type="button" class="btn btn-xs btn-danger " onclick="deleteBtn({{$row->id}})"  >{{ trans('global.delete') }}</button>
    </form>
@endcan


