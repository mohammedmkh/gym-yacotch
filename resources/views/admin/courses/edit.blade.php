@extends('layouts.admin')
@section('content')

<div class="card">
    <div class="card-header">
        {{ trans('global.edit') }} {{ trans('cruds.course.title_singular') }}
    </div>

    <div class="card-body">
        <form method="POST" action="{{ route("admin.courses.update", [$course->id]) }}" enctype="multipart/form-data">
            @method('PUT')
            @csrf
            <div class="form-group">
                <label for="captin_id">{{ trans('cruds.course.fields.captin') }}</label>
                <select class="form-control select2 {{ $errors->has('captin') ? 'is-invalid' : '' }}" name="captin_id" id="captin_id">
                    @foreach($captins as $id => $captin)
                        <option value="{{ $id }}" {{ (old('captin_id') ? old('captin_id') : $course->captin->id ?? '') == $id ? 'selected' : '' }}>{{ $captin }}</option>
                    @endforeach
                </select>
                @if($errors->has('captin'))
                    <div class="invalid-feedback">
                        {{ $errors->first('captin') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.course.fields.captin_helper') }}</span>
            </div>
            <div class="form-group">
                <label for="name">{{ trans('cruds.course.fields.name') }}</label>
                <input class="form-control {{ $errors->has('name') ? 'is-invalid' : '' }}" type="text" name="name" id="name" value="{{ old('name', $course->name) }}">
                @if($errors->has('name'))
                    <div class="invalid-feedback">
                        {{ $errors->first('name') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.course.fields.name_helper') }}</span>
            </div>
            <div class="form-group">
                <label for="plan_id">{{ trans('cruds.course.fields.plan') }}</label>
                <select class="form-control select2 {{ $errors->has('plan') ? 'is-invalid' : '' }}" name="plan_id" id="plan_id">
                    @foreach($plans as $id => $plan)
                        <option value="{{ $id }}" {{ (old('plan_id') ? old('plan_id') : $course->plan->id ?? '') == $id ? 'selected' : '' }}>{{ $plan }}</option>
                    @endforeach
                </select>
                @if($errors->has('plan'))
                    <div class="invalid-feedback">
                        {{ $errors->first('plan') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.course.fields.plan_helper') }}</span>
            </div>
            <div class="form-group">
                <label for="hours">{{ trans('cruds.course.fields.hours') }}</label>
                <input class="form-control {{ $errors->has('hours') ? 'is-invalid' : '' }}" type="text" name="hours" id="hours" value="{{ old('hours', $course->hours) }}">
                @if($errors->has('hours'))
                    <div class="invalid-feedback">
                        {{ $errors->first('hours') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.course.fields.hours_helper') }}</span>
            </div>
            <div class="form-group">
                <label for="price">{{ trans('cruds.course.fields.price') }}</label>
                <input class="form-control {{ $errors->has('price') ? 'is-invalid' : '' }}" type="number" name="price" id="price" value="{{ old('price', $course->price) }}" step="0.01">
                @if($errors->has('price'))
                    <div class="invalid-feedback">
                        {{ $errors->first('price') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.course.fields.price_helper') }}</span>
            </div>
            <div class="form-group">
                <label for="discount">{{ trans('cruds.course.fields.discount') }}</label>
                <input class="form-control {{ $errors->has('discount') ? 'is-invalid' : '' }}" type="text" name="discount" id="discount" value="{{ old('discount', $course->discount) }}">
                @if($errors->has('discount'))
                    <div class="invalid-feedback">
                        {{ $errors->first('discount') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.course.fields.discount_helper') }}</span>
            </div>
            <div class="form-group">
                <label for="type_course">{{ trans('cruds.course.fields.type_course') }}</label>
                <input class="form-control {{ $errors->has('type_course') ? 'is-invalid' : '' }}" type="text" name="type_course" id="type_course" value="{{ old('type_course', $course->type_course) }}">
                @if($errors->has('type_course'))
                    <div class="invalid-feedback">
                        {{ $errors->first('type_course') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.course.fields.type_course_helper') }}</span>
            </div>
            <div class="form-group">
                <label for="trainee_id">{{ trans('cruds.course.fields.trainee') }}</label>
                <select class="form-control select2 {{ $errors->has('trainee') ? 'is-invalid' : '' }}" name="trainee_id" id="trainee_id">
                    @foreach($trainees as $id => $trainee)
                        <option value="{{ $id }}" {{ (old('trainee_id') ? old('trainee_id') : $course->trainee->id ?? '') == $id ? 'selected' : '' }}>{{ $trainee }}</option>
                    @endforeach
                </select>
                @if($errors->has('trainee'))
                    <div class="invalid-feedback">
                        {{ $errors->first('trainee') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.course.fields.trainee_helper') }}</span>
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