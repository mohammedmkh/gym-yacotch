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
                <label for="nametable">{{ trans('cruds.translation.fields.nametable') }}</label>
                <input class="form-control {{ $errors->has('nametable') ? 'is-invalid' : '' }}" type="text" name="nametable" id="nametable" value="{{ old('nametable', $translation->nametable) }}">
                @if($errors->has('nametable'))
                    <div class="invalid-feedback">
                        {{ $errors->first('nametable') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.translation.fields.nametable_helper') }}</span>
            </div>
            <div class="form-group">
                <label for="nametableid">{{ trans('cruds.translation.fields.nametableid') }}</label>
                <input class="form-control {{ $errors->has('nametableid') ? 'is-invalid' : '' }}" type="text" name="nametableid" id="nametableid" value="{{ old('nametableid', $translation->nametableid) }}">
                @if($errors->has('nametableid'))
                    <div class="invalid-feedback">
                        {{ $errors->first('nametableid') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.translation.fields.nametableid_helper') }}</span>
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