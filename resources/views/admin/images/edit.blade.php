@extends('layouts.admin')
@section('content')

<div class="card">
    <div class="card-header">
        {{ trans('global.edit') }} {{ trans('cruds.image.title_singular') }}
    </div>

    <div class="card-body">
        <form method="POST" action="{{ route("admin.images.update", [$image->id]) }}" enctype="multipart/form-data">
            @method('PUT')
            @csrf
            <div class="form-group">
                <label for="path">{{ trans('cruds.image.fields.path') }}</label>
                <input class="form-control {{ $errors->has('path') ? 'is-invalid' : '' }}" type="text" name="path" id="path" value="{{ old('path', $image->path) }}">
                @if($errors->has('path'))
                    <div class="invalid-feedback">
                        {{ $errors->first('path') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.image.fields.path_helper') }}</span>
            </div>
            <div class="form-group">
                <label for="user_id">{{ trans('cruds.image.fields.user') }}</label>
                <select class="form-control select2 {{ $errors->has('user') ? 'is-invalid' : '' }}" name="user_id" id="user_id">
                    @foreach($users as $id => $user)
                        <option value="{{ $id }}" {{ (old('user_id') ? old('user_id') : $image->user->id ?? '') == $id ? 'selected' : '' }}>{{ $user }}</option>
                    @endforeach
                </select>
                @if($errors->has('user'))
                    <div class="invalid-feedback">
                        {{ $errors->first('user') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.image.fields.user_helper') }}</span>
            </div>
            <div class="form-group">
                <button class="btn btn-danger" type="submit">
                    {{ trans('global.save') }}
                </button>
            </div>
        </form>
    </div>
</div>



@endsection