@extends('layouts.admin')
@section('content')

<div class="card">
    <div class="card-header">
        {{ trans('global.create') }} {{ trans('cruds.traineeInforamation.title_singular') }}
    </div>

    <div class="card-body">
        <form method="POST" action="{{ route("admin.trainee-inforamations.store") }}" enctype="multipart/form-data">
            @csrf
            <div class="form-group">
                <label for="user_id">{{ trans('cruds.traineeInforamation.fields.user') }}</label>
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
                <span class="help-block">{{ trans('cruds.traineeInforamation.fields.user_helper') }}</span>
            </div>
            <div class="form-group">
                <label for="weight">{{ trans('cruds.traineeInforamation.fields.weight') }}</label>
                <input class="form-control {{ $errors->has('weight') ? 'is-invalid' : '' }}" type="text" name="weight" id="weight" value="{{ old('weight', '') }}">
                @if($errors->has('weight'))
                    <div class="invalid-feedback">
                        {{ $errors->first('weight') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.traineeInforamation.fields.weight_helper') }}</span>
            </div>
            <div class="form-group">
                <label for="tall">{{ trans('cruds.traineeInforamation.fields.tall') }}</label>
                <input class="form-control {{ $errors->has('tall') ? 'is-invalid' : '' }}" type="text" name="tall" id="tall" value="{{ old('tall', '') }}">
                @if($errors->has('tall'))
                    <div class="invalid-feedback">
                        {{ $errors->first('tall') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.traineeInforamation.fields.tall_helper') }}</span>
            </div>
            <div class="form-group">
                <label for="age">{{ trans('cruds.traineeInforamation.fields.age') }}</label>
                <input class="form-control {{ $errors->has('age') ? 'is-invalid' : '' }}" type="text" name="age" id="age" value="{{ old('age', '') }}">
                @if($errors->has('age'))
                    <div class="invalid-feedback">
                        {{ $errors->first('age') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.traineeInforamation.fields.age_helper') }}</span>
            </div>
            <div class="form-group">
                <label for="reminder_time">{{ trans('cruds.traineeInforamation.fields.reminder_time') }}</label>
                <input class="form-control {{ $errors->has('reminder_time') ? 'is-invalid' : '' }}" type="text" name="reminder_time" id="reminder_time" value="{{ old('reminder_time', '') }}">
                @if($errors->has('reminder_time'))
                    <div class="invalid-feedback">
                        {{ $errors->first('reminder_time') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.traineeInforamation.fields.reminder_time_helper') }}</span>
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