@extends('layouts.admin')
@section('content')

<div class="card">
    <div class="card-header">
        {{ trans('global.create') }} {{ trans('cruds.captinCertificate.title_singular') }}
    </div>

    <div class="card-body">
        <form method="POST" action="{{ route("admin.captin-certificates.store") }}" enctype="multipart/form-data">
            @csrf
            <div class="form-group">
                <label for="user_id">{{ trans('cruds.captinCertificate.fields.user') }}</label>
                <select class="form-control select2 {{ $errors->has('user') ? 'is-invalid' : '' }}" name="user_id" id="user_id">
                    @foreach($users as $id => $user)
                        <option value="{{ $id }}" {{ old('user_id') == $id ? 'selected' : '' }}>{{ $user }}</option>
                    @endforeach
                </select>
                @if($errors->has('user'))
                    <div class="invalid-feedback">
                        {{ $errors->first('user') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.captinCertificate.fields.user_helper') }}</span>
            </div>
            <div class="form-group">
                <label for="path">{{ trans('cruds.captinCertificate.fields.path') }}</label>
                <input class="form-control {{ $errors->has('path') ? 'is-invalid' : '' }}" type="text" name="path" id="path" value="{{ old('path', '') }}">
                @if($errors->has('path'))
                    <div class="invalid-feedback">
                        {{ $errors->first('path') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.captinCertificate.fields.path_helper') }}</span>
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