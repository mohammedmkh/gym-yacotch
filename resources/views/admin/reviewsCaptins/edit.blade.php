@extends('layouts.admin')
@section('content')

<div class="card">
    <div class="card-header">
        {{ trans('global.edit') }} {{ trans('cruds.reviewsCaptin.title_singular') }}
    </div>

    <div class="card-body">
        <form method="POST" action="{{ route("admin.reviews-captins.update", [$reviewsCaptin->id]) }}" enctype="multipart/form-data">
            @method('PUT')
            @csrf
            <div class="form-group">
                <label for="captin_id">{{ trans('cruds.reviewsCaptin.fields.captin') }}</label>
                <select class="form-control select2 {{ $errors->has('captin') ? 'is-invalid' : '' }}" name="captin_id" id="captin_id">
                    @foreach($captins as $id => $captin)
                        <option value="{{ $id }}" {{ (old('captin_id') ? old('captin_id') : $reviewsCaptin->captin->id ?? '') == $id ? 'selected' : '' }}>{{ $captin }}</option>
                    @endforeach
                </select>
                @if($errors->has('captin'))
                    <div class="invalid-feedback">
                        {{ $errors->first('captin') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.reviewsCaptin.fields.captin_helper') }}</span>
            </div>
            <div class="form-group">
                <label for="user_id">{{ trans('cruds.reviewsCaptin.fields.user') }}</label>
                <select class="form-control select2 {{ $errors->has('user') ? 'is-invalid' : '' }}" name="user_id" id="user_id">
                    @foreach($users as $id => $user)
                        <option value="{{ $id }}" {{ (old('user_id') ? old('user_id') : $reviewsCaptin->user->id ?? '') == $id ? 'selected' : '' }}>{{ $user }}</option>
                    @endforeach
                </select>
                @if($errors->has('user'))
                    <div class="invalid-feedback">
                        {{ $errors->first('user') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.reviewsCaptin.fields.user_helper') }}</span>
            </div>
            <div class="form-group">
                <label for="review">{{ trans('cruds.reviewsCaptin.fields.review') }}</label>
                <input class="form-control {{ $errors->has('review') ? 'is-invalid' : '' }}" type="text" name="review" id="review" value="{{ old('review', $reviewsCaptin->review) }}">
                @if($errors->has('review'))
                    <div class="invalid-feedback">
                        {{ $errors->first('review') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.reviewsCaptin.fields.review_helper') }}</span>
            </div>
            <div class="form-group">
                <label for="note">{{ trans('cruds.reviewsCaptin.fields.note') }}</label>
                <input class="form-control {{ $errors->has('note') ? 'is-invalid' : '' }}" type="text" name="note" id="note" value="{{ old('note', $reviewsCaptin->note) }}">
                @if($errors->has('note'))
                    <div class="invalid-feedback">
                        {{ $errors->first('note') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.reviewsCaptin.fields.note_helper') }}</span>
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