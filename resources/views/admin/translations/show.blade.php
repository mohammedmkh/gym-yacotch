@extends('layouts.admin')
@section('content')

<div class="card">
    <div class="card-header">
        {{ trans('global.show') }} {{ trans('cruds.translation.title') }}
    </div>

    <div class="card-body">
        <div class="form-group">
            <div class="form-group">
                <a class="btn btn-default" href="{{ route('admin.translations.index') }}">
                    {{ trans('global.back_to_list') }}
                </a>
            </div>
            <table class="table table-bordered table-striped">
                <tbody>
                    <tr>
                        <th>
                            {{ trans('cruds.translation.fields.id') }}
                        </th>
                        <td>
                            {{ $translation->id }}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            {{ trans('cruds.translation.fields.lang') }}
                        </th>
                        <td>
                            {{ $translation->lang->name ?? '' }}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            {{ trans('cruds.translation.fields.nametable') }}
                        </th>
                        <td>
                            {{ $translation->nametable }}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            {{ trans('cruds.translation.fields.nametableid') }}
                        </th>
                        <td>
                            {{ $translation->nametableid }}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            {{ trans('cruds.translation.fields.values') }}
                        </th>
                        <td>
                            {{ $translation->values }}
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="form-group">
                <a class="btn btn-default" href="{{ route('admin.translations.index') }}">
                    {{ trans('global.back_to_list') }}
                </a>
            </div>
        </div>
    </div>
</div>



@endsection