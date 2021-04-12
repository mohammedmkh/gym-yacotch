@extends('layouts.admin')
@section('content')

<div class="card">
    <div class="card-header">
        {{ trans('global.create') }} {{ trans('cruds.reportoncaptin.title_singular') }}
    </div>

    <div class="card-body">
        <form method="POST" action="{{ route("admin.reportoncaptins.store") }}" enctype="multipart/form-data">
            @csrf
            <div class="form-group">
                <label for="captin_id">{{ trans('cruds.reportoncaptin.fields.captin') }}</label>
                <select class="form-control select2 {{ $errors->has('captin') ? 'is-invalid' : '' }}" name="captin_id" id="captin_id">
                    @foreach($captins as $id => $captin)
                        <option value="{{ $id }}" {{ old('captin_id') == $id ? 'selected' : '' }}>{{ $captin }}</option>
                    @endforeach
                </select>
                @if($errors->has('captin'))
                    <div class="invalid-feedback">
                        {{ $errors->first('captin') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.reportoncaptin.fields.captin_helper') }}</span>
            </div>
            <div class="form-group">
                <label for="user_id">{{ trans('cruds.reportoncaptin.fields.user') }}</label>
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
                <span class="help-block">{{ trans('cruds.reportoncaptin.fields.user_helper') }}</span>
            </div>
            <div class="form-group">
                <label for="course_id">{{ trans('cruds.reportoncaptin.fields.course') }}</label>
                <select class="form-control select2 {{ $errors->has('course') ? 'is-invalid' : '' }}" name="course_id" id="course_id">
                    @foreach($courses as $id => $course)
                        <option value="{{ $id }}" {{ old('course_id') == $id ? 'selected' : '' }}>{{ $course }}</option>
                    @endforeach
                </select>
                @if($errors->has('course'))
                    <div class="invalid-feedback">
                        {{ $errors->first('course') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.reportoncaptin.fields.course_helper') }}</span>
            </div>
            <div class="form-group">
                <label for="text">{{ trans('cruds.reportoncaptin.fields.text') }}</label>
                <input class="form-control {{ $errors->has('text') ? 'is-invalid' : '' }}" type="text" name="text" id="text" value="{{ old('text', '') }}">
                @if($errors->has('text'))
                    <div class="invalid-feedback">
                        {{ $errors->first('text') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.reportoncaptin.fields.text_helper') }}</span>
            </div>
            <div class="form-group">
                <label for="date">{{ trans('cruds.reportoncaptin.fields.date') }}</label>
                <input class="form-control datetime {{ $errors->has('date') ? 'is-invalid' : '' }}" type="text" name="date" id="date" value="{{ old('date') }}">
                @if($errors->has('date'))
                    <div class="invalid-feedback">
                        {{ $errors->first('date') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.reportoncaptin.fields.date_helper') }}</span>
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