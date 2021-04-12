@extends('layouts.admin')
@section('content')

<div class="card">
    <div class="card-header">
        {{ trans('global.create') }} {{ trans('cruds.setting.title_singular') }}
    </div>

    <div class="card-body">
        <form method="POST" action="{{ route("admin.settings.store") }}" enctype="multipart/form-data">
            @csrf
            <div class="form-group">
                <label for="text_policy">{{ trans('cruds.setting.fields.text_policy') }}</label>
                <input class="form-control {{ $errors->has('text_policy') ? 'is-invalid' : '' }}" type="text" name="text_policy" id="text_policy" value="{{ old('text_policy', '') }}">
                @if($errors->has('text_policy'))
                    <div class="invalid-feedback">
                        {{ $errors->first('text_policy') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.setting.fields.text_policy_helper') }}</span>
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