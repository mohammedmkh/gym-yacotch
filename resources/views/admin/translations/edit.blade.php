@extends('layouts.admin')
@section('content')

<div class="card">
    <div class="card-header">
        {{ trans('global.edit') }} {{ trans('cruds.translation.title_singular') }}
    </div>

    <div class="card-body">
        <form method="POST" action="{{ route("admin.translations.update", [$translation->id]) }}" enctype="multipart/form-data">
            @method('PUT')
            @csrf
            <div class="form-group">
                <label for="lang_id">{{ trans('cruds.translation.fields.lang') }}</label>
                <select class="form-control select2 {{ $errors->has('lang') ? 'is-invalid' : '' }}" name="lang_id" id="lang_id">
                    @foreach($langs as $id => $lang)
                        <option value="{{ $id }}" {{ (old('lang_id') ? old('lang_id') : $translation->lang->id ?? '') == $id ? 'selected' : '' }}>{{ $lang }}</option>
                    @endforeach
                </select>
                @if($errors->has('lang'))
                    <div class="invalid-feedback">
                        {{ $errors->first('lang') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.translation.fields.lang_helper') }}</span>
            </div>
            <div class="form-group">
                <label for="transtable_type">{{ trans('cruds.translation.fields.transtable_type') }}</label>
                <input class="form-control {{ $errors->has('transtable_type') ? 'is-invalid' : '' }}" type="text" name="transtable_type" id="transtable_type" value="{{ old('transtable_type', $translation->transtable_type) }}">
                @if($errors->has('transtable_type'))
                    <div class="invalid-feedback">
                        {{ $errors->first('transtable_type') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.translation.fields.transtable_type_helper') }}</span>
            </div>
            <div class="form-group">
                <label for="transtable_id">{{ trans('cruds.translation.fields.transtable_id') }}</label>
                <input class="form-control {{ $errors->has('transtable_id') ? 'is-invalid' : '' }}" type="text" name="transtable_id" id="transtable_id" value="{{ old('transtable_id', $translation->transtable_id) }}">
                @if($errors->has('transtable_id'))
                    <div class="invalid-feedback">
                        {{ $errors->first('transtable_id') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.translation.fields.transtable_id_helper') }}</span>
            </div>
            <div class="form-group">
                <label for="values">{{ trans('cruds.translation.fields.values') }}</label>
                <input class="form-control {{ $errors->has('values') ? 'is-invalid' : '' }}" type="text" name="values" id="values" value="{{ old('values', $translation->values) }}">
                @if($errors->has('values'))
                    <div class="invalid-feedback">
                        {{ $errors->first('values') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.translation.fields.values_helper') }}</span>
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
