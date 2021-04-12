@extends('layouts.admin')
@section('content')

<div class="card">
    <div class="card-header">
        {{ trans('global.create') }} {{ trans('cruds.categoriesTran.title_singular') }}
    </div>

    <div class="card-body">
        <form method="POST" action="{{ route("admin.categories-trans.store") }}" enctype="multipart/form-data">
            @csrf
            <div class="form-group">
                <label for="name">{{ trans('cruds.categoriesTran.fields.name') }}</label>
                <input class="form-control {{ $errors->has('name') ? 'is-invalid' : '' }}" type="text" name="name" id="name" value="{{ old('name', '') }}">
                @if($errors->has('name'))
                    <div class="invalid-feedback">
                        {{ $errors->first('name') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.categoriesTran.fields.name_helper') }}</span>
            </div>
            <div class="form-group">
                <label for="lang_id">{{ trans('cruds.categoriesTran.fields.lang') }}</label>
                <select class="form-control select2 {{ $errors->has('lang') ? 'is-invalid' : '' }}" name="lang_id" id="lang_id">
                    @foreach($langs as $id => $lang)
                        <option value="{{ $id }}" {{ old('lang_id') == $id ? 'selected' : '' }}>{{ $lang }}</option>
                    @endforeach
                </select>
                @if($errors->has('lang'))
                    <div class="invalid-feedback">
                        {{ $errors->first('lang') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.categoriesTran.fields.lang_helper') }}</span>
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