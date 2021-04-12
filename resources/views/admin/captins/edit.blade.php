@extends('layouts.admin')
@section('content')

<div class="card">
    <div class="card-header">
        {{ trans('global.edit') }} {{ trans('cruds.captin.title_singular') }}
    </div>

    <div class="card-body">
        <form method="POST" action="{{ route("admin.captins.update", [$captin->id]) }}" enctype="multipart/form-data">
            @method('PUT')
            @csrf
            <div class="form-group">
                <label for="bio">{{ trans('cruds.captin.fields.bio') }}</label>
                <input class="form-control {{ $errors->has('bio') ? 'is-invalid' : '' }}" type="text" name="bio" id="bio" value="{{ old('bio', $captin->bio) }}">
                @if($errors->has('bio'))
                    <div class="invalid-feedback">
                        {{ $errors->first('bio') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.captin.fields.bio_helper') }}</span>
            </div>
            <div class="form-group">
                <label for="image">{{ trans('cruds.captin.fields.image') }}</label>
                <input class="form-control {{ $errors->has('image') ? 'is-invalid' : '' }}" type="text" name="image" id="image" value="{{ old('image', $captin->image) }}">
                @if($errors->has('image'))
                    <div class="invalid-feedback">
                        {{ $errors->first('image') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.captin.fields.image_helper') }}</span>
            </div>
            <div class="form-group">
                <label for="cv">{{ trans('cruds.captin.fields.cv') }}</label>
                <input class="form-control {{ $errors->has('cv') ? 'is-invalid' : '' }}" type="text" name="cv" id="cv" value="{{ old('cv', $captin->cv) }}">
                @if($errors->has('cv'))
                    <div class="invalid-feedback">
                        {{ $errors->first('cv') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.captin.fields.cv_helper') }}</span>
            </div>
            <div class="form-group">
                <label for="hours_cost">{{ trans('cruds.captin.fields.hours_cost') }}</label>
                <input class="form-control {{ $errors->has('hours_cost') ? 'is-invalid' : '' }}" type="text" name="hours_cost" id="hours_cost" value="{{ old('hours_cost', $captin->hours_cost) }}">
                @if($errors->has('hours_cost'))
                    <div class="invalid-feedback">
                        {{ $errors->first('hours_cost') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.captin.fields.hours_cost_helper') }}</span>
            </div>
            <div class="form-group">
                <label for="user_id">{{ trans('cruds.captin.fields.user') }}</label>
                <select class="form-control select2 {{ $errors->has('user') ? 'is-invalid' : '' }}" name="user_id" id="user_id">
                    @foreach($users as $id => $user)
                        <option value="{{ $id }}" {{ (old('user_id') ? old('user_id') : $captin->user->id ?? '') == $id ? 'selected' : '' }}>{{ $user }}</option>
                    @endforeach
                </select>
                @if($errors->has('user'))
                    <div class="invalid-feedback">
                        {{ $errors->first('user') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.captin.fields.user_helper') }}</span>
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